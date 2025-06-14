import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8070/api/auth',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token attached to request:', token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

// Interceptor to handle 401 errors (e.g., token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authState');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



export default api;