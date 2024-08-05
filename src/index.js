const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

async function cloneRepository(repoUrl) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'project-context-'));
  console.log(`Cloning repository to ${tempDir}...`);
  execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: 'inherit' });
  return tempDir;
}

async function processDirectory(dir, excludePatterns, includeExtensions) {
  const selectedFiles = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!excludePatterns.includes(entry.name)) {
        const subFiles = await processDirectory(fullPath, excludePatterns, includeExtensions);
        selectedFiles.push(...subFiles);
      }
    } else {
      const extension = path.extname(entry.name).toLowerCase();
      if (includeExtensions.includes(extension)) {
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

async function generateProjectContext(repoUrl) {
  const clonedDir = await cloneRepository(repoUrl);
  
  const excludePatterns = ['node_modules', '.git', '.github'];
  const includeExtensions = ['.js', '.py', '.html', '.css', '.md', '.txt', '.json', '.yml', '.yaml', '.xml', '.svg'];
  
  console.log('Processing repository...');
  const selectedFiles = await processDirectory(clonedDir, excludePatterns, includeExtensions);

  const repoName = path.basename(repoUrl, '.git');
  const outputFileName = getTimestampedFileName(repoName);
  const outputFilePath = path.join(process.cwd(), outputFileName);

  console.log('Generating context file...');
  await mergeFiles(selectedFiles, clonedDir, outputFilePath);

  console.log(`Project context generated and saved to: ${outputFilePath}`);

  // Clean up
  await fs.rmdir(clonedDir, { recursive: true });
}

// Example usage
const repoUrl = process.argv[2];
if (!repoUrl) {
  console.error('Please provide a GitHub repository URL');
  process.exit(1);
}

generateProjectContext(repoUrl).catch(console.error);