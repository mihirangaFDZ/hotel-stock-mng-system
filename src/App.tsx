import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Inventory from './components/Inventory';
import ShoppingList from './components/ShoppingList';
import UserManagement from './components/UserManagement';
import WasteTracking from './components/WasteTracking';
import AIBot from './components/AIBot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/waste-tracking" element={<WasteTracking />} />
            <Route path="/ai-bot" element={<AIBot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;