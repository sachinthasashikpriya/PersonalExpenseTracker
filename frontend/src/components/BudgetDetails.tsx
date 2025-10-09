import React, { useState } from "react";
import Swal from "sweetalert2";
import { budgetService } from "../services/budgetService";
import type { BudgetDetailsProps, BudgetStatus } from "../types/budgettypes";

const BudgetDetails: React.FC<BudgetDetailsProps> = ({
  budget,
  onEdit,
  onBack,
  onUpdate,
}) => {
  const [viewMode, setViewMode] = useState<
    "overview" | "items" | "contributors"
  >("overview");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "essentials":
        return "🛒";
      case "housing":
        return "🏠";
      case "transportation":
        return "🚗";
      case "food":
        return "🍔";
      case "utilities":
        return "💡";
      case "insurance":
        return "🛡️";
      case "healthcare":
        return "🏥";
      case "entertainment":
        return "🎬";
      case "education":
        return "📚";
      case "personal":
        return "👤";
      case "debt":
        return "💳";
      case "savings":
        return "💰";
      default:
        return "📋";
    }
  };

  const handleStatusChange = async (newStatus: BudgetStatus) => {
    if (!budget._id) return;

    try {
      await budgetService.updateBudget(budget._id, {
        ...budget,
        status: newStatus,
      });

      Swal.fire({
        title: "Status Updated",
        text: `Budget status has been changed to ${newStatus}`,
        icon: "success",
      });

      onUpdate();
    } catch (error) {
      console.error("Error updating budget status:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update budget status",
        icon: "error",
      });
    }
  };

  const handleUpdateActualAmount = async (
    itemIndex: number,
    actualAmount: number
  ) => {
    if (isNaN(actualAmount) || actualAmount < 0 || !budget._id) {
      Swal.fire({
        title: "Invalid Amount",
        text: "Please enter a valid positive number",
        icon: "error",
      });
      return;
    }

    try {
      const updatedItems = [...budget.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        actualAmount,
      };

      await budgetService.updateBudget(budget._id, {
        ...budget,
        items: updatedItems,
      });

      Swal.fire({
        title: "Updated",
        text: "Actual amount has been updated",
        icon: "success",
      });

      onUpdate();
    } catch (error) {
      console.error("Error updating actual amount:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update actual amount",
        icon: "error",
      });
    }
  };

  const allContributors = budget.items.flatMap((item) =>
    item.contributors.map((contributor) => ({
      ...contributor,
      itemName: item.name,
    }))
  );

  // Group contributors by name to show total contribution
  const groupedContributors = allContributors.reduce((acc, curr) => {
    const existing = acc.find((c) => c.name === curr.name);
    if (existing) {
      existing.contribution += curr.contribution;
      existing.items.push(curr.itemName);
    } else {
      acc.push({
        name: curr.name,
        email: curr.email,
        contribution: curr.contribution,
        items: [curr.itemName],
      });
    }
    return acc;
  }, [] as Array<{ name: string; email?: string; contribution: number; items: string[] }>);

  // Calculate progress
  const calculateProgress = () => {
    if (budget.status === "completed") return 100;
    if (budget.status === "planning") return 0;

    const itemsWithActualAmount = budget.items.filter(
      (item) => item.actualAmount !== undefined
    );
    if (itemsWithActualAmount.length === 0) return 0;

    return Math.round(
      (itemsWithActualAmount.length / budget.items.length) * 100
    );
  };

  const progressPercentage = calculateProgress();

  // Calculate actual spent amount
  const actualSpent = budget.items.reduce(
    (sum, item) => sum + (item.actualAmount || 0),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{budget.title}</h2>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                  budget.status
                )}`}
              >
                {budget.status}
              </span>
            </div>
            <p className="text-gray-600">{budget.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onBack}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">
              {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="text-lg font-bold">
              ${budget.totalBudget.toFixed(2)}
            </p>
          </div>
          {budget.status !== "planning" && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Actual Spent</p>
              <p className="text-lg font-bold">${actualSpent.toFixed(2)}</p>
            </div>
          )}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Items</p>
            <p className="text-lg font-medium">{budget.items.length}</p>
          </div>
        </div>

        {budget.status === "ongoing" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress
            </label>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-teal-500 h-4 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">0%</span>
              <span className="text-xs font-medium text-gray-700">
                {progressPercentage}% Complete
              </span>
              <span className="text-xs text-gray-500">100%</span>
            </div>
          </div>
        )}

        {/* Status Update Options */}
        {budget.status !== "completed" && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Update Status:
            </p>
            <div className="flex gap-2">
              {budget.status !== "planning" && (
                <button
                  onClick={() => handleStatusChange("planning")}
                  className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                >
                  Set as Planning
                </button>
              )}
              {budget.status !== "ongoing" && (
                <button
                  onClick={() => handleStatusChange("ongoing")}
                  className="px-3 py-1 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-50"
                >
                  Set as Ongoing
                </button>
              )}
              <button
                onClick={() => handleStatusChange("completed")}
                className="px-3 py-1 border border-green-500 text-green-500 rounded hover:bg-green-50"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        )}

        <div className="flex border-b mb-4">
          <button
            onClick={() => setViewMode("overview")}
            className={`px-4 py-2 font-medium ${
              viewMode === "overview"
                ? "text-teal-500 border-b-2 border-teal-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode("items")}
            className={`px-4 py-2 font-medium ${
              viewMode === "items"
                ? "text-teal-500 border-b-2 border-teal-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Budget Items
          </button>
          {allContributors.length > 0 && (
            <button
              onClick={() => setViewMode("contributors")}
              className={`px-4 py-2 font-medium ${
                viewMode === "contributors"
                  ? "text-teal-500 border-b-2 border-teal-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Contributors
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {viewMode === "overview" && (
          <div>
            <h3 className="text-lg font-medium mb-4">Budget Overview</h3>

            {/* Budget Summary */}
            <div className="mb-8">
              <h4 className="text-md font-medium mb-2">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <strong>Created:</strong> {formatDate(budget.createdAt)}
                  </p>
                  <p className="text-gray-600">
                    <strong>Last Updated:</strong>{" "}
                    {formatDate(budget.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Total Budget Items:</strong> {budget.items.length}
                  </p>
                  <p className="text-gray-600">
                    <strong>Total Contributors:</strong>{" "}
                    {groupedContributors.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-2">Category Breakdown</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                        Category
                      </th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                        Items
                      </th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                        Total Amount
                      </th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                        % of Budget
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(
                      budget.items.reduce((acc, item) => {
                        if (!acc[item.category]) {
                          acc[item.category] = {
                            count: 0,
                            total: 0,
                          };
                        }
                        acc[item.category].count++;
                        acc[item.category].total += item.estimatedAmount;
                        return acc;
                      }, {} as Record<string, { count: number; total: number }>)
                    ).map(([category, data]) => (
                      <tr key={category} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>{getCategoryIcon(category)}</span>
                            <span className="capitalize">{category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{data.count}</td>
                        <td className="py-3 px-4">${data.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          {((data.total / budget.totalBudget) * 100).toFixed(1)}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewMode === "items" && (
          <div>
            <h3 className="text-lg font-medium mb-4">Budget Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Category
                    </th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Estimated
                    </th>
                    {budget.status !== "planning" && (
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                        Actual
                      </th>
                    )}
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                      Contributors
                    </th>
                    {budget.status === "ongoing" && (
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {budget.items.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 ${
                        selectedItemIndex === index ? "bg-teal-50" : ""
                      }`}
                      onClick={() =>
                        setSelectedItemIndex(
                          selectedItemIndex === index ? null : index
                        )
                      }
                    >
                      <td className="py-3 px-4 cursor-pointer">{item.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span>{getCategoryIcon(item.category)}</span>
                          <span className="capitalize">{item.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        ${item.estimatedAmount.toFixed(2)}
                      </td>
                      {budget.status !== "planning" && (
                        <td className="py-3 px-4">
                          {item.actualAmount !== undefined
                            ? `$${item.actualAmount.toFixed(2)}`
                            : "Not set"}
                        </td>
                      )}
                      <td className="py-3 px-4">
                        {item.contributors.length > 0 ? (
                          <span className="text-sm">
                            {item.contributors.length} contributor(s)
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </td>
                      {budget.status === "ongoing" && (
                        <td className="py-3 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              Swal.fire({
                                title: "Update Actual Amount",
                                input: "number",
                                inputValue: item.actualAmount?.toString() || "",
                                inputAttributes: {
                                  min: "0",
                                  step: "0.01",
                                },
                                showCancelButton: true,
                                confirmButtonText: "Update",
                                showLoaderOnConfirm: true,
                                preConfirm: (value) => {
                                  return handleUpdateActualAmount(
                                    index,
                                    parseFloat(value)
                                  );
                                },
                              });
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Update Amount
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected item details */}
            {selectedItemIndex !== null && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-md font-medium mb-2">
                  {budget.items[selectedItemIndex].name} Details
                </h4>
                {budget.items[selectedItemIndex].contributors.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Contributors:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {budget.items[selectedItemIndex].contributors.map(
                        (contributor, idx) => (
                          <div
                            key={idx}
                            className="p-3 border border-gray-200 rounded-lg"
                          >
                            <p className="font-medium">{contributor.name}</p>
                            {contributor.email && (
                              <p className="text-sm text-gray-500">
                                {contributor.email}
                              </p>
                            )}
                            <p className="mt-1 text-teal-600 font-medium">
                              ${contributor.contribution.toFixed(2)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No contributors for this budget item.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {viewMode === "contributors" && (
          <div>
            <h3 className="text-lg font-medium mb-4">Contributors</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedContributors
                .sort((a, b) => b.contribution - a.contribution)
                .map((contributor, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{contributor.name}</h4>
                        {contributor.email && (
                          <p className="text-sm text-gray-500">
                            {contributor.email}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-teal-600 font-bold">
                          ${contributor.contribution.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(
                            (contributor.contribution / budget.totalBudget) *
                            100
                          ).toFixed(1)}
                          % of budget
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Contributing to {contributor.items.length} item(s):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {contributor.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {groupedContributors.length === 0 && (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  No contributors for this budget.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetDetails;
