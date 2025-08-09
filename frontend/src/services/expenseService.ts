import API from './api';

export interface Expense {
  _id?: string;
  category: string;
  description: string;
  amount: number;
  date?: string;
  createdAt?: string;
}

export const expenseService = {
  // Get all expenses
  getAllExpenses: async (): Promise<Expense[]> => {
    try {
      const response = await API.get('/expense');
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Create new expense
  createExpense: async (expense: Omit<Expense, '_id' | 'createdAt'>): Promise<Expense> => {
    try {
      const response = await API.post('/expense', expense);
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    try {
      await API.delete(`/expense/${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
};