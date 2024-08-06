import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import claudeLogo from '../assets/claude-logo.png';

const API_URL = process.env.REACT_APP_API_URL || 'https://repo-distillery-backend-5e5b8d247bee.herokuapp.com';

const AboutPage = () => {
  const [suggestion, setSuggestion] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const response = await fetch(`${API_URL}/api/submit-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suggestion }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSuggestion('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-off-white text-gray-900">
      <nav className="p-4 bg-claude-orange">
        <div className="container mx-auto flex justify-between items-center">
          <img src={claudeLogo} alt="Claude Logo" className="h-8" />
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-white hover:text-gray-200">Home</Link></li>
            <li><Link to="/about" className="text-white hover:text-gray-200">About</Link></li>
          </ul>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-claude-orange">About Claude Agent Project Context Generator</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-claude-orange">What is this tool?</h2>
          <p className="mb-4">
            The Claude Agent Project Context Generator is a user-friendly tool designed to help developers easily share their project context with Claude AI. It simplifies the process of getting your project files into a format that Claude can understand and analyze.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-claude-orange">How does it work?</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Enter your GitHub repository URL on the home page.</li>
            <li>Our tool clones your repository and analyzes its structure.</li>
            <li>It generates a single file containing the most relevant parts of your project.</li>
            <li>This file is optimized for upload to Claude, making it easy for the AI to understand your project context.</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-claude-orange">Why use this tool?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Saves time: No need to manually copy and paste files or explain your project structure.</li>
            <li>Improves accuracy: Ensures Claude has the most relevant information about your project.</li>
            <li>Easy to use: Designed for developers of all skill levels, from beginners to experts.</li>
            <li>Respects privacy: Only processes public repositories and doesn't store your code.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-claude-orange">Tips for best results</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Ensure your repository is public and up-to-date.</li>
            <li>Include a clear README.md file in your project root.</li>
            <li>Use meaningful file and folder names.</li>
            <li>Comment your code to provide context where necessary.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-claude-orange">FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Q: Is my code safe?</h3>
              <p>A: Yes, we only process public repositories and don't store any of your code. The generated file is for your use only.</p>
            </div>
            <div>
              <h3 className="font-semibold">Q: What types of projects can I use this for?</h3>
              <p>A: Any project hosted on GitHub! Whether it's a web app, mobile app, data analysis project, or anything else, our tool can help.</p>
            </div>
            <div>
              <h3 className="font-semibold">Q: Do I need to be an expert programmer to use this?</h3>
              <p>A: Not at all! This tool is designed to be user-friendly for developers of all skill levels.</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-claude-orange">Suggest a Feature</h2>
          <p className="mb-4">We're always looking to improve! What would you like this tool to do better?</p>
          <form onSubmit={handleSubmit} className="max-w-lg">
            <textarea
              className="w-full p-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-claude-orange"
              rows="4"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Enter your suggestion here..."
            ></textarea>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-claude-orange text-white rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-claude-orange focus:ring-opacity-50"
            >
              Submit Suggestion
            </button>
          </form>
          {submitStatus === 'success' && (
          <p className="mt-2 text-green-600">Thank you for your suggestion!</p>
        )}
        {submitStatus === 'error' && (
          <p className="mt-2 text-red-600">Failed to submit suggestion. Please try again.</p>
        )}
        </section>
      </div>
    </div>
  );
};

export default AboutPage;