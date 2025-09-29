import axios from "axios";
import React, { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import type { User, RegisterData } from "../types/authtypes";


// Base URL for API calls
const API_URL = "http://localhost:5000/api/auth";

// Auth provider component - ONLY COMPONENT EXPORT
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Configure axios to use the token
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/signup`, userData);

      if (response.data && response.data.token) {
        const newUser = response.data;
        setUser(newUser);
        setIsAuthenticated(true);

        localStorage.setItem("token", newUser.token);
        localStorage.setItem("user", JSON.stringify(newUser));

        axios.defaults.headers.common["Authorization"] = `Bearer ${newUser.token}`;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/signin`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data && response.data.token) {
        const loggedInUser = response.data;

        localStorage.setItem("token", loggedInUser.token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));

          // Log successful storage
      console.log("Token stored in localStorage");

        setUser(loggedInUser);
        setIsAuthenticated(true);

        axios.defaults.headers.common["Authorization"] = `Bearer ${loggedInUser.token}`;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;