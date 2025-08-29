import React from "react";

interface AddIncomeModalProps {
  showAddIncomeModal: boolean;
  setShowAddIncomeModal: (show: boolean) => void;
  newIncome: {
    category: string;
    description: string;
    amount: string;
  };
  setNewIncome: (income: {
    category: string;
    description: string;
    amount: string;
  }) => void;
  handleAddIncome: () => void;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({
  showAddIncomeModal,
  setShowAddIncomeModal,
  newIncome,
  setNewIncome,
  handleAddIncome,
}) => {
  if (!showAddIncomeModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Add New Expense
          </h3>
          <button
            onClick={() => setShowAddIncomeModal(false)}
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
              value={newIncome.category}
              onChange={(e) =>
                setNewIncome({
                  ...newIncome,
                  category: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Investments">Investments</option>
              <option value="RentalIncome">RentalIncome</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newIncome.description}
              onChange={(e) =>
                setNewIncome({
                  ...newIncome,
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
              value={newIncome.amount}
              onChange={(e) =>
                setNewIncome({ ...newIncome, amount: e.target.value })
              }
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowAddIncomeModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddIncome}
            className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Add Income
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIncomeModal;
