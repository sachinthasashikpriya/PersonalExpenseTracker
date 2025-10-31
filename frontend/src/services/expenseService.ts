import API from './api';

export interface Expense {
  _id?: string;
  category: string;
  description: string;
  amount: number;
  date?: string;
  createdAt?: string;
  userId: string;
}

export interface ExpenseSummary {
  year: number;
  month: number;
  monthName: string;
  totalExpenses: number;
  expenseCount: number;
  expensesByCategory: Record<string, number>;
  dailyAverage: number;
  projectedMonthlyExpense: number;
  highestExpense: number;
  averageExpenseAmount: number;
  recentExpenses: Expense[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
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
    console.log("Sending expense data:", expense);
    const response = await API.post('/expense', expense);
    return response.data;
  } catch (error: any) {
    console.error('Error creating expense:', error);
    // Log more detailed error info if available
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
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

 
  getExpensesByDate: async (date: Date): Promise<Expense[]> => {
    try {
      // Format date as YYYY-MM-DD for consistent date handling
   
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
 
      
      console.log("Fetching expenses for date:", formattedDate); // Debugging
      const response = await API.get(`/expense/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses by date:', error);
      throw error;
    }
  },
  // Add this function to your expenseService.ts
getExpensesByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
  try {
    const response = await API.get(`/expense/range/${startDate}/${endDate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses by date range:', error);
    throw error;
  }
},
getCurrentMonthSummary: async (): Promise<ExpenseSummary> => {
  try {
    const response = await API.get('/expense/monthly/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching current month expense summary:', error);
    throw error;
  }
},

};