import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Placeholder for backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login or clear token
      console.error('Unauthorized access - maybe redirect to login');
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
