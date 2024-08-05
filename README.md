# Repo-Distillery

A script that intakes a link of your repository, pulls files, their structure, and their contents into a single file to be easily generated and added to Claude.

This tool generates a comprehensive context of a GitHub project by cloning the repository and merging selected files into a single document. It's particularly useful for providing context to large language models (LLMs) or for creating project overviews.
Features

Potential future additions:

Adding support for private repositories (using GitHub API tokens)
Implementing a web interface where users can input a GitHub URL
Adding options to customize exclude patterns and include extensions via command-line arguments
Generating output in different formats (e.g., Markdown, HTML)
Implementing a caching system to avoid re-cloning repositories that have been processed recently



Clones GitHub repositories
Automatic file selection based on extensions
Exclusion of common unnecessary directories (e.g., node_modules, .git)
Output in a structured format with file paths

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
Run the script with a GitHub repository URL:
Copynode src/index.js https://github.com/username/repo-name.git
The generated context will be saved as a text file in your current directory.
Customization
You can customize the script by modifying the following variables in src/index.js:

excludePatterns: Add patterns for directories you want to exclude.
includeExtensions: Add or remove file extensions you want to include.

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License.