import React, { useState, useCallback } from 'react';
import { UserPlus, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Import the API utility

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'housekeeping' | 'supplier';
  status: 'active' | 'inactive';
  whatsapp?: string;
  inventory?: string[];
}

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-amber-100 transform transition-all scale-95 hover:scale-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const RegisterPage: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedRole, setSelectedRole] = useState<User['role']>('staff');
  const [inventoryItems, setInventoryItems] = useState<string[]>(['']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const requiresWhatsApp = (role: User['role']) => 
    role === 'manager' || role === 'admin' || role === 'supplier';

  const validateName = (name: string): boolean => /^[A-Za-z\s-]{2,}$/.test(name);
  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateWhatsApp = (whatsapp: string): boolean => /^\d{10}$/.test(whatsapp);

  const handleRegister = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as User['role'];
    const whatsapp = requiresWhatsApp(role) ? (formData.get('whatsapp') as string) : undefined;

    const newErrors: { [key: string]: string } = {};
    if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters and contain only letters, spaces, or hyphens.';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (requiresWhatsApp(role) && (!whatsapp || !validateWhatsApp(whatsapp))) {
      newErrors.whatsapp = 'WhatsApp number must be exactly 10 digits.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const inventory = role === 'supplier' ? inventoryItems.filter(item => item.trim() !== '') : undefined;

    try {
      const payload: Partial<User> = {
        name,
        email,
        password,
        role,
        ...(whatsapp && { whatsapp }),
        ...(inventory && { inventory }),
      };
      
      await api.post('/register', payload);
      setShowModal(false);
      navigate('/login');
      setErrors({});
    } catch (err: any) {
      setErrors({ server: err.response?.data?.msg || 'Registration failed' });
    }
  }, [selectedRole, inventoryItems, navigate]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as User['role'];
    setSelectedRole(newRole);
    if (newRole !== 'supplier') {
      setInventoryItems(['']);
    }
    setErrors(prev => ({ ...prev, whatsapp: '' }));
  };

  const handleInventoryChange = (index: number, value: string) => {
    const newItems = [...inventoryItems];
    newItems[index] = value;
    setInventoryItems(newItems);
  };

  const addInventoryField = () => {
    setInventoryItems([...inventoryItems, '']);
  };

  const removeInventoryField = (index: number) => {
    if (inventoryItems.length > 1) {
      setInventoryItems(inventoryItems.filter((_, i) => i !== index));
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1611892440504-42a792e24c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-5xl font-serif text-white mb-4 tracking-tight drop-shadow-lg">Hotel Management</h1>
        <p className="text-lg text-white/90 max-w-2xl drop-shadow-md">Register to join our team</p>
      </div>

      {showModal && (
        <Modal title="Join Our Team" onClose={() => navigate('/login')}>
          <form onSubmit={handleRegister} className="space-y-6">
            {errors.server && <p className="text-sm text-red-600">{errors.server}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                required
                className="mt-1 w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all"
                placeholder="John Doe"
                onChange={() => setErrors(prev => ({ ...prev, name: '' }))}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all"
                placeholder="john@hotel.com"
                onChange={() => setErrors(prev => ({ ...prev, email: '' }))}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                className="mt-1 w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                required
                value={selectedRole}
                onChange={handleRoleChange}
                className="mt-1 w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all"
              >
                <option value="staff">Staff</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
            {requiresWhatsApp(selectedRole) && (
              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp Number (10 digits)</label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  className="mt-1 w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all"
                  placeholder="1234567890"
                  onChange={() => setErrors(prev => ({ ...prev, whatsapp: '' }))}
                />
                {errors.whatsapp && <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>}
              </div>
            )}
            {selectedRole === 'supplier' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Inventory Items</label>
                {inventoryItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-1">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleInventoryChange(index, e.target.value)}
                      className="w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all"
                      placeholder={`Item ${index + 1}`}
                    />
                    {inventoryItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInventoryField(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInventoryField}
                  className="mt-2 flex items-center text-amber-600 hover:text-amber-800"
                >
                  <Plus className="h-5 w-5 mr-1" /> Add Item
                </button>
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all">
              <UserPlus className="h-5 w-5 inline mr-2" /> Register
            </button>
            
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RegisterPage;