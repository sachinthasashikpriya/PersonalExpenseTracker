import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Expense } from "../services/expenseService";

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  handleDeleteExpense?: (id: string) => void;
  setShowAddExpenseModal?: (show: boolean) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  loading,
  activeFilter,
  setActiveFilter,
  selectedDate,
  setSelectedDate,
  showCalendar,
  setShowCalendar,
  handleDeleteExpense,
  setShowAddExpenseModal,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          {["Today", "Yesterday", "Week", "Calendar"].map((filter) => (
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

      {loading ? (
        <div className="text-center py-8">Loading expenses...</div>
      ) : (
        <div className="space-y-6">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div key={expense._id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-600">
                    {formatDate(expense.date || "")}
                  </span>
                  <button
                    onClick={() =>
                      handleDeleteExpense && handleDeleteExpense(expense._id!)
                    }
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
                    <div className="text-gray-600">{expense.description}</div>
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
              onClick={() =>
                setShowAddExpenseModal && setShowAddExpenseModal(true)
              }
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-xl">+</span>
              <span>Add New Expense</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
