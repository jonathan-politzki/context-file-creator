const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const minimatch = require('minimatch');

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

async function generateProjectContext(repoUrl, options) {
  const clonedDir = await cloneRepository(repoUrl);
  
  const baseDir = options.subfolder ? path.join(clonedDir, options.subfolder) : clonedDir;
  const excludePatterns = options.exclude || ['node_modules/**', '.git/**', '.github/**'];
  const includePatterns = options.include || ['**/*'];
  
  console.log('Processing repository...');
  const selectedFiles = await processDirectory(baseDir, excludePatterns, includePatterns);

  const repoName = path.basename(repoUrl, '.git');
  const outputFileName = getTimestampedFileName(repoName);
  const outputDir = options.output || process.cwd();
  const outputFilePath = path.join(outputDir, outputFileName);

  console.log('Generating context file...');
  await mergeFiles(selectedFiles, baseDir, outputFilePath);

  console.log(`Project context generated and saved to: ${outputFilePath}`);

  // Clean up
  await fs.rmdir(clonedDir, { recursive: true });
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

const { repoUrl, options } = parseArgs(process.argv.slice(2));

if (!repoUrl) {
  console.error('Please provide a GitHub repository URL');
  process.exit(1);
}

generateProjectContext(repoUrl, options).catch(console.error);