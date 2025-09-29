import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Import the auth context

interface MainnavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Mainnavbar: React.FC<MainnavbarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Use the auth context

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Expenses", path: "/expense" },
    { name: "Incomes", path: "/income" },
    { name: "Create Budget", path: "/create-budget" },
    { name: "Reminders", path: "/reminder" },
    { name: "Profile", path: "/profile" },
  ];

  const handleNavigation = (itemName: string, path: string) => {
    setActiveTab(itemName); // still highlight the active one
    navigate(path); // navigate to route
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Call the logout function from auth context
    navigate("/signin"); // Redirect to login page
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center mb-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format"
              alt={user?.firstname || "User"}
              className="w-18 h-18 rounded-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-gray-800">
            {user?.firstname} {user?.lastname}
          </h3>
        </div>
      </div>

      <nav className="p-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.name, item.path)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === item.name
                ? "bg-teal-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-8">
        <button
          onClick={handleLogout} // Add the onClick handler
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Mainnavbar;
