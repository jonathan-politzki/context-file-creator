import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import claudeLogo from '../assets/claude-logo.png';

const MainPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDownloadLink(null);

    try {
      console.log('Submitting URL:', url);
      const response = await fetch('http://localhost:3001/generate-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate context file');
      }

      const data = await response.json();
      console.log('Received data:', data);
      const filename = data.filePath.split('/').pop();
      setDownloadLink(`http://localhost:3001/download/${filename}`);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white text-gray-900 flex flex-col items-center justify-center">
      <nav className="absolute top-0 left-0 right-0 p-4 bg-claude-orange">
        <div className="container mx-auto flex justify-between items-center">
          <img src={claudeLogo} alt="Claude Logo" className="h-8" />
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-white hover:text-gray-200">Home</Link></li>
            <li><Link to="/about" className="text-white hover:text-gray-200">About</Link></li>
          </ul>
        </div>
      </nav>
      <div className="text-center mb-8 mt-16">
        <h1 className="text-4xl font-bold mb-2 text-claude-orange">Claude Agent Project Context Generator</h1>
        <p className="text-xl text-gray-700">Generate project context for Claude AI</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex items-center border-b border-claude-orange py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Enter your GitHub repository URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-claude-orange hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Analyze'}
          </button>
        </div>
      </form>
      
      <AnimatePresence>
        {(error || downloadLink) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mt-8 bg-white rounded-lg p-6 shadow-lg overflow-hidden"
          >
            {error && (
              <p className="text-red-500">{error}</p>
            )}
            {downloadLink && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-claude-orange">Context File Generated</h2>
                <p className="text-gray-700 mb-4">Your project context file is ready for download.</p>
                <a
                  href={downloadLink}
                  download
                  className="bg-claude-orange hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download Context File
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainPage;