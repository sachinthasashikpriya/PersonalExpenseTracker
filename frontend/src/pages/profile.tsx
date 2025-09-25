import Mainnavbar from "../components/Mainnavbar";
import { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Basic Information");

  const tabs = [
    "Basic Information",
    "Account & Security",
    "Preferences",
    "Budget & Financial Info",
    "Activity",
    "Extras"
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Basic Information":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  defaultValue="John Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  defaultValue="John Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="077 - 1234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue="JohnSmith@example.com"
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

      case "Account & Security":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Account & Security</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
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
                  <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-900">
                    Enable two-factor authentication
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        );

      case "Preferences":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Preferences</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                      Enable email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="pushNotifications"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-900">
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
            <h3 className="text-lg font-medium text-gray-900 mb-6">Budget & Financial Info</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700 mb-2">
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
            <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-teal-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900">Password Changed</p>
                <p className="text-sm text-gray-500">1 week ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>
        );

      case "Extras":
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Additional Options</h3>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Export Data</h4>
                <p className="text-sm text-gray-500 mb-3">Download all your data in CSV format</p>
                <button className="px-4 py-2 text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                  Export Data
                </button>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Delete Account</h4>
                <p className="text-sm text-gray-500 mb-3">Permanently delete your account and all data</p>
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
      <Mainnavbar />
      
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