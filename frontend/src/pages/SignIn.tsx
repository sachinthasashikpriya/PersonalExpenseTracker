// frontend/src/pages/Login.tsx
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Image and Branding (same as SignUp) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-amber-50 relative items-center justify-center p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-300 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-16 w-40 h-40 bg-amber-300 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-orange-400 rounded-full blur-lg"></div>
          </div>

          {/* Branding Content */}
          <div className="relative z-10 text-center">
            <div className="border-purple-500 rounded-2xl p-8 mb-8 bg-white bg-opacity-70 backdrop-blur-sm">
              <h1 className="text-5xl md:text-6xl font-light text-gray-600 tracking-wide">
                Track Me
              </h1>
            </div>

            {/* Illustration */}
            <div className="relative mx-auto w-80 h-48 mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-72 h-44 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-9 bg-gray-300 rounded-md mb-4 opacity-80"></div>
                        <div className="absolute top-8 right-8">
                          <div className="w-16 h-16 border-4 border-white opacity-30 transform rotate-45"></div>
                          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-white opacity-50 transform rotate-45"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex space-x-2">
                          <div className="w-8 h-5 bg-red-600 rounded opacity-90"></div>
                          <div className="w-8 h-5 bg-yellow-400 rounded opacity-90"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-80 h-48 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl opacity-20 blur-sm"></div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              Securely sign in and take control of your financial journey
            </p>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="border-4 border-purple-500 rounded-2xl p-4 mb-4 inline-block bg-white">
                <h1 className="text-3xl font-light text-gray-600">Track Me</h1>
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Sign In
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
