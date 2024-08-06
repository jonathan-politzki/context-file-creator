# Claude Agent Project Context Generator

Claude Agent Project Context Generator is a web application that simplifies the process of creating context files from GitHub repositories for use with Claude AI. This tool helps developers quickly generate comprehensive project overviews, making it easier to work with Claude AI on their projects.

## Features

- Easy-to-use web interface
- GitHub repository processing
- Automatic context file generation
- Secure and temporary file handling
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/claude-agent-project-context-generator.git
   cd claude-agent-project-context-generator
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Create `.env` files for both frontend and backend with necessary configuration (see `.env.example` files).

## Usage

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

4. Enter a GitHub repository URL and click "Analyze" to generate the context file.

5. Download the generated context file and use it with Claude AI.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anthropic](https://www.anthropic.com/) for Claude AI


Repo-Distillery/
├── backend/
│   ├── back_env/
│   ├── node_modules/
│   └── src/
│       ├── index.js
│       ├── package-lock.json
│       ├── package.json
│       ├── requirements.txt
│       └── server.js
├── frontend/
│   ├── .vscode/
│   ├── delta_env/
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.png
│   │   ├── index.html
│   │   └── manifest.json
│   └── src/
│       ├── assets/
│       │   └── claude-logo.png
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       │   ├── AboutPage.js
│       │   ├── MainPage.js
│       │   └── NotFound.js
│       ├── services/
│       ├── utils/
│       ├── App.js
│       ├── index.css
│       ├── index.js
│       ├── reportWebVitals.js
│       ├── tailwind.css
│       ├── .env.example
│       ├── package-lock.json
│       ├── package.json
│       ├── postcss.config.js
│       ├── README.md
│       ├── requirements.txt
│       └── tailwind.config.js
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── README.md