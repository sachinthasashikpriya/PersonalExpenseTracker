import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { incomeService } from "../services/incomeService";

interface CategoriesPieChartProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

// Category colors mapping
const CATEGORY_COLORS = {
  Salary: "#10b981",
  Investment: "#3b82f6",
  RentalIncome: "#8b5cf6",
  //   Shopping: "#f59e0b",
  //   Bills: "#ef4444",
  Other: "#6b7280", // For any other categories
};

const CategoriesPieChart: React.FC<CategoriesPieChartProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set default filter to Today if not set
    if (!activeFilter) {
      setActiveFilter("Today");
    }

    fetchIncomeData();
  }, [activeFilter, setActiveFilter]);

  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      let data;

      // Get appropriate date range based on filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (activeFilter === "Today") {
        data = await incomeService.getIncomesByDate(today);
      } else if (activeFilter === "Day") {
        // Get yesterday's data
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        data = await incomeService.getIncomesByDate(yesterday);
      } else if (activeFilter === "Week") {
        // Get weekly data - implement in backend or fetch 7 days and combine
        data = await incomeService.getAllIncomes(); // Temporary: fetch all and filter client-side
      } else if (activeFilter === "Month") {
        // Get monthly data - implement in backend or fetch current month and combine
        data = await incomeService.getAllIncomes(); // Temporary: fetch all and filter client-side
      }

      // Process data for chart
      const processedData = processIncomeData(data || []);
      setChartData(processedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching income data for chart:", err);
      setError("Failed to load chart data");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Process raw income data into chart format
  interface Income {
    category: string;
    amount: number;
  }

  const processIncomeData = (incomes: Income[]): ChartData[] => {
    if (!incomes || incomes.length === 0) {
      return [];
    }

    // Group incomes by category
    const categoryTotals: Record<string, number> = {};
    let total = 0;

    // Calculate totals by category
    incomes.forEach((income) => {
      const { category, amount } = income;
      if (category) {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        total += amount;
      }
    });

    // Convert to percentage and format for chart
    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      value: Math.round((amount / total) * 100), // Calculate percentage
      color:
        CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] ||
        CATEGORY_COLORS.Other,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Categories
      </h3>
      <div className="space-x-2 mb-4">
        {["Today", "Day", "Week", "Month"].map((filter) => (
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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <p>{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No income data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Legend */}
      <div className="space-y-2">
        {chartData.length > 0 ? (
          chartData.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-gray-700">
                  {category.name} {category.value}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No categories to display
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPieChart;
