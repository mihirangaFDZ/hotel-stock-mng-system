import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, X, Hotel, Shield, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'supplier' | 'housekeeping';
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      if (!['admin', 'manager', 'staff', 'housekeeping', 'supplier'].includes(user.role)) {
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
      } else if (user.role === 'supplier') {
        navigate('/inventory-dash');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Invalid credentials';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Background Image with Hotel Theme */}
      <div 
        className="w-full md:w-1/2 bg-cover bg-center relative hidden md:flex flex-col items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070')` 
        }}
      >
        <div className="text-center px-8 max-w-lg">
          <Hotel className="h-16 w-16 text-white mb-6 mx-auto" />
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Smart Hotel Inventory Management
          </h1>
          <p className="text-xl text-gray-200 mb-6">
            Streamline your hotel's inventory with our advanced management solution
          </p>
          <div className="flex space-x-4 justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-white text-sm font-medium">Optimize Stock</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-white text-sm font-medium">Reduce Waste</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-white text-sm font-medium">Cut Costs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12 bg-gradient-to-b from-gray-50 to-white">
        {!authState.isAuthenticated && (
          <div className="w-full max-w-md">
            {/* Mobile Only Banner */}
            <div className="md:hidden text-center mb-8">
              <Hotel className="h-10 w-10 text-indigo-700 mb-2 mx-auto" />
              <h1 className="text-2xl font-bold text-gray-800">
                Hotel Inventory Management
              </h1>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center justify-between">
                  <span className="text-red-700 text-sm">{error}</span>
                  <button 
                    onClick={() => setError(null)} 
                    className="text-red-700 hover:text-red-900 focus:outline-none"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-3 px-4 transition-all" 
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      required 
                      className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-3 px-4 transition-all" 
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div>
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-700">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" /> Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Need help? Contact <span className="text-indigo-600 font-medium">IT Support</span>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Hotel Inventory Management System. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;