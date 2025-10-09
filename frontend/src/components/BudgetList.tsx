import React, { useState } from "react";
import Swal from "sweetalert2";
import { budgetService } from "../services/budgetService";
import type { BudgetListProps, BudgetStatus } from "../types/budgettypes";

const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  loading,
  onSelectBudget,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<BudgetStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteBudget = async (id: string | undefined) => {
    if (!id) return;

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await budgetService.deleteBudget(id);
        Swal.fire("Deleted!", "Your budget has been deleted.", "success");
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      Swal.fire("Error!", "Failed to delete budget.", "error");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredBudgets = budgets
    .filter((budget) => {
      if (filter === "all") return true;
      return budget.status === filter;
    })
    .filter((budget) =>
      budget.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Your Budgets</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <input
              type="text"
              placeholder="Search budgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as BudgetStatus | "all")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Budgets</option>
              <option value="planning">Planning</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading budgets...</p>
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          {searchQuery || filter !== "all" ? (
            <p className="text-gray-500">
              No budgets match your current filters.
            </p>
          ) : (
            <>
              <p className="text-gray-500 mb-4">
                You haven't created any budgets yet.
              </p>
              <p className="text-gray-500">
                Click on "Create New Budget" button to get started.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => (
            <div
              key={budget._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">
                    {budget.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      budget.status
                    )}`}
                  >
                    {budget.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </p>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {budget.description || "No description provided."}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-gray-500 text-sm">Total Budget:</span>
                    <p className="text-lg font-bold text-gray-800">
                      ${budget.totalBudget.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Items:</span>
                    <p className="text-lg font-semibold text-gray-800">
                      {budget.items.length}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => onSelectBudget(budget)}
                    className="px-4 py-2 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors flex-1"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBudget(budget._id);
                    }}
                    className="px-4 py-2 text-sm bg-white border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetList;
