// frontend/src/services/api.ts
import axios from 'axios';

// Create the main API instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add token to every request
API.interceptors.request.use(
  (config) => {
    // Don't add auth token for auth endpoints (login/register)
    // Using more precise matching to ensure we catch all auth endpoints
    const isAuthEndpoint = 
      config.url?.includes('/auth/signin') || 
      config.url?.includes('/auth/signup') || 
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/login');
    
    console.log("API Request:", {
      url: config.url,
      isAuthEndpoint,
      method: config.method
    });
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Added auth token to request");
      }
    } else {
      console.log("Auth endpoint - no token added");
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Response Error:", error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Only dispatch auth error for non-login attempts
      const isLoginAttempt = 
        error.config?.url?.includes('/auth/signin') || 
        error.config?.url?.includes('/auth/login');
      
      if (!isLoginAttempt) {
        console.log("Authentication token expired or invalid, logging out");
        
        // Dispatch custom event with error details
        const errorEvent = new CustomEvent('auth-error', { 
          detail: error.response.data 
        });
        window.dispatchEvent(errorEvent);
      }
    }
    return Promise.reject(error);
  }
);

export default API;