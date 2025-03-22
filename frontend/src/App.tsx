// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import StockDashboardPage from './components/StockDashboardPage';

// Component to wrap Routes and conditionally render Navbar
const AppContent = () => {
  const location = useLocation(); // Hook to get the current route

  return (
    <>
      {/* Conditionally render Navbar: show only on the "/" route */}
      {location.pathname === '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Default route: HomePage */}
        <Route path="/inventory" element={<StockDashboardPage />} /> {/* Inventory route: StockDashboardPage */}
        {/* Add other routes as needed */}
      </Routes>
    </>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;