for (const filePath of selectedFiles) {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);
    const sectionHeader = `\n<file path="${relativePath}">\n`;
    const sectionFooter = `\n</file>\n`;
    mergedContent += sectionHeader + fileContent + sectionFooter;
  }

  await fs.promises.writeFile(outputFilePath, mergedContent);
}

async function createOutputDirectory(outputDirPath) {
  try {
    await fs.promises.access(outputDirPath);
  } catch (error) {
    await fs.promises.mkdir(outputDirPath);
  }
}

function getTimestampedFileName() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  return `project-context-${timestamp}.txt`;
}

async function main() {
  const currentDir = process.cwd();

  console.log('Select files and folders to include in the context generation:');
  const excludePatterns = ['node_modules', '.git']; // Add more patterns if needed
  const includeExtensions = ['.js', '.py', '.html', '.css', '.md', '.txt', '.json']; // Add more extensions if needed
  const selectedFiles = await selectFiles(currentDir, excludePatterns, includeExtensions);

  const outputDirName = 'project_context';
  const outputDirPath = path.join(currentDir, outputDirName);
  await createOutputDirectory(outputDirPath);

  const outputFileName = getTimestampedFileName();
  const outputFilePath = path.join(outputDirPath, outputFileName);
  await mergeFiles(selectedFiles, outputFilePath);

  console.log(`Project context generated and saved to: ${outputFilePath}`);
  rl.close();
}

main().catch(console.error);