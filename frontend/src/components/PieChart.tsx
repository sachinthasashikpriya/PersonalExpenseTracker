import React from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

interface CategoriesPieChartProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const pieChartData = [
  { name: "Food", value: 30, color: "#10b981" },
  { name: "Transport", value: 25, color: "#3b82f6" },
  { name: "Entertainment", value: 15, color: "#8b5cf6" },
  { name: "Shopping", value: 20, color: "#f59e0b" },
  { name: "Bills", value: 10, color: "#ef4444" },
];

const CategoriesPieChart: React.FC<CategoriesPieChartProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Categories
      </h3>
      <div className="space-x-2 mb-4">
        {["Daily", "Weekly", "Monthly"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-teal-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Legend */}
      <div className="space-y-2">
        {pieChartData.map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded`}
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-gray-700">
                {category.name} {category.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPieChart;