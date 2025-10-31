import React, { useEffect, useState } from "react";
import ExpenseTable from "../components/Expensetable";
import Mainnavbar from "../components/Mainnavbar";
import CategoriesPieChart from "../components/PieChart";
import StaticChart from "../components/StaticChart";
import {
  expenseService,
  type Expense,
  type ExpenseSummary,
} from "../services/expenseService";
import { incomeService, type IncomeSummary } from "../services/incomeService";

// import { User, Bell, Calendar, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");

  // Main state variables
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Financial summary states
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(
    null
  );
  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary | null>(
    null
  );
  const [summaryLoading, setSummaryLoading] = useState(true);

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

  // Calculate balance
  const balance =
    (incomeSummary?.totalIncome || 0) - (expenseSummary?.totalExpenses || 0);

  // Fetch monthly summaries
  const fetchMonthlySummaries = async () => {
    try {
      setSummaryLoading(true);
      setError(null);

      console.log("Fetching monthly summaries..."); // Debug log

      const [expenseData, incomeData] = await Promise.all([
        expenseService.getCurrentMonthSummary(),
        incomeService.getCurrentMonthSummary(),
      ]);

      console.log("Expense summary data:", expenseData); // Debug log
      console.log("Income summary data:", incomeData); // Debug log

      setExpenseSummary(expenseData);
      setIncomeSummary(incomeData);
    } catch (error) {
      console.error("Error fetching monthly summaries:", error);
      setError("Failed to load financial summary");
      // Set default values to prevent crashes
      setExpenseSummary({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        monthName: new Date().toLocaleString("default", { month: "long" }),
        totalExpenses: 0,
        expenseCount: 0,
        expensesByCategory: {},
        dailyAverage: 0,
        projectedMonthlyExpense: 0,
        highestExpense: 0,
        averageExpenseAmount: 0,
        recentExpenses: [],
        dateRange: {
          startDate: "",
          endDate: "",
        },
      });
      setIncomeSummary({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        monthName: new Date().toLocaleString("default", { month: "long" }),
        totalIncome: 0,
        incomeCount: 0,
        incomesByCategory: {},
        dailyAverage: 0,
        projectedMonthlyIncome: 0,
        highestIncome: 0,
        averageIncomeAmount: 0,
        recentIncomes: [],
        dateRange: {
          startDate: "",
          endDate: "",
        },
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [activeFilter, selectedDate, startDate, endDate]);

  // Fetch monthly summaries on component mount
  useEffect(() => {
    fetchMonthlySummaries();
  }, []);

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

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-LK", {
      // Use "en-LK" for Sri Lanka locale
      style: "currency",
      currency: "LKR", // Change INR -> LKR
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
          <p className="text-gray-600">
            {expenseSummary
              ? `Financial overview for ${expenseSummary.monthName} ${expenseSummary.year}`
              : "Loading financial data..."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryLoading ? "Loading..." : formatCurrency(balance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Current month balance
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    balance >= 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {balance >= 0 ? "↗ Positive" : "↘ Negative"}
                </div>
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expense</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryLoading
                    ? "Loading..."
                    : formatCurrency(expenseSummary?.totalExpenses || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {expenseSummary
                    ? `${expenseSummary.expenseCount} transactions`
                    : "This month"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  Avg:{" "}
                  {summaryLoading
                    ? "..."
                    : formatCurrency(expenseSummary?.averageExpenseAmount || 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Daily:{" "}
                  {summaryLoading
                    ? "..."
                    : formatCurrency(expenseSummary?.dailyAverage || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryLoading
                    ? "Loading..."
                    : formatCurrency(incomeSummary?.totalIncome || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {incomeSummary
                    ? `${incomeSummary.incomeCount} sources`
                    : "This month"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  Avg:{" "}
                  {summaryLoading
                    ? "..."
                    : formatCurrency(incomeSummary?.averageIncomeAmount || 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Daily:{" "}
                  {summaryLoading
                    ? "..."
                    : formatCurrency(incomeSummary?.dailyAverage || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Statistics Chart */}
          <div className="flex flex-col bg-white rounded-xl p-6 shadow-sm h-full">
            <StaticChart
              startDate={startDate}
              endDate={endDate}
              title="Last 7 Days" // Add a title prop to your component if needed
              allowDateSelection={false} // Add this prop to disable the date picker UI
            />
          </div>

          {/* Categories Chart */}
          <div className="flex flex-col bg-white rounded-xl p-6 shadow-sm h-full">
            <CategoriesPieChart
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>

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
