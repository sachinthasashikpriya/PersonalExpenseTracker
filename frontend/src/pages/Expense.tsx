import { useEffect, useState } from "react";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseTable from "../components/Expensetable";
import Mainnavbar from "../components/Mainnavbar";
import CategoriesPieChart from "../components/PieChart";
import StaticChart from "../components/Staticchart";
import { expenseService, type Expense } from "../services/expenseService";

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mainnavbar */}
      <Mainnavbar activeTab={activeTab} setActiveTab={setActiveTab} />

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
        <StaticChart
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <div className="grid grid-cols-3 gap-8">
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
            handleDeleteExpense={handleDeleteExpense}
            setShowAddExpenseModal={setShowAddExpenseModal}
          />

          {/* Categories Pie Chart */}
          <CategoriesPieChart
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        {/* Add Expense Modal */}
        <AddExpenseModal
          showAddExpenseModal={showAddExpenseModal}
          setShowAddExpenseModal={setShowAddExpenseModal}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          handleAddExpense={handleAddExpense}
        />
      </div>
    </div>
  );
};

export default ExpenseComponent;
