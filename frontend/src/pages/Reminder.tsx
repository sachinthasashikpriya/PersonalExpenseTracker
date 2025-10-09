import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Mainnavbar from "../components/Mainnavbar";
import ReminderForm from "../components/ReminderForm";
import ReminderList from "../components/ReminderList";
import { reminderService } from "../services/reminderService";
import type { Reminder, ReminderFormData } from "../types/reminderTypes";

const ReminderPage = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [activeTab, setActiveTab] = useState("Reminders");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderService.getAllReminders();
      setReminders(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load reminders. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (reminderData: ReminderFormData) => {
    try {
      if (editingReminder && editingReminder._id) {
        await reminderService.updateReminder(editingReminder._id, reminderData);
        Swal.fire({
          title: "Updated!",
          text: "Reminder has been updated.",
          icon: "success",
          timer: 1500,
        });
      } else {
        await reminderService.createReminder(reminderData);
        Swal.fire({
          title: "Success!",
          text: "Reminder has been created.",
          icon: "success",
          timer: 1500,
        });
      }

      fetchReminders();
      setShowForm(false);
      setEditingReminder(null);
    } catch (error) {
      console.error("Error saving reminder:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to save reminder. Please try again.",
        icon: "error",
      });
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleDelete = async (reminderId: string) => {
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
        await reminderService.deleteReminder(reminderId);
        fetchReminders();
        Swal.fire("Deleted!", "Your reminder has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete reminder. Please try again.",
        icon: "error",
      });
    }
  };

  const handleComplete = async (reminder: Reminder) => {
    if (!reminder._id) return;

    try {
      await reminderService.completeReminder(reminder._id, !reminder.completed);
      fetchReminders();
    } catch (error) {
      console.error("Error updating reminder status:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update reminder status. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <Mainnavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reminders</h1>
          {!showForm && (
            <button
              onClick={() => {
                setEditingReminder(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Reminder
              </span>
            </button>
          )}
        </div>

        {showForm ? (
          <div className="mb-6">
            <ReminderForm
              reminder={editingReminder}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingReminder(null);
              }}
            />
          </div>
        ) : (
          <ReminderList
            reminders={reminders}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ReminderPage;
