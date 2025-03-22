// components/StockDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaBars, FaMicrophone } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for navigation
import StockDashboard from './StockDashboard';
import ChatWindow from './ChatWindow';
import Notifications from './Notifications';
import { StockItem, ChatMessage, Notification, stockData } from '../data/dummyData';

// StockDashboardPage component: Contains the full layout for the inventory page
const StockDashboardPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true); // State: Toggle dark/light mode
  const [sidebarOpen, setSidebarOpen] = useState(false); // State: Toggle sidebar visibility
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null); // State: Selected supplier for ChatWindow
  const [notifications, setNotifications] = useState<Notification[]>([]); // State: List of notifications
  const [stockTicker, setStockTicker] = useState<string>(''); // State: Live stock ticker message

  // Effect: Apply dark/light mode to body
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  // Effect: Simulate live stock ticker updates every 3 seconds
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      const randomItem = stockData[Math.floor(Math.random() * stockData.length)];
      setStockTicker(`Live Update: ${randomItem.item} - ${randomItem.quantity} units remaining`);
    }, 3000); // Live stock ticker
    return () => clearInterval(tickerInterval);
  }, []);

  // Function: Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Function: Handle restock action from StockDashboard
  const handleRestock = (item: StockItem) => {
    setSelectedSupplier(`${item.supplier} (${item.supplierPhone})`);
    const newNotification: Notification = {
      id: notifications.length + 1,
      message: `Restock initiated for ${item.item}`,
      priority: item.quantity < item.threshold ? 'critical' : 'medium',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      relatedStockId: item.id,
      channel: 'whatsapp',
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  // Function: Handle new messages from ChatWindow
  const handleNewMessage = (msg: ChatMessage) => {
    if (msg.sender !== 'Bot') {
      const newNotification: Notification = {
        id: notifications.length + 1,
        message: `${msg.supplier} replied: ${msg.text}`,
        priority: 'medium',
        timestamp: msg.timestamp,
        channel: 'in-app',
      };
      setNotifications((prev) => [...prev, newNotification]);
    }
  };

  // Function: Dismiss a notification
  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((note) => note.id !== id));
  };

  // Function: Simulate voice command (placeholder)
  const handleVoiceCommand = () => {
    const commands = [
      "Restock all low items",
      "Message all suppliers",
      "Show critical notifications",
    ];
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    const newNotification: Notification = {
      id: notifications.length + 1,
      message: `Voice Command: ${randomCommand}`,
      priority: 'medium',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      channel: 'in-app',
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 flex justify-between items-center dark:bg-gray-800 bg-gray-200 shadow-lg fixed w-full z-20"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="dark:text-white text-gray-800 p-2 rounded-full dark:bg-blue-600 bg-blue-500 hover:dark:bg-blue-500 hover:bg-blue-400"
        >
          <FaBars size={24} />
        </motion.button>
        <Link to="/" className="text-3xl font-bold dark:text-white text-gray-800 hover:text-blue-400">
          Hotel Stock AI Dashboard
        </Link>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full dark:bg-blue-600 bg-blue-500 dark:text-white text-gray-800 hover:dark:bg-blue-500 hover:bg-blue-400"
          >
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleVoiceCommand}
            className="p-2 rounded-full dark:bg-blue-600 bg-blue-500 dark:text-white text-gray-800 hover:dark:bg-blue-500 hover:bg-blue-400 live-pulse"
          >
            <FaMicrophone size={24} />
          </motion.button>
        </div>
      </motion.header>

      {/* Removed Navbar as it's handled in App.tsx */}

      {/* Stock Ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 pt-20 dark:text-white text-gray-800 text-center font-semibold bg-gray-900/50"
      >
        {stockTicker}
      </motion.div>

      {/* Main Content with Sidebar */}
      <div className="flex pt-16">
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className="w-64 dark:bg-gray-800 bg-gray-200 h-screen fixed z-30 shadow-lg"
        >
          <nav className="p-6 space-y-6">
            <p className="text-xl font-semibold dark:text-white text-gray-800">Menu</p>
            <Link to="/">
              <motion.button
                whileHover={{ x: 10 }}
                className="w-full text-left p-3 rounded-lg dark:text-white text-gray-800 dark:bg-blue-600 bg-blue-500 hover:dark:bg-blue-500 hover:bg-blue-400"
              >
                Home page
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ x: 10 }}
              onClick={() => alert('Suppliers clicked!')}
              className="w-full text-left p-3 rounded-lg dark:text-white text-gray-800 dark:bg-blue-600 bg-blue-500 hover:dark:bg-blue-500 hover:bg-blue-400"
            >
              Suppliers
            </motion.button>
            <motion.button
              whileHover={{ x: 10 }}
              onClick={() => alert('Settings clicked!')}
              className="w-full text-left p-3 rounded-lg dark:text-white text-gray-800 dark:bg-blue-600 bg-blue-500 hover:dark:bg-blue-500 hover:bg-blue-400"
            >
              Settings
            </motion.button>
          </nav>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StockDashboard onRestock={handleRestock} />
            <Notifications notifications={notifications} onDismiss={handleDismissNotification} />
          </div>
          <ChatWindow selectedSupplier={selectedSupplier} onNewMessage={handleNewMessage} />
        </main>
      </div>
    </div>
  );
};

export default StockDashboardPage;