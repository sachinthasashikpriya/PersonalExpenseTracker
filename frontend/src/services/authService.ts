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

export interface UpdateProfileData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
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
  },
  
  getProfile: async (): Promise<UserData> => {
    try {
      const response = await API.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  updateProfile: async (profileData: UpdateProfileData): Promise<UserData> => {
    try {
      const response = await API.put('/auth/profile', profileData);
      
      // Update stored user data
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { 
          ...currentUser, 
          ...response.data 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  updatePassword: async (passwordData: UpdatePasswordData): Promise<void> => {
    try {
      await API.put('/auth/password', passwordData);
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }
};