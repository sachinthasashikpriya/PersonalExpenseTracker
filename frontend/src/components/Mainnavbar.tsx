import React from 'react';

interface MainnavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Mainnavbar: React.FC<MainnavbarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    "Dashboard",
    "Expenses",
    "Incomes",
    "Create Budget",
    "Reminders",
    "Profile",
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center mb-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format"
              alt="John Smith"
              className="w-18 h-18 rounded-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-gray-800">John Smith</h3>
        </div>
      </div>

      <nav className="p-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === item
                ? "bg-teal-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-8">
        <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Mainnavbar;