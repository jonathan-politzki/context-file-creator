const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const { minimatch } = require('minimatch');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function cloneRepository(repoUrl) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'project-context-'));
    console.log(`Cloning repository to ${tempDir}...`);
    execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: 'inherit' });
    return tempDir;
  }
  
  async function processDirectory(dir, excludePatterns, includePatterns) {
    const selectedFiles = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
  
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(dir, fullPath);
      
      if (entry.isDirectory()) {
        if (!excludePatterns.some(pattern => minimatch(relativePath, pattern))) {
          const subFiles = await processDirectory(fullPath, excludePatterns, includePatterns);
          selectedFiles.push(...subFiles);
        }
      } else {
        if (includePatterns.some(pattern => minimatch(relativePath, pattern))) {
          selectedFiles.push(fullPath);
        }
      }
    }
  
    return selectedFiles;
  }
  
  async function mergeFiles(selectedFiles, baseDir, outputFilePath) {
    let mergedContent = '';
  
    for (const filePath of selectedFiles) {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(baseDir, filePath);
      const sectionHeader = `\n<file path="${relativePath}">\n`;
      const sectionFooter = `\n</file>\n`;
      mergedContent += sectionHeader + fileContent + sectionFooter;
    }
  
    await fs.writeFile(outputFilePath, mergedContent);
  }
  
  function getTimestampedFileName(repoName) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    return `${repoName}-context-${timestamp}.txt`;
  }
  
  // Parse command line arguments
  function parseArgs(args) {
    const options = {};
    let repoUrl;
  
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        if (key === 'exclude' || key === 'include') {
          options[key] = value.split(',');
        } else {
          options[key] = value;
        }
      } else if (!repoUrl) {
        repoUrl = arg;
      }
    }
  
    return { repoUrl, options };
  }
  async function generateProjectContext(repoUrl, options) {
    let clonedDir;
    try {
      clonedDir = await cloneRepository(repoUrl);
      
      const baseDir = options.subfolder ? path.join(clonedDir, options.subfolder) : clonedDir;
      const excludePatterns = options.exclude || ['node_modules/**', '.git/**', '.github/**'];
      const includePatterns = options.include || ['**/*'];
      
      console.log('Processing repository...');
      const selectedFiles = await processDirectory(baseDir, excludePatterns, includePatterns);
  
      const repoName = path.basename(repoUrl, '.git');
      const outputFileName = getTimestampedFileName(repoName);
      const outputDir = options.output || os.tmpdir();
      const outputFilePath = path.join(outputDir, outputFileName);
  
      console.log('Generating context file...');
      await mergeFiles(selectedFiles, baseDir, outputFilePath);
  
      console.log(`Project context generated and saved to: ${outputFilePath}`);
  
      return outputFilePath;
    } catch (error) {
      console.error('Error in generateProjectContext:', error);
      throw error;
    } finally {
      // Clean up
      if (clonedDir) {
        await fs.rm(clonedDir, { recursive: true, force: true }).catch(console.error);
      }
    }
  }

app.post('/generate-context', async (req, res) => {
  try {
    const { repoUrl } = req.body;
    const options = {}; // You can add more options here if needed

    const outputFilePath = await generateProjectContext(repoUrl, options);
    
    res.json({ filePath: outputFilePath });
  } catch (error) {
    console.error('Error generating context:', error);
    res.status(500).json({ error: 'An error occurred while generating the context file.' });
  }
});

app.get('/download/:filename', async (req, res) => {
  const filePath = path.join(os.tmpdir(), req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('Error downloading the file.');
    }
    // Delete the file after download
    fs.unlink(filePath).catch(console.error);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});