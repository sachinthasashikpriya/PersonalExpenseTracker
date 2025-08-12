import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { expenseService, type Expense } from "../services/expenseService";

// Sample data for the charts
const barChartData = [
  { day: "1", Food: 300, Transport: 150, Entertainment: 100 },
  { day: "2", Food: 450, Transport: 200, Entertainment: 80 },
  { day: "3", Food: 280, Transport: 180, Entertainment: 120 },
  { day: "4", Food: 520, Transport: 160, Entertainment: 90 },
  { day: "5", Food: 380, Transport: 220, Entertainment: 150 },
  { day: "6", Food: 420, Transport: 190, Entertainment: 110 },
  { day: "7", Food: 350, Transport: 170, Entertainment: 130 },
  { day: "8", Food: 480, Transport: 210, Entertainment: 95 },
  { day: "9", Food: 320, Transport: 185, Entertainment: 140 },
  { day: "10", Food: 390, Transport: 175, Entertainment: 85 },
  { day: "11", Food: 410, Transport: 195, Entertainment: 105 },
  { day: "12", Food: 360, Transport: 165, Entertainment: 125 },
  { day: "13", Food: 440, Transport: 205, Entertainment: 115 },
  { day: "14", Food: 310, Transport: 155, Entertainment: 135 },
  { day: "15", Food: 470, Transport: 225, Entertainment: 145 },
  { day: "16", Food: 330, Transport: 180, Entertainment: 100 },
  { day: "17", Food: 400, Transport: 200, Entertainment: 120 },
  { day: "18", Food: 380, Transport: 170, Entertainment: 110 },
  { day: "19", Food: 450, Transport: 190, Entertainment: 130 },
  { day: "20", Food: 370, Transport: 185, Entertainment: 95 },
  { day: "21", Food: 420, Transport: 175, Entertainment: 140 },
  { day: "22", Food: 340, Transport: 195, Entertainment: 105 },
  { day: "23", Food: 490, Transport: 160, Entertainment: 125 },
  { day: "24", Food: 360, Transport: 210, Entertainment: 115 },
  { day: "25", Food: 430, Transport: 180, Entertainment: 135 },
  { day: "26", Food: 350, Transport: 200, Entertainment: 145 },
  { day: "27", Food: 460, Transport: 165, Entertainment: 100 },
  { day: "28", Food: 320, Transport: 195, Entertainment: 120 },
  { day: "29", Food: 400, Transport: 175, Entertainment: 110 },
  { day: "30", Food: 380, Transport: 185, Entertainment: 130 },
];

const pieChartData = [
  { name: "Food", value: 30, color: "#10b981" },
  { name: "Transport", value: 25, color: "#3b82f6" },
  { name: "Entertainment", value: 15, color: "#8b5cf6" },
  { name: "Shopping", value: 20, color: "#f59e0b" },
  { name: "Bills", value: 10, color: "#ef4444" },
];

const ExpenseComponent = () => {
  // Main state variables
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state variables
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [startDate, setStartDate] = useState("2024.02.10");
  const [endDate, setEndDate] = useState("2024.02.10");
  const [activeFilter, setActiveFilter] = useState("Today");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
  });

  const menuItems = [
    "Dashboard",
    "Expenses",
    "Incomes",
    "Create Budget",
    "Reminders",
    "Profile",
  ];
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [activeFilter, selectedDate]);

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
        console.log("Fetching Today's expenses");
        data = await expenseService.getExpensesByDate(today);
        console.log("Received data:", data);
      } else if (activeFilter === "Yesterday") {
        // Fetch only yesterday's expenses
        data = await expenseService.getExpensesByDate(yesterday);
      } else if (activeFilter === "Calendar" && selectedDate) {
        // Fetch expenses for selected calendar date
        const calendarDate = new Date(selectedDate);
        calendarDate.setHours(0, 0, 0, 0);
        data = await expenseService.getExpensesByDate(calendarDate);
      } else {
        // Default: fetch all expenses (limited to recent ones)
        data = await expenseService.getAllExpenses();
      }

      setExpenses(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load expenses");
      console.error("Error fetching expenses:", err);
      setExpenses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (newExpense.category && newExpense.description && newExpense.amount) {
      try {
        const expenseData: {
          category: string;
          description: string;
          amount: number;
          date?: string;
        } = {
          category: newExpense.category,
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
        };

        // Set date based on the active filter
        if (activeFilter === "Yesterday") {
          // Use yesterday's date when in Yesterday filter
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const year = yesterday.getFullYear();
          const month = String(yesterday.getMonth() + 1).padStart(2, "0");
          const day = String(yesterday.getDate()).padStart(2, "0");
          expenseData.date = `${year}-${month}-${day}T12:00:00.000Z`;
        } else if (activeFilter === "Calendar" && selectedDate) {
          // Use calendar selected date
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
          const day = String(selectedDate.getDate()).padStart(2, "0");
          expenseData.date = `${year}-${month}-${day}T12:00:00.000Z`;
        } else {
          // Default to today
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          expenseData.date = `${year}-${month}-${day}T12:00:00.000Z`;
        }

        const savedExpense = await expenseService.createExpense(expenseData);
        setExpenses([savedExpense, ...expenses]);
        setNewExpense({ category: "", description: "", amount: "" });
        setShowAddExpenseModal(false);
        setError(null);
      } catch (err) {
        setError("Failed to add expense");
        console.error("Error adding expense:", err);
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete expense");
      console.error("Error deleting expense:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // const getFilteredExpenses = () => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0); // Set to beginning of today

  //   const yesterday = new Date(today);
  //   yesterday.setDate(yesterday.getDate() - 1); // Set to beginning of yesterday

  //   return expenses.filter((expense) => {
  //     const expenseDate = new Date(expense.createdAt || "");
  //     expenseDate.setHours(0, 0, 0, 0); // Remove time part for comparison

  //     if (activeFilter === "Today") {
  //       return expenseDate.getTime() === today.getTime();
  //     } else if (activeFilter === "Yesterday") {
  //       return expenseDate.getTime() === yesterday.getTime();
  //     } else if (activeFilter === "Calendar" && selectedDate) {
  //       // Filter by selected calendar date
  //       selectedDate.setHours(0, 0, 0, 0);
  //       return expenseDate.getTime() === selectedDate.getTime();
  //     }
  //     return activeFilter === "Calendar" && !selectedDate; // Show all if Calendar but no date selected
  //   });
  // };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Expenses</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Date Range and Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">select the time period</span>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">start date</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">end date</label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="Food" stackId="a" fill="#1e40af" />
                <Bar dataKey="Transport" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Entertainment" stackId="a" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-800 rounded"></div>
              <span className="text-sm text-gray-600">Food</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Transport</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">Entertainment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Expense Table */}
          <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                {["Today", "Yesterday", "Calendar"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      if (filter === "Calendar") {
                        setShowCalendar(true);
                        if (!selectedDate) setSelectedDate(new Date());
                      } else {
                        setShowCalendar(false);
                        setSelectedDate(null);
                      }
                    }}
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
            </div>

            {loading ? (
              <div className="text-center py-8">Loading expenses...</div>
            ) : (
              <div className="space-y-6">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <div
                      key={expense._id}
                      className="border-b border-gray-200 pb-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-600">
                          {formatDate(expense.date || "")}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(expense._id!)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-800">
                            {expense.category}
                          </div>
                          <div className="text-gray-600">
                            {expense.description}
                          </div>
                        </div>
                        <div className="text-right font-medium text-gray-800">
                          Rs.{expense.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No expenses found for {activeFilter.toLowerCase()}
                  </div>
                )}

                {/* Add New Expense Button */}
                <div className="pt-4">
                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span className="text-xl">+</span>
                    <span>Add New Expense</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Categories Pie Chart */}
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
        </div>

        {/* Add Expense Modal */}
        {showAddExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add New Expense
                </h3>
                <button
                  onClick={() => setShowAddExpenseModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show Calendar When Selected */}
        {showCalendar && (
          <div className="mb-6">
            <div className="bg-white p-2 shadow-md inline-block rounded-md">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                maxDate={new Date()}
              />
            </div>
            {selectedDate && (
              <div className="mt-2 text-sm text-gray-600">
                Showing expenses for: {formatDate(selectedDate.toISOString())}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseComponent;
