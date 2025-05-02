import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, X } from 'lucide-react';
import api from '../../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' 
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
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      if (!['admin', 'manager', 'staff', 'housekeeping'].includes(user.role)) {
        throw new Error('Invalid user role');
      }

      const newAuthState: AuthState = { isAuthenticated: true, currentUser: user };
      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      localStorage.setItem('token', token);

      if (user.role === 'admin' || user.role === 'manager') {
        navigate('/staff-management');
      } else if (user.role === 'staff' || user.role === 'housekeeping') {
        navigate('/');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Invalid credentials';
      setError(errorMsg);
    }
  }, [navigate]);

  // const handleLogout = useCallback(() => {
  //   setAuthState({ isAuthenticated: false, currentUser: null });
  //   localStorage.removeItem('authState');
  //   localStorage.removeItem('token');
  //   navigate('/login');
  // }, [navigate]);

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070')` 
      }}
    >
      {!authState.isAuthenticated && (
        <>
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              Smart Hotel Inventory Management
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl drop-shadow-md">
              Streamline your hotel's inventory with our comprehensive solution
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-indigo-200 animate  animate-fade-in">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full rounded-md border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-2" 
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  className="w-full rounded-md border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all p-2" 
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="h-5 w-5" /> Sign In
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;