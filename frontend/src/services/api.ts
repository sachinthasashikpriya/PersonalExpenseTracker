// frontend/src/services/api.ts
import axios from 'axios';

// Create the main API instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log("API Request Interceptor:");
    console.log("- Token from localStorage:", token ? "exists" : "not found");
    console.log("- Request URL:", config.url);
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log("- Authorization header added");
    } else {
      console.log("- No token, no auth header added");
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// frontend/src/services/api.ts
// Response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 error received:", error.response.data);
      
      // Dispatch custom event with error details
      const errorEvent = new CustomEvent('auth-error', { 
        detail: error.response.data 
      });
      window.dispatchEvent(errorEvent);
    }
    return Promise.reject(error);
  }
);

export default API;