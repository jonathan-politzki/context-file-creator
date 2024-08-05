# Repo-Distillery

A script that intakes a link of your repository, pulls files, their structure, and their contents into a single file to be easily generated and added to Claude.

Potential future additions:

Adding support for private repositories (using GitHub API tokens)
Implementing a web interface where users can input a GitHub URL
Adding options to customize exclude patterns and include extensions via command-line arguments
Generating output in different formats (e.g., Markdown, HTML)
Implementing a caching system to avoid re-cloning repositories that have been processed recently

This tool generates a comprehensive context of a GitHub project by cloning the repository and merging selected files into a single document. It's particularly useful for providing context to large language models (LLMs) or for creating project overviews.
Features

Clones GitHub repositories
Supports focusing on specific subfolders
Customizable file inclusion and exclusion patterns
Output in a structured format with file paths
Configurable output location

Prerequisites

Node.js (version 12 or higher)
Git

Installation

Clone this repository:
Copygit clone https://github.com/yourusername/github-project-context-generator.git

Navigate to the project directory:
Copycd github-project-context-generator

Install dependencies:
Copynpm install


Usage
Run the script with a GitHub repository URL and optional arguments:
Copynode src/index.js <repo-url> [options]
Options:

--subfolder=<path>: Specify a subfolder within the repository to focus on
--exclude=<patterns>: Comma-separated list of glob patterns to exclude
--include=<patterns>: Comma-separated list of glob patterns to include
--output=<path>: Specify the output directory for the generated file (default: current directory)

Example:
Copynode src/index.js https://github.com/username/repo-name.git --subfolder=frontend --exclude=node_modules/**,build/**,*.log --include=**/*.js,**/*.jsx,**/*.css,**/*.html --output=/path/to/output/directory
Note: When using wildcards in exclude or include patterns, make sure to wrap the entire argument in quotes to prevent shell expansion:
Copynode src/index.js https://github.com/username/repo-name.git --subfolder=frontend "--exclude=node_modules/**,build/**,*.log" "--include=**/*.js,**/*.jsx,**/*.css,**/*.html" --output=/path/to/output/directory
The generated context will be saved as a text file in the specified output directory (or the current directory if not specified).
Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License.