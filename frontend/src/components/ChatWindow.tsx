import React, { useState, useEffect } from 'react'; // Import React, useState for state management, and useEffect for side effects
import { motion } from 'framer-motion'; // Import Framer Motion for animations (e.g., fade-ins, hover effects)
import { FaPaperPlane } from 'react-icons/fa'; // Import paper plane icon from react-icons for the send button
import { chatData, ChatMessage, stockData } from '../data/dummyData'; // Import dummy data: chatData (initial messages), ChatMessage type, stockData (stock items)

// ChatWindow component: Manages a chat interface for supplier communication
const ChatWindow: React.FC<{ selectedSupplier: string | null; onNewMessage: (msg: ChatMessage) => void }> = ({
  selectedSupplier, // Prop: Supplier selected from parent component (e.g., StockDashboard), can be null
  onNewMessage, // Prop: Callback function to notify parent (App) of new messages
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(chatData); // State: Array of chat messages, initialized with dummy chatData
  const [newMessage, setNewMessage] = useState(''); // State: Text input for the user's new message, initially empty
  const [activeSupplier, setActiveSupplier] = useState<string | null>(selectedSupplier); // State: Currently active supplier, synced with selectedSupplier initially

  // Effect: Syncs activeSupplier with selectedSupplier and filters messages
  useEffect(() => {
    if (selectedSupplier && selectedSupplier !== activeSupplier) { // Check if selectedSupplier exists and differs from activeSupplier
      setActiveSupplier(selectedSupplier); // Update activeSupplier to match selectedSupplier
      const supplierMessages = chatData.filter((msg) => msg.supplier === selectedSupplier.split(' (')[0]); // Filter chatData for messages from this supplier (ignores phone number part)
      setMessages(supplierMessages.length ? supplierMessages : []); // Set messages to filtered list or empty array if none found
    }
  }, [selectedSupplier]); // Dependency: Runs when selectedSupplier changes

  // Effect: Simulates automatic supplier replies every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => { // Set up an interval that runs every 5 seconds
      if (activeSupplier) { // Only proceed if a supplier is active
        const reply: ChatMessage = { // Create a new reply message object
          id: messages.length + 1, // Unique ID based on current message count
          supplier: activeSupplier.split(' (')[0], // Supplier name (excludes phone number)
          sender: activeSupplier.split(' (')[0], // Sender is the supplier
          text: `Update: Stock shipment for ${stockData[Math.floor(Math.random() * stockData.length)].item} is on the way!`, // Random stock item update
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), // Current timestamp (e.g., "2025-03-21 14:30")
          status: 'delivered', // Status of the message
        };
        setMessages((prev) => [...prev, reply]); // Add reply to the messages array using functional update
        onNewMessage(reply); // Notify parent component of the new message
      }
    }, 5000); // Interval: 5000ms (5 seconds)
    return () => clearInterval(interval); // Cleanup: Clear interval when component unmounts or dependencies change
  }, [activeSupplier, onNewMessage]); // Dependencies: Runs when activeSupplier or onNewMessage changes

  // Function: Handles sending a user message
  const handleSend = () => {
    if (newMessage.trim() && activeSupplier) { // Check if message is non-empty and a supplier is active
      const msg: ChatMessage = { // Create a new message object
        id: messages.length + 1, // Unique ID
        supplier: activeSupplier.split(' (')[0], // Supplier name
        sender: 'Bot', // Sender is the user (represented as Bot)
        text: newMessage, // Text entered by the user
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), // Current timestamp
        status: 'sent', // Status of the message
      };
      setMessages((prev) => [...prev, msg]); // Add new message to the messages array
      onNewMessage(msg); // Notify parent of the new message
      setNewMessage(''); // Clear the input field
    }
  };

  // Derived Data: Create a list of unique suppliers from stockData
  const suppliers = Array.from(new Set(stockData.map((item) => item.supplier))); // Use Set to remove duplicates

  // JSX: Render the chat UI with supplier buttons, message list, and input
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }} // Animation: Fade in from the right
      animate={{ opacity: 1, x: 0 }} // Animation: Fully visible and in position
      className="p-6 glass-effect rounded-xl shadow-lg dark:bg-gray-800/80 h-[600px] flex flex-col" // Styling: Glass effect, fixed height, column layout
    >
      {/* Supplier Selection Buttons */}
      <div className="flex space-x-2 mb-4 overflow-x-auto"> {/* Container for supplier buttons, horizontal scroll if needed */}
        {suppliers.map((supplier) => ( // Map over unique suppliers to create buttons
          <motion.button
            key={supplier} // Unique key for each button
            whileHover={{ scale: 1.1 }} // Animation: Scale up on hover
            onClick={() => setActiveSupplier(`${supplier} (${stockData.find((s) => s.supplier === supplier)?.supplierPhone})`)} // Set activeSupplier with name and phone
            className={`px-4 py-2 rounded-lg dark:text-white text-gray-800 ${activeSupplier?.includes(supplier) ? 'dark:bg-blue-600 bg-blue-500' : 'dark:bg-gray-700 bg-gray-200'} hover:dark:bg-blue-500 hover:bg-blue-400`} // Conditional styling: Highlight active supplier
          >
            {supplier} 
          </motion.button>
        ))}
      </div>
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto space-y-4"> {/* Flex-1 to fill available space, vertical scroll for overflow */}
        {messages.map((msg) => ( // Map over messages to display each one
          <motion.div
            key={msg.id} // Unique key for each message
            initial={{ opacity: 0, y: 20 }} // Animation: Fade in from below
            animate={{ opacity: 1, y: 0 }} // Animation: Fully visible
            className={`flex ${msg.sender === 'Bot' ? 'justify-start' : 'justify-end'}`} // Align left for Bot, right for supplier
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${msg.sender === 'Bot' ? 'dark:bg-blue-600 bg-blue-500 text-white' : 'dark:bg-gray-700 bg-gray-300 dark:text-white text-gray-800'}`} // Styling: Different colors for Bot vs supplier
            >
              <p className="font-semibold">{msg.sender}</p> {/* Sender name in bold */}
              <p>{msg.text}</p> {/* Message text */}
              <span className="text-xs dark:text-gray-300 text-gray-600">{msg.timestamp} • {msg.status}</span> {/* Timestamp and status */}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Message Input Area */}
      <div className="mt-4 flex space-x-2"> {/* Flex row for input and send button */}
        <input
          type="text"
          value={newMessage} // Controlled input tied to newMessage state
          onChange={(e) => setNewMessage(e.target.value)} // Update state on input change
          placeholder="Send a message..." // Placeholder text
          className="flex-1 p-3 rounded-lg dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-800 border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" // Styling: Takes full width, themed for dark/light mode
        />
        <motion.button
          whileHover={{ scale: 1.1 }} // Animation: Scale up on hover
          onClick={handleSend} // Trigger handleSend function
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500" // Styling: Blue button with hover effect
        >
          <FaPaperPlane /> {/* Send icon */}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatWindow; // Export the component for use elsewhere