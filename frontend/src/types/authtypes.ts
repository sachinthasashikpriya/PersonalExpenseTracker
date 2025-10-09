export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    token: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (profileData: UpdateProfileData) => Promise<void>;
    error: string | null;
  }
  
  export interface RegisterData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
  }

  export interface UpdateProfileData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
  }