import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { incomeService } from "../services/incomeService";

interface StaticChartProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

// Category colors for consistency
const CATEGORY_COLORS = {
  Salary: "#1e40af",
  Investments: "#3b82f6",
  RentalIncome: "#60a5fa",
  //   Shopping: "#f59e0b",
  //   Bills: "#ef4444",
  Other: "#6b7280",
};

const StaticChart: React.FC<StaticChartProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Set default date range to current month on component mount
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format date using local values to avoid timezone issues
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedFirstDay = formatDate(firstDay);
    const formattedLastDay = formatDate(lastDay);

    // Set the dates
    setStartDate(formattedFirstDay);
    setEndDate(formattedLastDay);

    // Explicitly fetch data immediately using these values
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        console.log(
          `Initial fetch from ${formattedFirstDay} to ${formattedLastDay}`
        );
        const response = await incomeService.getIncomesByDateRange(
          formattedFirstDay,
          formattedLastDay
        );

        if (!response || !Array.isArray(response)) {
          throw new Error("Invalid response format");
        }

        // Process data for chart
        const processedData = processIncomeData(response);
        setChartData(processedData.data);
        setCategories(processedData.categories);
        setError(null);
      } catch (err) {
        console.error("Error fetching initial income data:", err);
        setError("Failed to load chart data");
        setChartData([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array - only run once on mount

  // Fetch data when date range changes (but not on initial load)
  const initialLoadRef = React.useRef(true);

  useEffect(() => {
    // Skip the first execution (which happens right after component mount)
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Only fetch if we have both dates and this isn't the initial load
    if (startDate && endDate) {
      fetchIncomeData();
    }
  }, [startDate, endDate]);

  const fetchIncomeData = async () => {
    try {
      setLoading(true);

      // Call your backend API to get incomes for date range
      const response = await incomeService.getIncomesByDateRange(
        startDate,
        endDate
      );

      if (!response || !Array.isArray(response)) {
        throw new Error("Invalid response format");
      }

      // Process data for chart
      const processedData = processIncomeData(response);
      setChartData(processedData.data);
      setCategories(processedData.categories);
      setError(null);
    } catch (err) {
      console.error("Error fetching income data for chart:", err);
      setError("Failed to load chart data");
      setChartData([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Process raw income data into chart format
  const processIncomeData = (incomes: any[]) => {
    if (!incomes || incomes.length === 0) {
      return { data: [], categories: [] };
    }

    // Get all unique categories
    const allCategories = Array.from(new Set(incomes.map((e) => e.category)));

    // Group incomes by day
    const groupedByDay: Record<string, Record<string, number>> = {};

    // Initialize each day with zero values for each category
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (
      let day = new Date(start);
      day <= end;
      day.setDate(day.getDate() + 1)
    ) {
      const dayKey = day.toISOString().split("T")[0];
      groupedByDay[dayKey] = {};

      // Initialize all categories with 0
      allCategories.forEach((category) => {
        groupedByDay[dayKey][category] = 0;
      });
    }

    // Fill in actual values
    incomes.forEach((income) => {
      const dayKey = new Date(income.date).toISOString().split("T")[0];
      const category = income.category;

      if (groupedByDay[dayKey]) {
        groupedByDay[dayKey][category] =
          (groupedByDay[dayKey][category] || 0) + income.amount;
      }
    });

    // Convert to array format for recharts
    const chartData = Object.entries(groupedByDay).map(([day, values]) => {
      // Format day to display better (e.g., "Aug 15")
      const date = new Date(day);
      const formattedDay = `${date.getDate()}/${date.getMonth() + 1}`;

      return {
        day: formattedDay,
        date: day, // Keep full date for sorting
        ...values,
      };
    });

    // Sort by date
    chartData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      data: chartData,
      categories: allCategories,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">select the time period</span>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">end date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-80 mb-6">
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
            <p>No income data available for selected date range</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              {categories.map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={
                    CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ||
                    CATEGORY_COLORS.Other
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Dynamic Legend */}
      <div className="flex flex-wrap gap-6">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor:
                  CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ||
                  CATEGORY_COLORS.Other,
              }}
            ></div>
            <span className="text-sm text-gray-600">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticChart;
