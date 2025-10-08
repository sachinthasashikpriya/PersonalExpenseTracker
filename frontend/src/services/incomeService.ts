import API from './api';

export interface Income {
  _id?: string;
  category: string;
  description: string;
  amount: number;
  date?: string;
  createdAt?: string;
}

export const incomeService = {
  // Get all incomes
  getAllIncomes: async (): Promise<Income[]> => {
    try {
      const response = await API.get('/income');
      return response.data;
    } catch (error) {
      console.error('Error fetching incomes:', error);
      throw error;
    }
  },

  // Create new income
  createIncome: async (income: Omit<Income, '_id' | 'createdAt'>): Promise<Income> => {
    try {
      console.log('Creating income with data:', income); // Debugging
      const response = await API.post('/income', income);
      return response.data;
    } catch (error) {
      console.error('Error creating income:', error);
      throw error;
    }
  },

  // Delete expense
  deleteIncome: async (id: string): Promise<void> => {
    try {
      await API.delete(`/income/${id}`);
    } catch (error) {
      console.error('Error deleting income:', error);
      throw error;
    }
  },

 
  getIncomesByDate: async (date: Date): Promise<Income[]> => {
    try {
      // Format date as YYYY-MM-DD for consistent date handling
   
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
 
      
      console.log("Fetching incomes for date:", formattedDate); // Debugging
      const response = await API.get(`/income/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incomes by date:', error);
      throw error;
    }
  },
  // Add this function to your expenseService.ts
getIncomesByDateRange: async (startDate: string, endDate: string): Promise<Income[]> => {
  try {
    const response = await API.get(`/income/range/${startDate}/${endDate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching incomes by date range:', error);
    throw error;
  }
},
};