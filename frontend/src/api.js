import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5231/api',
});

// Thêm interceptor để giả lập auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
