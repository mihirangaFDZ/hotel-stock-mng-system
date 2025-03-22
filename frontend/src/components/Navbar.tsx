import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { Hotel, Package, ShoppingCart, Users, Trash2, Bot, Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <RouterLink to="/" className="flex items-center space-x-2">
            <Hotel className="w-8 h-8" />
            <span className="text-xl font-bold">HotelStock</span>
          </RouterLink>
          
          <div className="hidden md:flex space-x-6">
            <NavLink to="/inventory" icon={<Package />} text="Inventory" />
            <NavLink to="/shopping-list" icon={<ShoppingCart />} text="Shopping List" />
            <NavLink to="/users" icon={<Users />} text="Users" />
            <NavLink to="/waste-tracking" icon={<Trash2 />} text="Waste Tracking" />
            <NavLink to="/inventory" icon={<Bot />} text="AI Assistant" />
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
              <MobileNavLink to="/inventory" icon={<Package />} text="Inventory" />
              <MobileNavLink to="/shopping-list" icon={<ShoppingCart />} text="Shopping List" />
              <MobileNavLink to="/users" icon={<Users />} text="Users" />
              <MobileNavLink to="/waste-tracking" icon={<Trash2 />} text="Waste Tracking" />
              <MobileNavLink to="/inventory" icon={<Bot />} text="AI Assistant" />
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