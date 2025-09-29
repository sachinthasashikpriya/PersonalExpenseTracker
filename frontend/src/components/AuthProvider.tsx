import React, { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import API from "../services/api"; // Import your API instance instead of axios
import type { RegisterData, User } from "../types/authtypes";

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

      // Make API call - Note: Login endpoint should NOT require authentication
      // So we temporarily need to make this call without the interceptor adding auth header
      const response = await API.post(`${AUTH_ENDPOINT}/signin`, {
        email,
        password,
      });

      console.log("Login response received. Status:", response.status);

      // Validate response data structure
      if (!response.data) {
        console.error("Empty response data");
        throw new Error("Server returned empty response");
      }

      if (!response.data.token) {
        console.error("No token in response:", response.data);
        throw new Error("Server did not provide authentication token");
      }

      const userData = response.data;

      // Save with error handling
      try {
        // Clear any existing data first
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Now save new data
        localStorage.setItem("token", userData.token);
        console.log("Token saved, length:", userData.token.length);

        const userJson = JSON.stringify(userData);
        localStorage.setItem("user", userJson);
        console.log("User data saved, size:", userJson.length);

        // Verify data was saved
        const verifiedToken = localStorage.getItem("token");
        const verifiedUser = localStorage.getItem("user");
        console.log("Storage verification:", {
          hasToken: !!verifiedToken,
          tokenMatches: verifiedToken === userData.token,
          hasUser: !!verifiedUser,
        });

        if (!verifiedToken || verifiedToken !== userData.token) {
          throw new Error("Token verification failed");
        }

        // Update state AFTER verified storage
        setUser(userData);
        setIsAuthenticated(true);

        console.log("Login process completed successfully");
      } catch (storageErr) {
        console.error("Storage error details:", storageErr);
        if (storageErr instanceof Error) {
          throw new Error(`Failed to save auth data: ${storageErr.message}`);
        } else {
          throw new Error("Failed to save auth data due to an unknown error");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
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
