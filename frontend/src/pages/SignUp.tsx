import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

interface SignUpForm {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUpForm>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<SignUpForm>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof SignUpForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpForm> = {};

    if (!formData.firstname) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setError(null); // Clear any previous error
    setIsLoading(true);

    try {
      // Call auth service to register user
      await authService.register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Redirect to dashboard after successful registration
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Image and Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-amber-50 relative items-center justify-center p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-300 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-16 w-40 h-40 bg-amber-300 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-orange-400 rounded-full blur-lg"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Track Me with Purple Border */}
            <div className="border-purple-500 rounded-2xl p-8 mb-8 bg-white bg-opacity-70 backdrop-blur-sm">
              <h1 className="text-5xl md:text-6xl font-light text-gray-600 tracking-wide">
                Track Me
              </h1>
            </div>

            {/* Credit Card Illustration */}
            <div className="relative mx-auto w-80 h-48 mb-8">
              {/* Hand illustration (simplified) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Credit Card */}
                  <div className="w-72 h-44 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300">
                    {/* Card Details */}
                    <div className="p-6 h-full flex flex-col justify-between">
                      {/* Chip */}
                      <div>
                        <div className="w-12 h-9 bg-gray-300 rounded-md mb-4 opacity-80"></div>
                        {/* Geometric pattern */}
                        <div className="absolute top-8 right-8">
                          <div className="w-16 h-16 border-4 border-white opacity-30 transform rotate-45"></div>
                          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-white opacity-50 transform rotate-45"></div>
                        </div>
                      </div>

                      {/* Bottom section */}
                      <div className="flex justify-between items-end">
                        <div className="flex space-x-2">
                          <div className="w-8 h-5 bg-red-600 rounded opacity-90"></div>
                          <div className="w-8 h-5 bg-yellow-400 rounded opacity-90"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hand shadow/background */}
                  <div className="absolute -bottom-4 -left-4 w-80 h-48 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl opacity-20 blur-sm"></div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              Join thousands of users who trust Track Me to manage their
              financial journey
            </p>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Title */}
            <div className="lg:hidden text-center mb-8">
              <div className="border-4 border-purple-500 rounded-2xl p-4 mb-4 inline-block bg-white">
                <h1 className="text-3xl font-light text-gray-600">Track Me</h1>
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Sign Up
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* First Name Input */}
              <div>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                    errors.firstname
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm mt-1 ml-2">
                    {errors.firstname}
                  </p>
                )}
              </div>

              {/* Last Name Input */}
              <div>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                    errors.lastname
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm mt-1 ml-2">
                    {errors.lastname}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-2">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Username Input */}
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Create User name"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                    errors.username
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1 ml-2">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 pr-14 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-2">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 pr-14 ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 ml-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            {/* Social Login Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                {/* Facebook */}
                <button
                  onClick={() => handleSocialLogin("Facebook")}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200 transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* Apple */}
                <button
                  onClick={() => handleSocialLogin("Apple")}
                  className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors duration-200 transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C6.624 0 2.076 4.333 2.076 9.688c0 5.314 4.548 9.688 10.017 9.688 5.468 0 10.017-4.373 10.017-9.688C22.11 4.333 17.561 0 12.017 0zm3.624 7.99c-.24 0-.48-.12-.72-.12-.72 0-1.44.6-1.44 1.32 0 .6.48 1.2 1.32 1.2.48 0 .84-.36.84-.84 0-.6-.48-1.56-.48-1.56s.48-.96.48-1.56zm-3.6 0c-.24 0-.48-.12-.72-.12-.72 0-1.44.6-1.44 1.32 0 .6.48 1.2 1.32 1.2.48 0 .84-.36.84-.84 0-.6-.48-1.56-.48-1.56s.48-.96.48-1.56z" />
                  </svg>
                </button>

                {/* Google */}
                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
