// frontend/src/services/authService.ts
import API from './api';

export interface RegisterData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  token: string;
}

export const authService = {
  register: async (userData: RegisterData): Promise<UserData> => {
    try {
      const response = await API.post('/auth/signup', userData);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  login: async (credentials: LoginData): Promise<UserData> => {
    try {
      const response = await API.post('/auth/signin', credentials);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): UserData | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  }
};