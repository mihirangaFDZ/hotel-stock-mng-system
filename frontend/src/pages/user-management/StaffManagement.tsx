import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, UserPlus, Shield, Settings, X, Trash2, Package } from 'lucide-react';
import api from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'housekeeping';
  status: 'active' | 'inactive';
}

interface Supplier {
  _id: string;
  name: string;
  email: string;
  whatsapp: string;
  items: string[];
}

const StaffManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'suppliers'>('users');
  const [modalState, setModalState] = useState<{
    addUser: boolean;
    addSupplier: boolean;
    editUser: boolean;
    editSupplier: boolean;
    deleteConfirm: boolean;
  }>({
    addUser: false,
    addSupplier: false,
    editUser: false,
    editSupplier: false,
    deleteConfirm: false,
  });
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedRole, setSelectedRole] = useState<User['role']>('staff');
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      console.log('Fetching users from:', `${api.defaults.baseURL}/users`);
      const response = await api.get<User[]>('/users');
      console.log('Users fetched:', response.data);
      setUsers(response.data);
      toast.success('Users fetched successfully', { autoClose: 3000 });
    } catch (err: any) {
      console.error('Fetch users error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to fetch users';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Unauthorized or Forbidden, redirecting to login');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const fetchSuppliers = useCallback(async () => {
    try {
      console.log('Fetching suppliers from: http://localhost:8070/api/auth/suppliers');
      const response = await api.get<Supplier[]>('/suppliers');
      console.log('Suppliers fetched:', response.data);
      setSuppliers(response.data);
      toast.success('Suppliers fetched successfully', { autoClose: 3000 });
    } catch (err: any) {
      console.error('Fetch suppliers error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to fetch suppliers';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('Unauthorized or Forbidden, redirecting to login');
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    fetchUsers();
    fetchSuppliers();
  }, [navigate, fetchUsers, fetchSuppliers]);

  const validateWhatsApp = (whatsapp: string): boolean => {
    const whatsappRegex = /^(0?\d{9})$/;
    return whatsappRegex.test(whatsapp);
  };

  const formatWhatsApp = (whatsapp: string): string => {
    const cleaned = whatsapp.replace(/^0/, '');
    return `+94${cleaned}`;
  };

  const handleAddUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as User['role'];

    try {
      console.log('Adding user:', { name, email, role });
      await api.post<{ token: string; user: User }>('/register', { name, email, password, role });
      console.log('User added successfully');
      setModalState(prev => ({ ...prev, addUser: false }));
      setSelectedRole('staff');
      setError(null);
      toast.success(`User ${name} added successfully`, { autoClose: 3000 });
      await fetchUsers();
    } catch (err: any) {
      console.error('Add user error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to add user';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
    }
  }, [fetchUsers]);

  const handleAddSupplier = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const rawWhatsapp = formData.get('whatsapp') as string;
    const items = (formData.get('items') as string).split(',').map(item => item.trim());

    if (!validateWhatsApp(rawWhatsapp)) {
      setWhatsappError('WhatsApp number must be a 10-digit number (e.g., 0769240185).');
      toast.error('Invalid WhatsApp number', { autoClose: 3000 });
      return;
    }

    const whatsapp = formatWhatsApp(rawWhatsapp);

    try {
      console.log('Adding supplier:', { name, email, whatsapp, items });
      const response = await api.post<{ msg: string; supplier: Supplier }>('/suppliers', { name, email, whatsapp, items });
      console.log('Add supplier response:', response.data);
      setSuppliers(prev => [...prev, response.data.supplier]);
      setModalState(prev => ({ ...prev, addSupplier: false }));
      setWhatsappError(null);
      setError(null);
      toast.success(`Supplier ${name} added successfully`, { autoClose: 3000 });
    } catch (err: any) {
      console.error('Add supplier error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to add supplier';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
    }
  }, []);

  const handleEditUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as User['role'],
      status: formData.get('status') as User['status'],
    };

    try {
      console.log('Editing user:', selectedUser._id, updatedUser);
      const response = await api.put<User>(`/users/${selectedUser._id}`, updatedUser);
      console.log('Edit user response:', response.data);
      setUsers(prev => prev.map(user => user._id === selectedUser._id ? response.data : user));
      setModalState(prev => ({ ...prev, editUser: false }));
      setSelectedUser(null);
      setError(null);
      toast.success(`User ${updatedUser.name} updated successfully`, { autoClose: 3000 });
    } catch (err: any) {
      console.error('Edit user error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to update user';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
    }
  }, [selectedUser]);

  const handleEditSupplier = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    const formData = new FormData(e.currentTarget);
    const rawWhatsapp = formData.get('whatsapp') as string;
    const items = (formData.get('items') as string).split(',').map(item => item.trim());

    if (!validateWhatsApp(rawWhatsapp)) {
      setWhatsappError('WhatsApp number must be a 10-digit number (e.g., 0769240185).');
      toast.error('Invalid WhatsApp number', { autoClose: 3000 });
      return;
    }

    const whatsapp = formatWhatsApp(rawWhatsapp);

    const updatedSupplier = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      whatsapp,
      items,
    };

    try {
      console.log('Editing supplier:', selectedSupplier._id, updatedSupplier);
      const response = await api.put<{ msg: string; supplier: Supplier }>(`/suppliers/${selectedSupplier._id}`, updatedSupplier);
      console.log('Edit supplier response:', response.data);
      setSuppliers(prev => prev.map(supplier => supplier._id === selectedSupplier._id ? response.data.supplier : supplier));
      setModalState(prev => ({ ...prev, editSupplier: false }));
      setSelectedSupplier(null);
      setWhatsappError(null);
      setError(null);
      toast.success(`Supplier ${updatedSupplier.name} updated successfully`, { autoClose: 3000 });
    } catch (err: any) {
      console.error('Edit supplier error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to update supplier';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
    }
  }, [selectedSupplier]);

  const handleDelete = useCallback(async () => {
    if (!selectedUser && !selectedSupplier) return;
    try {
      if (selectedUser) {
        console.log('Deleting user:', selectedUser._id);
        await api.delete(`/users/${selectedUser._id}`);
        console.log('User deleted successfully');
        setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
        toast.success(`User ${selectedUser.name} deleted successfully`, { autoClose: 3000 });
      } else if (selectedSupplier) {
        console.log('Deleting supplier:', selectedSupplier._id);
        await api.delete(`/suppliers/${selectedSupplier._id}`);
        console.log('Supplier deleted successfully');
        setSuppliers(prev => prev.filter(supplier => supplier._id !== selectedSupplier._id));
        toast.success(`Supplier ${selectedSupplier.name} deleted successfully`, { autoClose: 3000 });
      }
      setModalState(prev => ({ ...prev, deleteConfirm: false }));
      setSelectedUser(null);
      setSelectedSupplier(null);
      setError(null);
    } catch (err: any) {
      console.error('Delete error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to delete';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
    }
  }, [selectedUser, selectedSupplier]);

  const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-indigo-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800">{title}</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        {children}
      </div>
    </div>
  );

  const DeleteConfirmationModal: React.FC = () => (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-indigo-100">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800">Confirm Deletion</h2>
          <p className="mt-2 text-gray-600">
            Are you sure you want to delete {selectedUser?.name || selectedSupplier?.name}? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setModalState(prev => ({ ...prev, deleteConfirm: false }))}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const authState = JSON.parse(localStorage.getItem('authState') || '{}');
  const currentUser: User = authState.currentUser || {
    _id: '0',
    name: 'Admin',
    email: 'admin@hotel.com',
    role: 'admin',
    status: 'active',
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('https://cdn.pixabay.com/photo/2021/08/27/01/33/bedroom-6577523_1280.jpg')` }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <div className="min-h-screen py-12 px-4 backdrop-blur-sm">
        <main className="flex-1 max-w-7xl mx-auto">
          <div className="bg-white/90 rounded-xl shadow-xl p-6 border border-indigo-200 backdrop-blur-md">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full mr-3">
                  <UserCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-serif text-indigo-800">Hotel Staff & Supplier Management</h3>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setModalState(prev => ({ ...prev, addUser: true }))}
                  className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md transition-all duration-300"
                >
                  <UserPlus className="h-5 w-5 mr-2" /> Add Staff
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setModalState(prev => ({ ...prev, addSupplier: true }))}
                    className="flex items-center px-6 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 shadow-md transition-all duration-300"
                  >
                    <Package className="h-5 w-5 mr-2" /> Add Supplier
                  </button>
                )}
              </div>
            </div>
            <div className="mb-6">
              <div className="flex space-x-4 border-b border-indigo-200">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-800' : 'text-gray-600'}`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('suppliers')}
                  className={`px-4 py-2 font-medium ${activeTab === 'suppliers' ? 'border-b-2 border-indigo-600 text-indigo-800' : 'text-gray-600'}`}
                >
                  Suppliers
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 mb-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">{error}</p>}
            <div className="overflow-x-auto rounded-lg shadow">
              {activeTab === 'users' && (
                <table className="w-full">
                  <thead className="bg-indigo-100">
                    <tr>
                      {['Name', 'Email', 'Role', 'Status', 'Actions'].map(header => (
                        <th key={header} className="px-6 py-4 text-left text-sm font-medium text-indigo-800 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-indigo-100">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-indigo-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <UserCircle2 className="h-8 w-8 text-indigo-600" />
                            <span className="ml-3 text-gray-900 font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-indigo-600 mr-2" />
                            <span className="text-gray-700 capitalize">{user.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => {
                                console.log('Edit user clicked:', user);
                                setSelectedUser(user);
                                setModalState(prev => ({ ...prev, editUser: true }));
                              }}
                              className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100 transition-colors duration-150"
                            >
                              <Settings className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                console.log('Delete user clicked:', user);
                                setSelectedUser(user);
                                setModalState(prev => ({ ...prev, deleteConfirm: true }));
                              }}
                              className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors duration-150"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'suppliers' && (
                <table className="w-full">
                  <thead className="bg-indigo-100">
                    <tr>
                      {['Name', 'Email', 'WhatsApp', 'Items', 'Actions'].map(header => (
                        <th key={header} className="px-6 py-4 text-left text-sm font-medium text-indigo-800 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-indigo-100">
                    {suppliers.map(supplier => (
                      <tr key={supplier._id} className="hover:bg-indigo-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Package className="h-8 w-8 text-indigo-600" />
                            <span className="ml-3 text-gray-900 font-medium">{supplier.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{supplier.email}</td>
                        <td className="px-6 py-4 text-gray-700">{supplier.whatsapp}</td>
                        <td className="px-6 py-4 text-gray-700">{supplier.items.join(', ')}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => {
                                console.log('Edit supplier clicked:', supplier);
                                setSelectedSupplier(supplier);
                                setModalState(prev => ({ ...prev, editSupplier: true }));
                              }}
                              className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100 transition-colors duration-150"
                              disabled={currentUser.role !== 'admin'}
                            >
                              <Settings className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                console.log('Delete supplier clicked:', supplier);
                                setSelectedSupplier(supplier);
                                setModalState(prev => ({ ...prev, deleteConfirm: true }));
                              }}
                              className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors duration-150"
                              disabled={currentUser.role !== 'admin'}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {modalState.addUser && (
        <Modal title="Add New Staff" onClose={() => { setModalState(prev => ({ ...prev, addUser: false })); setSelectedRole('staff'); setWhatsappError(null); }}>
          <form onSubmit={handleAddUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" required className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" required className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                required
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as User['role'])}
                className="mt-1 w-full rounded-md border-gray-300"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="housekeeping">Housekeeping</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-150">Add Staff</button>
          </form>
        </Modal>
      )}

      {modalState.addSupplier && (
        <Modal title="Add New Supplier" onClose={() => { setModalState(prev => ({ ...prev, addSupplier: false })); setWhatsappError(null); }}>
          <form onSubmit={handleAddSupplier} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" required className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp (10 digits)</label>
              <input
                type="tel"
                name="whatsapp"
                required
                className="mt-1 w-full rounded-md border-gray-300"
                placeholder="0769240185"
                onChange={() => setWhatsappError(null)}
              />
              <p className="mt-1 text-sm text-gray-500">Enter a 10-digit number; +94 will be added automatically (e.g., 0769240185 → +94769240185).</p>
              {whatsappError && <p className="mt-1 text-sm text-red-600">{whatsappError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Items (comma-separated)</label>
              <input
                type="text"
                name="items"
                required
                className="mt-1 w-full rounded-md border-gray-300"
                placeholder="towels, bedsheets"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors duration-150">Add Supplier</button>
          </form>
        </Modal>
      )}

      {modalState.editUser && selectedUser && (
        <Modal title="Edit Staff" onClose={() => { setModalState(prev => ({ ...prev, editUser: false })); setSelectedUser(null); setWhatsappError(null); }}>
          <form onSubmit={handleEditUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" required defaultValue={selectedUser.name} className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required defaultValue={selectedUser.email} className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select name="role" required defaultValue={selectedUser.role} className="mt-1 w-full rounded-md border-gray-300">
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="housekeeping">Housekeeping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" required defaultValue={selectedUser.status} className="mt-1 w-full rounded-md border-gray-300">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-150">Save Changes</button>
          </form>
        </Modal>
      )}

      {modalState.editSupplier && selectedSupplier && (
        <Modal title="Edit Supplier" onClose={() => { setModalState(prev => ({ ...prev, editSupplier: false })); setSelectedSupplier(null); setWhatsappError(null); }}>
          <form onSubmit={handleEditSupplier} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" required defaultValue={selectedSupplier.name} className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required defaultValue={selectedSupplier.email} className="mt-1 w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp (10 digits)</label>
              <input
                type="tel"
                name="whatsapp"
                required
                defaultValue={selectedSupplier.whatsapp.startsWith('+94') ? selectedSupplier.whatsapp.slice(3) : selectedSupplier.whatsapp}
                className="mt-1 w-full rounded-md border-gray-300"
                placeholder="0769240185"
                onChange={() => setWhatsappError(null)}
              />
              <p className="mt-1 text-sm text-gray-500">Enter a 10-digit number; +94 will be added automatically (e.g., 0769240185 → +94769240185).</p>
              {whatsappError && <p className="mt-1 text-sm text-red-600">{whatsappError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Items (comma-separated)</label>
              <input
                type="text"
                name="items"
                required
                defaultValue={selectedSupplier.items.join(', ')}
                className="mt-1 w-full rounded-md border-gray-300"
                placeholder="towels, bedsheets"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors duration-150">Save Changes</button>
          </form>
        </Modal>
      )}

      {modalState.deleteConfirm && (selectedUser || selectedSupplier) && (
        <DeleteConfirmationModal />
      )}
    </div>
  );
};

export default StaffManagement;