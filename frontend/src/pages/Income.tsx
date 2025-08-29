import { useEffect, useState } from "react";
import AddIncomeModal from "../components/AddIncomeModal";
import IncomeTable from "../components/Incometable";
import Mainnavbar from "../components/Mainnavbar";
import CategoriesPieChartIncome from "../components/PieChartIncome";
import StaticChartIncome from "../components/StaticChartIncome";
import { incomeService, type Income } from "../services/incomeService";

const IncomeComponent = () => {
  // Main state variables
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state variables
  const [activeTab, setActiveTab] = useState("Incomes");
  const [startDate, setStartDate] = useState("2024.02.10");
  const [endDate, setEndDate] = useState("2024.02.10");
  const [activeFilter, setActiveFilter] = useState("Today");
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [newIncome, setNewIncome] = useState({
    category: "",
    description: "",
    amount: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch expenses on component mount
  useEffect(() => {
    fetchIncomes();
  }, [activeFilter, selectedDate]);

  const fetchIncomes = async () => {
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
        console.log("Fetching Today's incomes");
        data = await incomeService.getIncomesByDate(today);
        console.log("Received data:", data);
      } else if (activeFilter === "Yesterday") {
        // Fetch only yesterday's expenses
        data = await incomeService.getIncomesByDate(yesterday);
      } else if (activeFilter === "Calendar" && selectedDate) {
        // Fetch expenses for selected calendar date
        const calendarDate = new Date(selectedDate);
        calendarDate.setHours(0, 0, 0, 0);
        data = await incomeService.getIncomesByDate(calendarDate);
      } else {
        // Default: fetch all expenses (limited to recent ones)
        data = await incomeService.getAllIncomes();
      }

      setIncomes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load incomes");
      console.error("Error fetching incomes:", err);
      setIncomes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async () => {
    if (newIncome.category && newIncome.description && newIncome.amount) {
      try {
        const incomeData: {
          category: string;
          description: string;
          amount: number;
          date?: string;
        } = {
          category: newIncome.category,
          description: newIncome.description,
          amount: parseFloat(newIncome.amount),
        };

        // Set date based on the active filter
        if (activeFilter === "Yesterday") {
          // Use yesterday's date when in Yesterday filter
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const year = yesterday.getFullYear();
          const month = String(yesterday.getMonth() + 1).padStart(2, "0");
          const day = String(yesterday.getDate()).padStart(2, "0");
          incomeData.date = `${year}-${month}-${day}T12:00:00.000Z`;
        } else if (activeFilter === "Calendar" && selectedDate) {
          // Use calendar selected date
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
          const day = String(selectedDate.getDate()).padStart(2, "0");
          incomeData.date = `${year}-${month}-${day}T12:00:00.000Z`;
        } else {
          // Default to today
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          incomeData.date = `${year}-${month}-${day}T12:00:00.000Z`;
        }

        const savedIncome = await incomeService.createIncome(incomeData);
        setIncomes([savedIncome, ...incomes]);
        setNewIncome({ category: "", description: "", amount: "" });
        setShowAddIncomeModal(false);
        setError(null);
      } catch (err) {
        setError("Failed to add Income");
        console.error("Error adding Income:", err);
      }
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await incomeService.deleteIncome(id);
      setIncomes(incomes.filter((income) => income._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete Income");
      console.error("Error deleting Income:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mainnavbar */}
      <Mainnavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Incomes</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Date Range and Chart */}
        <StaticChartIncome
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <div className="grid grid-cols-3 gap-8">
          {/* Income Table */}
          <IncomeTable
            incomes={incomes}
            loading={loading}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            handleDeleteIncome={handleDeleteIncome}
            setShowAddIncomeModal={setShowAddIncomeModal}
          />

          {/* Categories Pie Chart */}
          <CategoriesPieChartIncome
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        {/* Add Expense Modal */}
        <AddIncomeModal
          showAddIncomeModal={showAddIncomeModal}
          setShowAddIncomeModal={setShowAddIncomeModal}
          newIncome={newIncome}
          setNewIncome={setNewIncome}
          handleAddIncome={handleAddIncome}
        />
      </div>
    </div>
  );
};

export default IncomeComponent;
