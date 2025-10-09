import { useEffect, useState } from "react";
import BudgetDetails from "../components/BudgetDetails";
import BudgetForm from "../components/BudgetForm";
import BudgetList from "../components/BudgetList";
import Mainnavbar from "../components/Mainnavbar";
import { budgetService } from "../services/budgetService";
import type { Budget } from "../types/budgettypes";

const Createbudget = () => {
  const [activeTab, setActiveTab] = useState("Create Budget");
  const [view, setView] = useState<"list" | "create" | "details">("list");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetService.getAllBudgets();
      setBudgets(data);
      setError(null);
    } catch (err) {
      setError("Failed to load budgets");
      console.error("Error fetching budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setView("details");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mainnavbar */}
      <Mainnavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Budget Management
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg ${
                view === "list"
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              View Budgets
            </button>
            <button
              onClick={() => {
                setSelectedBudget(null);
                setView("create");
              }}
              className={`px-4 py-2 rounded-lg ${
                view === "create"
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Create New Budget
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Content based on selected view */}
        {view === "list" && (
          <BudgetList
            budgets={budgets}
            loading={loading}
            onSelectBudget={handleSelectBudget}
            onRefresh={fetchBudgets}
          />
        )}

        {view === "create" && (
          <BudgetForm
            existingBudget={selectedBudget}
            onSave={() => {
              fetchBudgets();
              setView("list");
            }}
            onCancel={() => setView("list")}
          />
        )}

        {view === "details" && selectedBudget && (
          <BudgetDetails
            budget={selectedBudget}
            onEdit={() => setView("create")}
            onBack={() => setView("list")}
            onUpdate={fetchBudgets}
          />
        )}
      </div>
    </div>
  );
};

export default Createbudget;
