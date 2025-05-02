import axios from 'axios';

const wasteApi = axios.create({
  baseURL: 'http://localhost:8070/api/waste',
});

wasteApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Waste API - Token attached to request:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('Waste API - No token found in localStorage');
  }
  return config;
});

// Interceptor to handle 401 errors (e.g., token expired)
wasteApi.interceptors.response.use(
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

export default wasteApi;