import React, { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import API from "../services/api"; // Import your API instance instead of axios
import { authService } from "../services/authService"; // Import only authService
import type { RegisterData, UpdateProfileData, User } from "../types/authtypes"; // Import UpdateProfileData from authtypes

// Base URL for API calls - this is now handled by API instance
const AUTH_ENDPOINT = "/auth";

// Auth provider component - ONLY COMPONENT EXPORT
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Handle auth errors from interceptor
  useEffect(() => {
    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Auth error event received, logging out", customEvent.detail);

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      // Add specific message based on error code
      if (customEvent.detail?.code === "TOKEN_EXPIRED") {
        alert("Your session has expired. Please log in again.");
      } else {
        alert("Authentication error. Please log in again.");
      }

      // Redirect to login page
      window.location.href = "/signin";
    };

    window.addEventListener("auth-error", handleAuthError);

    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, []);

  // Check for existing user session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        console.log("Checking auth on load:", {
          hasToken: !!token,
          hasUser: !!storedUser,
        });

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log("Auth restored from localStorage");
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

      const response = await API.post(`${AUTH_ENDPOINT}/signup`, userData);

      if (response.data && response.data.token) {
        const newUser = response.data;
        setUser(newUser);
        setIsAuthenticated(true);

        localStorage.setItem("token", newUser.token);
        localStorage.setItem("user", JSON.stringify(newUser));

        console.log("Registration successful");
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

      // Test localStorage access first
      try {
        localStorage.setItem("test_access", "test");
        localStorage.removeItem("test_access");
      } catch (e) {
        console.error("Cannot access localStorage:", e);
        throw new Error(
          "Your browser is blocking localStorage access. Please check privacy settings."
        );
      }

      console.log("Login attempt for:", email);

      // Make API call to login endpoint
      const response = await API.post(`${AUTH_ENDPOINT}/signin`, {
        email,
        password,
      });

      console.log("Login response received. Status:", response.status);

      // Validate response data
      if (!response.data || !response.data.token) {
        console.error("Invalid response format:", response.data);
        throw new Error("Invalid server response - missing token");
      }

      // Extract user data and token
      const userData = response.data;
      const { token } = userData;

      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update application state
      setUser(userData);
      setIsAuthenticated(true);

      console.log("Login successful for:", email);
    } catch (err: any) {
      console.error("Login error:", err);

      // Extract error message from API response if available
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";

      setError(errorMessage);
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
    console.log("User logged out");
  };

  // Update profile function
  const updateProfile = async (
    profileData: UpdateProfileData
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await authService.updateProfile(profileData);

      // Update user in state
      setUser((prevUser) => {
        if (prevUser) {
          return { ...prevUser, ...updatedUser };
        }
        return prevUser;
      });

      console.log("Profile updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
