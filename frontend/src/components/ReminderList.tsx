import React from "react";
import type { Reminder, ReminderListProps } from "../types/reminderTypes";

const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onEdit,
  onDelete,
  onComplete,
  loading,
}) => {
  // Calculate if a reminder is due soon (within next hour)
  const isDueSoon = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 1 && diffHours > 0;
  };

  // Calculate if a reminder is overdue
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  // Group reminders by completion status and due date
  const overdueReminders = reminders.filter(
    (r) => !r.completed && isOverdue(r.dueDate)
  );
  const upcomingReminders = reminders.filter(
    (r) => !r.completed && !isOverdue(r.dueDate)
  );
  const completedReminders = reminders.filter((r) => r.completed);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          No reminders yet
        </h3>
        <p className="mt-2 text-gray-600">
          Create your first reminder to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overdue Reminders */}
      {overdueReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-red-600 mb-2">Overdue</h3>
          <div className="space-y-3">
            {overdueReminders.map((reminder) => (
              <ReminderCard
                key={reminder._id}
                reminder={reminder}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
                status="overdue"
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Upcoming</h3>
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <ReminderCard
                key={reminder._id}
                reminder={reminder}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
                status={isDueSoon(reminder.dueDate) ? "due-soon" : "upcoming"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-green-600 mb-2">Completed</h3>
          <div className="space-y-3">
            {completedReminders.map((reminder) => (
              <ReminderCard
                key={reminder._id}
                reminder={reminder}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
                status="completed"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent for individual reminder cards
interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminderId: string) => void;
  onComplete: (reminder: Reminder) => void;
  status: "overdue" | "due-soon" | "upcoming" | "completed";
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onDelete,
  onComplete,
  status,
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const formatNotifyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes before`;
    if (minutes === 60) return `1 hour before`;
    if (minutes < 1440) return `${minutes / 60} hours before`;
    if (minutes === 1440) return `1 day before`;
    return `${minutes / 1440} days before`;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCardStyles = () => {
    switch (status) {
      case "overdue":
        return "border-red-300 bg-red-50";
      case "due-soon":
        return "border-yellow-300 bg-yellow-50";
      case "completed":
        return "border-green-300 bg-green-50 opacity-70";
      default:
        return "border-gray-200 bg-white";
    }
  };

  return (
    <div className={`rounded-lg border ${getCardStyles()} p-4 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={reminder.completed}
            onChange={() => onComplete(reminder)}
            className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-3"
          />
          <div>
            <h4
              className={`font-semibold ${
                reminder.completed
                  ? "line-through text-gray-500"
                  : "text-gray-800"
              }`}
            >
              {reminder.title}
            </h4>
            {reminder.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {reminder.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityBadge(
              reminder.priority
            )}`}
          >
            {reminder.priority}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatDate(reminder.dueDate)}</span>
          </div>
          <div className="flex items-center mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span>{formatNotifyTime(reminder.notifyBefore)}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(reminder)}
            className="p-1 text-blue-600 hover:text-blue-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => reminder._id && onDelete(reminder._id)}
            className="p-1 text-red-600 hover:text-red-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderList;
