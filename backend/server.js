const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const { minimatch } = require('minimatch');
const ignore = require('ignore');

const app = express();
const port = process.env.PORT || 3001;

const feedbackDir = path.join(__dirname, 'feedback');
fs.mkdir(feedbackDir, { recursive: true }).catch(console.error);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://repo-distillery.vercel.app',
    'https://context-file-creator.vercel.app',
    'https://context-gen-app-980c368d206f.herokuapp.com',
    /https:\/\/context-file-creator-.*\.vercel\.app$/
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

async function cloneRepository(repoUrl) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'project-context-'));
  console.log(`Cloning repository to ${tempDir}...`);
  try {
    execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: 'inherit' });
    return tempDir;
  } catch (error) {
    console.error('Error cloning repository:', error);
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
}

async function readGitignore(dir) {
  try {
    const gitignorePath = path.join(dir, '.gitignore');
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    return ignore().add(gitignoreContent);
  } catch (error) {
    console.log('No .gitignore file found or unable to read it.');
    return ignore();
  }
}

function isTextFile(filePath) {
  const textExtensions = [
    '.txt', '.md', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json', '.yml', '.yaml', 
    '.xml', '.csv', '.ini', '.conf', '.sh', '.bash', '.py', '.rb', '.php', '.java', '.c', '.cpp', 
    '.h', '.swift', '.go', '.rs', '.lua', '.pl', '.sql', '.gitignore', '.env', '.editorconfig',
  ];
  const ext = path.extname(filePath).toLowerCase();
  return textExtensions.includes(ext) || ext === '';
}

function shouldExcludeFile(relativePath) {
  // Exclude frontend build files and NLTK data files
  return relativePath.includes('frontend/build') ||
         relativePath.includes('frontend/dist') ||
         relativePath.includes('nltk_data');
}

async function processDirectory(dir, excludePatterns, includePatterns, gitignore) {
  const selectedFiles = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(dir, fullPath);
    
    if (gitignore.ignores(relativePath) || isGitInternalFile(relativePath) || shouldExcludeFile(relativePath)) {
      continue;
    }
    
    const isExcluded = excludePatterns.some(pattern => minimatch(relativePath, pattern));
    const isIncluded = includePatterns.some(pattern => minimatch(relativePath, pattern));
    
    if (entry.isDirectory()) {
      if (!isExcluded) {
        const subFiles = await processDirectory(fullPath, excludePatterns, includePatterns, gitignore);
        selectedFiles.push(...subFiles);
      }
    } else if (isIncluded && !isExcluded && isTextFile(fullPath)) {
      selectedFiles.push(fullPath);
    }
  }

  return selectedFiles;
}

function isGitInternalFile(filePath) {
  const gitInternalPaths = [
    '.git/objects', '.git/refs', '.git/logs', '.git/hooks', '.git/info',
    '.git/packed-refs', '.git/HEAD', '.git/config', '.git/description', '.git/index',
  ];
  return gitInternalPaths.some(gitPath => filePath.includes(gitPath));
}

async function mergeFiles(selectedFiles, baseDir, outputFilePath) {
  let mergedContent = '';

  for (const filePath of selectedFiles) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(baseDir, filePath);
    mergedContent += `\n<file path="${relativePath}">\n${fileContent}\n</file>\n`;
  }

  await fs.writeFile(outputFilePath, mergedContent);
}

function getTimestampedFileName(repoName) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  return `${repoName}-context-${timestamp}.txt`;
}

async function generateProjectContext(repoUrl, options) {
  let clonedDir;
  try {
    clonedDir = await cloneRepository(repoUrl);
    
    const baseDir = options.subfolder ? path.join(clonedDir, options.subfolder) : clonedDir;
    const excludePatterns = options.exclude || ['.git/**', '.github/**', 'package-lock.json', 'node_modules/**'];
    const includePatterns = options.include || ['**/*'];
    
    const gitignore = await readGitignore(baseDir);
    
    console.log('Processing repository...');
    const selectedFiles = await processDirectory(baseDir, excludePatterns, includePatterns, gitignore);

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
    if (clonedDir) {
      await fs.rm(clonedDir, { recursive: true, force: true }).catch(console.error);
    }
  }
}

app.post('/api/submit-feedback', async (req, res) => {
  try {
    const { suggestion } = req.body;
    if (!suggestion) {
      return res.status(400).json({ error: 'Suggestion is required' });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `feedback_${timestamp}.txt`;
    const filepath = path.join(feedbackDir, filename);

    await fs.writeFile(filepath, suggestion);

    console.log(`Feedback saved: ${filepath}`);
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.post('/generate-context', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { repoUrl, exclude, include } = req.body;
    if (!repoUrl) {
      throw new Error('Repository URL is required');
    }
    const options = { exclude, include };

    const outputFilePath = await generateProjectContext(repoUrl, options);
    
    console.log('Context generated successfully:', outputFilePath);
    res.json({ filePath: outputFilePath });
  } catch (error) {
    console.error('Error generating context:', error);
    res.status(500).json({ error: error.message || 'An error occurred while generating the context file.' });
  }
});

app.get('/download/:filename', async (req, res) => {
  const filePath = path.join(os.tmpdir(), req.params.filename);
  console.log('Attempting to download file:', filePath);
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading the file.');
    } else {
      console.log('File downloaded successfully');
      fs.unlink(filePath).catch(error => console.error('Error deleting file:', error));
    }
  });
});

// This should be the last line in your file
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});