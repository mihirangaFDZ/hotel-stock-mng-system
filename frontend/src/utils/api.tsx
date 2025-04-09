import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8070/api/auth',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Token attached to request:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('No token found in localStorage'); // Debug log
  }
  return config;
});

export default api;