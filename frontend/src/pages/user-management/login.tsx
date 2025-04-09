import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, LogIn, UserPlus, ChevronDown, LogOut, X } from 'lucide-react';
import api from '../../utils/api'; // Move up two levels to src, then into utils

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'housekeeping';
  status: 'active' | 'inactive';
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedAuth = localStorage.getItem('authState');
    return storedAuth ? JSON.parse(storedAuth) : { isAuthenticated: false, currentUser: null };
  });
  const [modalState, setModalState] = useState({ login: true, userDropdown: false });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      const newAuthState: AuthState = { isAuthenticated: true, currentUser: user };
      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      localStorage.setItem('token', token); // Store JWT token
      setModalState(prev => ({ ...prev, login: false }));
      setError(null);

      if (user.role === 'admin' || user.role === 'manager') {
        navigate('/staff-management');
      } else if (user.role === 'staff') {
        navigate('/inventory-dash');
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Invalid credentials');
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setAuthState({ isAuthenticated: false, currentUser: null });
    localStorage.removeItem('authState');
    localStorage.removeItem('token');
    setModalState(prev => ({ ...prev, userDropdown: false, login: true }));
  }, []);

  const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-amber-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1611892440504-42a792e24c32')` }}
    >
      {authState.isAuthenticated && (
        <div className="absolute top-4 right-4 z-10">
          <div className="relative">
            <button
              onClick={() => setModalState(prev => ({ ...prev, userDropdown: !prev.userDropdown }))}
              className="flex items-center px-4 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all"
            >
              <UserCircle2 className="h-5 w-5 mr-2" />
              <span className="font-medium">{authState.currentUser?.name}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {modalState.userDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!authState.isAuthenticated && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-5xl font-serif text-white mb-4 tracking-tight drop-shadow-lg">
              Welcome to Hotel Management
            </h1>
            <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
              Streamline your hotel operations with our modern management system
            </p>
          </div>
          <div className="flex space-x-6">
            <button
              onClick={() => setModalState(prev => ({ ...prev, login: true }))}
              className="flex items-center px-6 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </button>
         
          </div>
        </div>
      )}

      {modalState.login && !authState.isAuthenticated && (
        <Modal 
          title="Sign In" 
          onClose={() => setModalState(prev => ({ ...prev, login: false }))}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded-md">{error}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all p-2" 
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all p-2" 
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" /> Sign In
            </button>
            
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Login;