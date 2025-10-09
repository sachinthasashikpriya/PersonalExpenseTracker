import { useEffect, useState } from "react";
import Mainnavbar from "../components/Mainnavbar";
import useAuth from "../hooks/useAuth";
import { authService } from "../services/authService";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Basic Information");
  const { user: authUser, updateProfile } = useAuth();

  // Form states
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        // First try to get fresh data from the server
        const userData = await authService.getProfile();
        setProfileData({
          firstname: userData.firstname,
          lastname: userData.lastname,
          username: userData.username,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error loading profile data:", error);
        // Fallback to data from auth context if API call fails
        if (authUser) {
          setProfileData({
            firstname: authUser.firstname,
            lastname: authUser.lastname,
            username: authUser.username,
            email: authUser.email,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [authUser]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setMessage({ type: "", text: "" });

      // Use the updateProfile method from auth context instead of authService
      await updateProfile(profileData);

      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: "", text: "" });

      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage({
        type: "success",
        text: "Password updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    "Basic Information",
    "Account & Security",
    "Preferences",
    "Budget & Financial Info",
    "Activity",
    "Extras",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Basic Information":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Basic Information
            </h3>

            {message.type && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  value={profileData.firstname}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  value={profileData.lastname}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    // Reset form to current user data
                    if (authUser) {
                      setProfileData({
                        firstname: authUser.firstname,
                        lastname: authUser.lastname,
                        username: authUser.username,
                        email: authUser.email,
                      });
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        );

      case "Account & Security":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Account & Security
            </h3>

            {message.type && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4">
                <div className="flex items-center">
                  <input
                    id="twoFactor"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="twoFactor"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Enable two-factor authentication
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        );

      // Other tab content remains the same
      case "Preferences":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Preferences
            </h3>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Default Currency
                </label>
                <select
                  id="currency"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="LKR">LKR - Sri Lankan Rupee</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dateFormat"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="emailNotifications"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="emailNotifications"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Enable email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="pushNotifications"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="pushNotifications"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Enable push notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                Save
              </button>
            </div>
          </div>
        );

      case "Budget & Financial Info":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Budget & Financial Info
            </h3>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="monthlyIncome"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Monthly Income
                </label>
                <input
                  type="number"
                  id="monthlyIncome"
                  placeholder="Enter your monthly income"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="monthlyBudget"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Monthly Budget
                </label>
                <input
                  type="number"
                  id="monthlyBudget"
                  placeholder="Enter your monthly budget"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="savingsGoal"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Savings Goal
                </label>
                <input
                  type="number"
                  id="savingsGoal"
                  placeholder="Enter your savings goal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                Save
              </button>
            </div>
          </div>
        );

      case "Activity":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-teal-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900">
                  Profile Updated
                </p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900">
                  Password Changed
                </p>
                <p className="text-sm text-gray-500">1 week ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900">
                  Account Created
                </p>
                <p className="text-sm text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>
        );

      case "Extras":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Additional Options
            </h3>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Export Data
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                  Download all your data in CSV format
                </p>
                <button className="px-4 py-2 text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                  Export Data
                </button>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Delete Account
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                  Permanently delete your account and all data
                </p>
                <button className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <Mainnavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-teal-500 text-teal-600 bg-teal-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
