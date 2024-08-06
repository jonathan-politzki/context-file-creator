# Coding Context File Generator

Coding Context File Generator is a web application that simplifies the process of creating context files from GitHub repositories for use with AI models. This tool helps developers quickly generate concise and optimized project overviews, making it easier to work with AI on their projects.

## Features

- Easy-to-use web interface
- GitHub repository processing
- Automatic context file generation with .gitignore application
- Exclusion of irrelevant files for optimized output
- Secure and temporary file handling
- Responsive design with Tailwind CSS
- Google Analytics integration for usage tracking
- Vercel Analytics and Speed Insights for performance monitoring

## Project Structure
REPO-DISTILLERY/
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── server.js
│   ├── package.json
│   └── ... (other backend files)
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── ... (other public assets)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── MainPage.js
│   │   │   ├── AboutPage.js
│   │   │   └── NotFound.js
│   │   ├── App.js
│   │   └── ... (other frontend source files)
│   ├── package.json
│   └── ... (other frontend config files)
├── package.json
└── README.md
Copy
## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or pnpm
- Git

## Installation

1. Clone the repository:
git clone https://github.com/your-username/coding-context-file-generator.git
cd coding-context-file-generator
Copy
2. Install dependencies for both frontend and backend:
cd frontend && npm install
cd ../backend && npm install
Copy
3. Create `.env` files for both frontend and backend with necessary configuration (see `.env.example` files).

## Usage

1. Start the backend server:
cd backend
npm start
Copy
2. In a new terminal, start the frontend development server:
cd frontend
npm start
Copy
3. Open your browser and navigate to `http://localhost:3000`.

4. Enter a GitHub repository URL and click "Generate" to create the context file.

5. Download the generated context file and use it with your preferred AI model.

## Deployment

- The backend is deployed on Heroku.
- The frontend is deployed on Vercel.

Ensure that you've set up the necessary environment variables on both platforms.

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
- [Vercel](https://vercel.com/) for frontend hosting and analytics
- [Heroku](https://www.heroku.com/) for backend hosting
- [Google Analytics](https://analytics.google.com/) for usage tracking
