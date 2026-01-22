import axios from 'axios';

const api = axios.create({
   baseURL: 'https://mern-salon-apointment.onrender.com/api',
//baseURL:'http://localhost:1066/api',
  withCredentials: true,                
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for auth tokens or logging
api.interceptors.request.use(
  (config) => {
    // Example: Attach token
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;