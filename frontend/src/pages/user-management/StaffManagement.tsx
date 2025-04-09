import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, UserPlus, Shield, Settings, X, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'supplier';
  status: 'active' | 'inactive';
  whatsapp?: string;
}

const StaffManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalState, setModalState] = useState({ 
    addUser: false, 
    editUser: false,
    deleteConfirm: false 
  });
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<User['role']>('staff');
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        console.log('Fetching from:', `${api.defaults.baseURL}/users`);
        console.log('Token before fetch:', token);
        const response = await api.get('/users');
        console.log('Users fetched:', response.data);
        setUsers(response.data);
        toast.success('Users fetched successfully', { autoClose: 3000 });
      } catch (err: any) {
        console.error('Fetch error:', err.response?.data || err.message);
        const errorMsg = err.response?.data?.msg || 'Failed to fetch users';
        setError(errorMsg);
        toast.error(errorMsg, { autoClose: 3000 });
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('Unauthorized or Forbidden, redirecting to login');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchUsers();
  }, [navigate]);

  const validateWhatsApp = (whatsapp: string): boolean => {
    const whatsappRegex = /^\d{10}$/;
    return whatsappRegex.test(whatsapp);
  };

  const handleAddUser = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const whatsapp = formData.get('whatsapp') as string;

    if (whatsapp && !validateWhatsApp(whatsapp)) {
      setWhatsappError('WhatsApp number must be exactly 10 digits.');
      toast.error('Invalid WhatsApp number', { autoClose: 3000 });
      return;
    }

    navigate('/register');
    setModalState(prev => ({ ...prev, addUser: false }));
    setWhatsappError(null);
    setSelectedRole('staff');
  }, [navigate]);

  const handleEditUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    const formData = new FormData(e.currentTarget);
    const whatsapp = formData.get('whatsapp') as string;

    if (whatsapp && !validateWhatsApp(whatsapp)) {
      setWhatsappError('WhatsApp number must be exactly 10 digits.');
      toast.error('Invalid WhatsApp number', { autoClose: 3000 });
      return;
    }

    const updatedUser = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as User['role'],
      status: formData.get('status') as User['status'],
      ...(whatsapp ? { whatsapp } : {}),
    };

    try {
      console.log('Editing user:', selectedUser._id, updatedUser);
      const response = await api.put(`/users/${selectedUser._id}`, updatedUser);
      console.log('Edit response:', response.data);
      setUsers(prev => prev.map(user => user._id === selectedUser._id ? response.data : user));
      setModalState(prev => ({ ...prev, editUser: false }));
      setSelectedUser(null);
      setWhatsappError(null);
      setError(null);
      toast.success(`User ${updatedUser.name} updated successfully`, { autoClose: 3000 });
    } catch (err: any) {
      console.error('Edit error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to update user';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
    }
  }, [selectedUser]);

  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return;
    try {
      console.log('Deleting user:', selectedUser._id);
      await api.delete(`/users/${selectedUser._id}`);
      console.log('User deleted successfully');
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      setModalState(prev => ({ ...prev, deleteConfirm: false }));
      setSelectedUser(null);
      setError(null);
      toast.success(`User ${selectedUser.name} deleted successfully`, { autoClose: 3000 });
    } catch (err: any) {
      console.error('Delete error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.msg || 'Failed to delete user';
      setError(errorMsg);
      toast.error(errorMsg, { autoClose: 3000 });
    }
  }, [selectedUser]);

  const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-amber-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800">{title}</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        {children}
      </div>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-amber-100">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800">Confirm Deletion</h2>
          <p className="mt-2 text-gray-600">
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
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
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const canEditWhatsApp = (currentUser: User | null, targetUser: User) => {
    return (currentUser?.role === 'admin' || currentUser?.role === 'manager') && targetUser.role === 'supplier';
  };

  const authState = JSON.parse(localStorage.getItem('authState') || '{}');
  const currentUser: User = authState.currentUser || { _id: '0', name: 'Admin', email: 'admin@hotel.com', role: 'admin', status: 'active' };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('https://cdn.pixabay.com/photo/2021/08/27/01/33/bedroom-6577523_1280.jpg')` }}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="min-h-screen py-12 px-4 backdrop-blur-sm">
        <main className="flex-1 max-w-7xl mx-auto">
          <div className="bg-white/90 rounded-xl shadow-xl p-6 border border-amber-200 backdrop-blur-md">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-600 rounded-full mr-3">
                  <UserCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-serif text-amber-800">Hotel Staff Management</h3>
              </div>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 shadow-md transition-all duration-300"
              >
                <UserPlus className="h-5 w-5 mr-2" /> Add Staff
              </button>
            </div>
            {error && <p className="text-red-600 mb-4 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">{error}</p>}
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-amber-100">
                  <tr>
                    {['Name', 'Email', 'Role', 'Status', 'WhatsApp', 'Actions'].map(header => (
                      <th key={header} className="px-6 py-4 text-left text-sm font-medium text-amber-800 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-100">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-amber-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <UserCircle2 className="h-8 w-8 text-amber-600" />
                          <span className="ml-3 text-gray-900 font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-amber-600 mr-2" />
                          <span className="text-gray-700 capitalize">{user.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {user.whatsapp || (user.role === 'staff' ? '-' : '')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              console.log('Edit button clicked for user:', user);
                              setSelectedUser(user);
                              setModalState(prev => ({ ...prev, editUser: true }));
                            }}
                            className="text-amber-600 hover:text-amber-800 bg-amber-50 p-2 rounded-full hover:bg-amber-100 transition-colors duration-150"
                          >
                            <Settings className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              console.log('Delete button clicked for user:', user);
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
                <option value="supplier">Supplier</option>
              </select>
            </div>
            {selectedRole !== 'staff' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp (10 digits)</label>
                <input
                  type="tel"
                  name="whatsapp"
                  className="mt-1 w-full rounded-md border-gray-300"
                  placeholder="1234567890"
                  onChange={() => setWhatsappError(null)}
                />
                {whatsappError && <p className="mt-1 text-sm text-red-600">{whatsappError}</p>}
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-150">Add Staff</button>
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
                <option value="supplier">Supplier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" required defaultValue={selectedUser.status} className="mt-1 w-full rounded-md border-gray-300">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {(selectedUser.role === 'manager' || selectedUser.role === 'admin' || selectedUser.role === 'supplier' || canEditWhatsApp(currentUser, selectedUser)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp (10 digits)</label>
                <input
                  type="tel"
                  name="whatsapp"
                  defaultValue={selectedUser.whatsapp || ''}
                  className="mt-1 w-full rounded-md border-gray-300"
                  placeholder="1234567890"
                  disabled={!canEditWhatsApp(currentUser, selectedUser) && selectedUser.role !== 'manager' && selectedUser.role !== 'admin' && selectedUser.role !== 'supplier'}
                  onChange={() => setWhatsappError(null)}
                />
                {whatsappError && <p className="mt-1 text-sm text-red-600">{whatsappError}</p>}
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-150">Save Changes</button>
          </form>
        </Modal>
      )}

      {modalState.deleteConfirm && selectedUser && (
        <DeleteConfirmationModal />
      )}
    </div>
  );
};

export default StaffManagement;