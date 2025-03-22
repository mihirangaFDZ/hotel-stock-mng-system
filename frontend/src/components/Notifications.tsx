import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Notification } from '../data/dummyData';

const Notifications: React.FC<{ notifications: Notification[]; onDismiss: (id: number) => void }> = ({ notifications, onDismiss }) => {
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const filteredNotifications = priorityFilter
    ? notifications.filter((note) => note.priority === priorityFilter)
    : notifications;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 glass-effect rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <select
          value={priorityFilter || ''}
          onChange={(e) => setPriorityFilter(e.target.value || null)}
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      {filteredNotifications.length === 0 ? (
        <p className="text-gray-400">No notifications</p>
      ) : (
        <ul className="space-y-3">
          {filteredNotifications.map((note) => (
            <motion.li
              key={note.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg flex justify-between items-center ${
                note.priority === 'critical' ? 'bg-red-600/20' : note.priority === 'high' ? 'bg-orange-600/20' : note.priority === 'medium' ? 'bg-yellow-600/20' : 'bg-green-600/20'
              }`}
            >
              <div>
                <p className="font-semibold text-white">{note.message}</p>
                <span className="text-xs text-gray-300">{note.timestamp} • {note.channel}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => onDismiss(note.id)}
                className="text-red-400 hover:text-red-300"
              >
                <FaTimes />
              </motion.button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default Notifications;