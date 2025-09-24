import React, { useEffect, useState } from "react";
import CategoriesPieChart from "../components/PieChart";
import ExpenseTable from "../components/Expensetable";
import Mainnavbar from "../components/Mainnavbar";
import StaticChart from "../components/StaticChart";
import { expenseService, type Expense } from "../services/expenseService";

// import { User, Bell, Calendar, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");

  // Main state variables
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // UI state variables

  // With this code that automatically calculates last 7 days
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 6); // 7 days including today
  const [activeFilter, setActiveFilter] = useState("Week");

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [endDate, setEndDate] = useState(formatDateForAPI(today));
  const [startDate, setStartDate] = useState(formatDateForAPI(oneWeekAgo));

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [activeFilter, selectedDate, startDate, endDate]);

  // Add this to Dashboard.tsx
  useEffect(() => {
    // Function to update the date range to the latest week
    const updateDateRange = () => {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 6);

      setEndDate(formatDateForAPI(today));
      setStartDate(formatDateForAPI(oneWeekAgo));
    };

    // Update immediately and then set up daily refresh
    updateDateRange();

    // Set up a timer to check and update date range once per day
    const timer = setInterval(() => {
      const now = new Date();
      // If it's after midnight, update the date range
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        updateDateRange();
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer); // Clean up on unmount
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      let data;

      // Get today's date and yesterday's date with time set to midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      if (activeFilter === "Today") {
        data = await expenseService.getExpensesByDate(today);
      } else if (activeFilter === "Yesterday") {
        data = await expenseService.getExpensesByDate(yesterday);
      } else if (activeFilter === "Week") {
        // Use the date range for the past 7 days
        console.log(`Fetching week data from ${startDate} to ${endDate}`);
        data = await expenseService.getExpensesByDateRange(startDate, endDate);
      } else if (activeFilter === "Calendar" && selectedDate) {
        const calendarDate = new Date(selectedDate);
        calendarDate.setHours(0, 0, 0, 0);
        data = await expenseService.getExpensesByDate(calendarDate);
      } else {
        data = await expenseService.getAllExpenses();
      }

      setExpenses(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load expenses");
      console.error("Error fetching expenses:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Sample data - replace with actual data from your API

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mainnavbar */}
      <Mainnavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Balance</p>
                <p className="text-2xl font-bold text-gray-900">Rs.10,000</p>
              </div>
              <div className="text-right">
                <span className="text-teal-500 font-semibold">72%</span>
                <div className="w-12 h-2 bg-gray-200 rounded-full mt-2">
                  <div className="w-9 h-2 bg-teal-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expense</p>
                <p className="text-2xl font-bold text-gray-900">10,000</p>
              </div>
              <div className="text-right">
                <span className="text-teal-500 font-semibold">72%</span>
                <div className="w-12 h-2 bg-gray-200 rounded-full mt-2">
                  <div className="w-9 h-2 bg-teal-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Income</p>
                <p className="text-2xl font-bold text-gray-900">10,000</p>
              </div>
              <div className="text-right">
                <span className="text-teal-500 font-semibold">72%</span>
                <div className="w-12 h-2 bg-gray-200 rounded-full mt-2">
                  <div className="w-9 h-2 bg-teal-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Statistics Chart */}
          <StaticChart
            startDate={startDate}
            endDate={endDate}
            title="Last 7 Days" // Add a title prop to your component if needed
            allowDateSelection={false} // Add this prop to disable the date picker UI
        />

        {/* Categories Chart */}
        <CategoriesPieChart
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        {/* Expense Table */}
          <ExpenseTable
            expenses={expenses}
            loading={loading}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
