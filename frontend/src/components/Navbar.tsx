import React, { useState, useEffect } from 'react';
import { NavLink as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hotel,
  Package,
  ShoppingCart,
  Users,
  Trash2,
  Bot,
  Menu,
  LogIn,
  UserCircle2,
  ChevronDown,
  LogOut,
  X,
  User,
  Settings,
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Get authentication state from localStorage
  const storedAuth = localStorage.getItem('authState');
  const authState = storedAuth ? JSON.parse(storedAuth) : { isAuthenticated: false, currentUser: null };
  
  // Check if user has admin or manager role
  const hasUserManagementAccess = () => {
    if (!authState?.currentUser?.role) return false;
    return ['admin', 'manager'].includes(authState.currentUser.role.toLowerCase());
  };
  
  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem('authState');
    navigate('/login');
  };

  // Close all menus when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setUserDropdownOpen(false);
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
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/inventory-dash" icon={<Package />} text="Inventory" />
            <NavLink to="/shopping-list" icon={<ShoppingCart />} text="Shopping List" />
            {/* Only show User Management for admin and manager roles */}
            {hasUserManagementAccess() && (
              <NavLink to="/staff-management" icon={<Users />} text="Users" />
            )}
            <NavLink to="/waste-management" icon={<Trash2 />} text="Waste Tracking" />
            <NavLink to="/ai-bot" icon={<Bot />} text="AI Assistant" />
            
            {authState?.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-indigo-700 text-white hover:bg-indigo-800 transition-colors"
                >
                  <UserCircle2 className="h-5 w-5" />
                  <span>{authState.currentUser?.name}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-indigo-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-1 px-4 py-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
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
              {/* Only show User Management for admin and manager roles */}
              {hasUserManagementAccess() && (
                <MobileNavLink to="/users" icon={<Users className="w-5 h-5" />} text="Users" />
              )}
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