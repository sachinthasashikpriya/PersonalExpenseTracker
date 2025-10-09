import type { Budget, BudgetItem, BudgetStatus } from "../types/budgettypes";
import API from "./api";

export const budgetService = {
  getAllBudgets: async (): Promise<Budget[]> => {
    try {
      const response = await API.get('/budget');
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  },

  getBudgetById: async (id: string): Promise<Budget> => {
    try {
      const response = await API.get(`/budget/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error);
      throw error;
    }
  },

  createBudget: async (budget: Budget): Promise<Budget> => {
    try {
      const response = await API.post('/budget', budget);
      return response.data;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  },

  updateBudget: async (id: string, budget: Budget): Promise<Budget> => {
    try {
      const response = await API.put(`/budget/${id}`, budget);
      return response.data;
    } catch (error) {
      console.error(`Error updating budget ${id}:`, error);
      throw error;
    }
  },

  deleteBudget: async (id: string): Promise<void> => {
    try {
      await API.delete(`/budget/${id}`);
    } catch (error) {
      console.error(`Error deleting budget ${id}:`, error);
      throw error;
    }
  },

  updateBudgetStatus: async (id: string, status: BudgetStatus): Promise<Budget> => {
    try {
      const response = await API.patch(`/budget/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating budget status ${id}:`, error);
      throw error;
    }
  },

  updateBudgetItem: async (
    budgetId: string, 
    itemId: string, 
    itemData: Partial<BudgetItem>
  ): Promise<Budget> => {
    try {
      const response = await API.patch(`/budget/${budgetId}/item/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Error updating budget item:`, error);
      throw error;
    }
  },
};

export default budgetService;