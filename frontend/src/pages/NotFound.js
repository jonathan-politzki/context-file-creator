import React from 'react';
import { Link } from 'react-router-dom';
import claudeLogo from '../assets/claude-logo.png'; // Make sure to add this file to your assets folder

const NotFound = () => {
  return (
    <div className="min-h-screen bg-off-white text-gray-900 flex flex-col items-center justify-center">
      <img src={claudeLogo} alt="Claude Logo" className="h-16 mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-claude-orange">404 - Page Not Found</h1>
      <p className="mb-4">The page you are looking for doesn't exist.</p>
      <Link to="/" className="text-claude-orange hover:text-orange-700">Go back to home</Link>
    </div>
  );
};

export default NotFound;