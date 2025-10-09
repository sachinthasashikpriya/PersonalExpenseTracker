import { useEffect, useState } from "react";
import { budgetService } from "../services/budgetService";
import type {
  Budget,
  BudgetFormProps,
  BudgetItem,
  Contributor,
} from "../types/budgettypes";

const BudgetForm: React.FC<BudgetFormProps> = ({
  existingBudget,
  onSave,
  onCancel,
}) => {
  const [budget, setBudget] = useState<Budget>({
    title: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
    totalBudget: 0,
    status: "planning",
    items: [],
  });

  const [showAddItem, setShowAddItem] = useState(false);
  const [currentItem, setCurrentItem] = useState<BudgetItem>({
    name: "",
    estimatedAmount: 0,
    category: "essentials",
    contributors: [],
  });

  const [currentContributor, setCurrentContributor] = useState<Contributor>({
    name: "",
    email: "",
    contribution: 0,
  });

  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingBudget) {
      setBudget({
        ...existingBudget,
        startDate: new Date(existingBudget.startDate)
          .toISOString()
          .split("T")[0],
        endDate: new Date(existingBudget.endDate).toISOString().split("T")[0],
      });
    }
  }, [existingBudget]);

  const handleBudgetChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBudget((prev) => ({
      ...prev,
      [name]: name === "totalBudget" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: name === "estimatedAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleContributorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentContributor((prev) => ({
      ...prev,
      [name]: name === "contribution" ? parseFloat(value) || 0 : value,
    }));
  };

  const addContributor = () => {
    if (!currentContributor.name || currentContributor.contribution <= 0) {
      setError("Please enter a valid contributor name and contribution amount");
      return;
    }

    setCurrentItem((prev) => ({
      ...prev,
      contributors: [...prev.contributors, { ...currentContributor }],
    }));

    setCurrentContributor({
      name: "",
      email: "",
      contribution: 0,
    });
  };

  const removeContributor = (index: number) => {
    setCurrentItem((prev) => ({
      ...prev,
      contributors: prev.contributors.filter((_, i) => i !== index),
    }));
  };

  const addOrUpdateItem = () => {
    if (!currentItem.name || currentItem.estimatedAmount <= 0) {
      setError("Please enter a valid item name and estimated amount");
      return;
    }

    if (editingItemIndex !== null) {
      const newItems = [...budget.items];
      newItems[editingItemIndex] = currentItem;
      setBudget((prev) => ({
        ...prev,
        items: newItems,
        totalBudget: newItems.reduce(
          (sum, item) => sum + item.estimatedAmount,
          0
        ),
      }));
      setEditingItemIndex(null);
    } else {
      setBudget((prev) => {
        const newItems = [...prev.items, currentItem];
        return {
          ...prev,
          items: newItems,
          totalBudget: newItems.reduce(
            (sum, item) => sum + item.estimatedAmount,
            0
          ),
        };
      });
    }

    setCurrentItem({
      name: "",
      estimatedAmount: 0,
      category: "essentials",
      contributors: [],
    });

    setShowAddItem(false);
    setError(null);
  };

  const editItem = (index: number) => {
    setCurrentItem({ ...budget.items[index] });
    setEditingItemIndex(index);
    setShowAddItem(true);
  };

  const removeItem = (index: number) => {
    setBudget((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      return {
        ...prev,
        items: newItems,
        totalBudget: newItems.reduce(
          (sum, item) => sum + item.estimatedAmount,
          0
        ),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!budget.title || !budget.startDate || !budget.endDate) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (budget.items.length === 0) {
      setError("Please add at least one budget item");
      setIsSubmitting(false);
      return;
    }

    try {
      if (existingBudget && existingBudget._id) {
        await budgetService.updateBudget(existingBudget._id, budget);
      } else {
        await budgetService.createBudget(budget);
      }
      onSave();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save budget";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {existingBudget ? "Edit Budget" : "Create New Budget"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              type="text"
              name="title"
              value={budget.title}
              onChange={handleBudgetChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={budget.status}
              onChange={handleBudgetChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="planning">Planning</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date*
            </label>
            <input
              type="date"
              name="startDate"
              value={budget.startDate}
              onChange={handleBudgetChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date*
            </label>
            <input
              type="date"
              name="endDate"
              value={budget.endDate}
              onChange={handleBudgetChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={budget.description}
              onChange={handleBudgetChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Budget Items</h3>
            <button
              type="button"
              onClick={() => {
                setCurrentItem({
                  name: "",
                  estimatedAmount: 0,
                  category: "essentials",
                  contributors: [],
                });
                setEditingItemIndex(null);
                setShowAddItem(true);
              }}
              className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Add Item
            </button>
          </div>

          {budget.items.length === 0 ? (
            <div className="text-gray-500 text-center py-6 border border-dashed border-gray-300 rounded-lg">
              No budget items added yet. Click "Add Item" to create your first
              budget item.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Category
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Contributors
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {budget.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{item.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        ${item.estimatedAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {item.contributors.length ? (
                          <div className="text-sm">
                            {item.contributors.length} contributor(s)
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">None</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => editItem(index)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4">
            <div className="flex justify-end">
              <div className="text-xl font-bold">
                Total Budget: ${budget.totalBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Item Form */}
        {showAddItem && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-lg font-medium mb-4">
              {editingItemIndex !== null
                ? "Edit Budget Item"
                : "Add Budget Item"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentItem.name}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={currentItem.category}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="essentials">Essentials</option>
                  <option value="housing">Housing</option>
                  <option value="transportation">Transportation</option>
                  <option value="food">Food</option>
                  <option value="utilities">Utilities</option>
                  <option value="insurance">Insurance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="education">Education</option>
                  <option value="personal">Personal</option>
                  <option value="debt">Debt</option>
                  <option value="savings">Savings</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Amount*
                </label>
                <input
                  type="number"
                  name="estimatedAmount"
                  value={currentItem.estimatedAmount}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {existingBudget && existingBudget.status !== "planning" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Amount
                  </label>
                  <input
                    type="number"
                    name="actualAmount"
                    value={currentItem.actualAmount || 0}
                    onChange={handleItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <h5 className="text-md font-medium mb-2">Contributors</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentContributor.name}
                    onChange={handleContributorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={currentContributor.email}
                    onChange={handleContributorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contribution
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="contribution"
                      value={currentContributor.contribution}
                      onChange={handleContributorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      min="0"
                      step="0.01"
                    />
                    <button
                      type="button"
                      onClick={addContributor}
                      className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {currentItem.contributors.length > 0 && (
                <div className="mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                            Name
                          </th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                            Email
                          </th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                            Contribution
                          </th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentItem.contributors.map((contributor, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-4">{contributor.name}</td>
                            <td className="py-2 px-4">
                              {contributor.email || "N/A"}
                            </td>
                            <td className="py-2 px-4">
                              ${contributor.contribution.toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              <button
                                type="button"
                                onClick={() => removeContributor(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addOrUpdateItem}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                {editingItemIndex !== null ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : existingBudget
              ? "Update Budget"
              : "Create Budget"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
