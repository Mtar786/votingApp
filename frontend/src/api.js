import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
});

// Attach token to headers if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;