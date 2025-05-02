import React, { useState } from 'react';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { Hotel, Package, ShoppingCart, Users, Trash2, Bot, Menu, LogIn, UserCircle2, ChevronDown, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const authState = localStorage.getItem('authState') ? JSON.parse(localStorage.getItem('authState')!) : null;

  const handleLogout = () => {
    localStorage.removeItem('authState');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <RouterLink to="/" className="flex items-center space-x-2">
            <Hotel className="w-8 h-8" />
            <span className="text-xl font-bold">HotelStock</span>
          </RouterLink>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/inventory-dash" icon={<Package />} text="Inventory" />
            <NavLink to="/shopping-list" icon={<ShoppingCart />} text="Shopping List" />
            <NavLink to="/staff-management" icon={<Users />} text="Users" />
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

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-indigo-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <MobileNavLink to="/inventory-dash" icon={<Package />} text="Inventory" />
              <MobileNavLink to="/shopping-list" icon={<ShoppingCart />} text="Shopping List" />
              <MobileNavLink to="/staff-management" icon={<Users />} text="Users" />
              <MobileNavLink to="/waste-management" icon={<Trash2 />} text="Waste Tracking" />
              <MobileNavLink to="/ai-bot" icon={<Bot />} text="AI Assistant" />
              {authState?.isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-indigo-100 hover:bg-indigo-700 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout ({authState.currentUser?.name})</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-indigo-100 hover:bg-indigo-700 w-full"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <RouterLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center space-x-1 hover:text-indigo-200 transition-colors
      ${isActive ? 'text-indigo-200 font-semibold' : ''}
    `}
  >
    {icon}
    <span>{text}</span>
  </RouterLink>
);

const MobileNavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <RouterLink
    to={to}
    className={({ isActive }) => `
      flex items-center space-x-2 px-3 py-2 rounded-md
      ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'}
    `}
  >
    {icon}
    <span>{text}</span>
  </RouterLink>
);

export default Navbar;