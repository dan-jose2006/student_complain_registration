// Import React core library
import React from 'react';
// Import ReactDOM client for rendering React components into the browser DOM
import ReactDOM from 'react-dom/client';
// Import root application component containing router, providers, and main UI
import App from './App';
// Import global styling rules, CSS custom properties, and Tailwind/utility definitions
import './index.css';

// Locate HTML element with ID 'root' and mount the React component tree
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode highlights potential problems and side-effects during development
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

