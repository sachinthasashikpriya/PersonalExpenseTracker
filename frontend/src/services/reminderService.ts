import type { Reminder, ReminderFormData } from '../types/reminderTypes';
import API from './api';

export const reminderService = {
  getAllReminders: async (): Promise<Reminder[]> => {
    try {
      const response = await API.get('/reminder');
      return response.data;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  },

  getReminderById: async (id: string): Promise<Reminder> => {
    try {
      const response = await API.get(`/reminder/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reminder ${id}:`, error);
      throw error;
    }
  },

  createReminder: async (reminder: ReminderFormData): Promise<Reminder> => {
    try {
      const response = await API.post('/reminder', reminder);
      return response.data;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  },

  updateReminder: async (id: string, reminder: Partial<Reminder>): Promise<Reminder> => {
    try {
      const response = await API.put(`/reminder/${id}`, reminder);
      return response.data;
    } catch (error) {
      console.error(`Error updating reminder ${id}:`, error);
      throw error;
    }
  },

  deleteReminder: async (id: string): Promise<void> => {
    try {
      await API.delete(`/reminder/${id}`);
    } catch (error) {
      console.error(`Error deleting reminder ${id}:`, error);
      throw error;
    }
  },

  completeReminder: async (id: string, completed: boolean): Promise<Reminder> => {
    try {
      const response = await API.patch(`/reminder/${id}/complete`, { completed });
      return response.data;
    } catch (error) {
      console.error(`Error updating reminder status ${id}:`, error);
      throw error;
    }
  }
};

export default reminderService;