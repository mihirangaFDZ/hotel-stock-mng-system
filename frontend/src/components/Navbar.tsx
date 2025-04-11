import React, { useState } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hotel,
  Package,
  ShoppingCart,
  Users,
  Trash2,
  Bot,
  Menu,
  X,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();

  // Close all menus when navigating
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className="sticky top-0 z-50 bg-indigo-600 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <RouterLink to="/" className="flex items-center space-x-2">
            <div
              className="flex-shrink-0"
            >
              <Hotel className="w-8 h-8 text-indigo-200" />
            </div>
            <span className="text-xl font-bold tracking-tight">HotelStock</span>
          </RouterLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/inventory-dash" icon={<Package className="w-5 h-5" />} text="Inventory" />
            <NavLink to="/all-products" icon={<ShoppingCart className="w-5 h-5" />} text="All Products" />
            <NavLink to="/shopping-list" icon={<ShoppingCart className="w-5 h-5" />} text="Shopping List" />
            <NavLink to="/users" icon={<Users className="w-5 h-5" />} text="Users" />
            <NavLink to="/ai-bot" icon={<Bot className="w-5 h-5" />} text="AI Assistant" />

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none"
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">Profile</span>
              </button>
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl py-2"
                  >
                    <RouterLink
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-indigo-100"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </RouterLink>
                    <RouterLink
                      to="/logout"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-indigo-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </RouterLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-indigo-600"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-2">
              <MobileNavLink to="/inventory-dash" icon={<Package className="w-5 h-5" />} text="Inventory" />
              <MobileNavLink to="/all-products" icon={<ShoppingCart className="w-5 h-5" />} text="All Products" />
              <MobileNavLink to="/shopping-list" icon={<ShoppingCart className="w-5 h-5" />} text="Shopping List" />
              <MobileNavLink to="/users" icon={<Users className="w-5 h-5" />} text="Users" />
              <MobileNavLink to="/ai-bot" icon={<Bot className="w-5 h-5" />} text="AI Assistant" />
              <MobileNavLink to="/settings" icon={<Settings className="w-5 h-5" />} text="Settings" />
              <MobileNavLink to="/logout" icon={<LogOut className="w-5 h-5" />} text="Logout" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Desktop NavLink Component
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, className = '' }) => (
  <RouterLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-1 relative group transition-colors ${
        isActive ? 'text-indigo-200 font-semibold' : 'text-white hover:text-indigo-200'
      } ${className}`
    }
  >
    {icon}
    <span>{text}</span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-200 group-hover:w-full transition-all duration-300" />
  </RouterLink>
);

// Mobile NavLink Component
const MobileNavLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
  <RouterLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
        isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
      }`
    }
  >
    {icon}
    <span>{text}</span>
  </RouterLink>
);

export default Navbar;