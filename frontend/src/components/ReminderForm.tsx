import React, { useEffect, useState } from "react";
import type {
  ReminderFormData,
  ReminderFormProps,
} from "../types/reminderTypes";

const ReminderForm: React.FC<ReminderFormProps> = ({
  reminder,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().substring(0, 16), // Format: YYYY-MM-DDThh:mm
    priority: "medium",
    notifyBefore: 30, // 30 minutes by default
  });

  useEffect(() => {
    if (reminder) {
      // If editing, convert date string to local datetime-local format
      const dueDateObj = new Date(reminder.dueDate);
      const localDueDate = dueDateObj.toISOString().substring(0, 16);

      setFormData({
        title: reminder.title,
        description: reminder.description,
        dueDate: localDueDate,
        priority: reminder.priority,
        notifyBefore: reminder.notifyBefore,
      });
    }
  }, [reminder]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "notifyBefore" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">
        {reminder ? "Edit Reminder" : "Create New Reminder"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter reminder title"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter description"
            />
          </div>

          {/* Due Date Input */}
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date & Time*
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Notification Time Selection */}
          <div>
            <label
              htmlFor="notifyBefore"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notify Before
            </label>
            <select
              id="notifyBefore"
              name="notifyBefore"
              value={formData.notifyBefore}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="5">5 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="120">2 hours before</option>
              <option value="1440">1 day before</option>
              <option value="2880">2 days before</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            {reminder ? "Update Reminder" : "Create Reminder"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReminderForm;
