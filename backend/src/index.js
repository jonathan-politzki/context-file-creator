const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const minimatch = require('minimatch');

const { repoUrl, options } = parseArgs(process.argv.slice(2));

if (!repoUrl) {
  console.error('Please provide a GitHub repository URL');
  process.exit(1);
}

generateProjectContext(repoUrl, options).catch(console.error);