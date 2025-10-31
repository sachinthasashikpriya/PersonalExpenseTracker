import { Request, Response } from 'express';
import Expense from '../models/Expense';

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch expenses for the logged-in user
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};



// In your expenseController.ts
export const getExpensesByDate = async (req:Request, res:Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const dateStr = req.params.date; // Format: YYYY-MM-DD
    
    // Create date range for the full day (midnight to midnight)
    const startDate = new Date(dateStr);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateStr);
    endDate.setHours(23, 59, 59, 999);
    
    console.log("Querying from", startDate, "to", endDate); // Debugging
    
    const expenses = await Expense.find({
      userId: req.user._id, // Filter by userId
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });
    
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { category, description, amount, date } = req.body;

     // Add debug logs
     console.log("User in request:", req.user);
     console.log("Creating expense for user:", req.user?._id);
     
     // Make sure req.user exists
     if (!req.user) {
       return res.status(401).json({ message: 'User not authenticated' });
     }

    const expense = new Expense({
      category,
      description,
      amount,
      date: date ? new Date(date) : Date.now(),
      userId: req.user._id // Use provided date or default to now
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const getExpensesByDateRange = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const { startDate, endDate } = req.params;
    
    // Create date range 
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const expenses = await Expense.find({
      userId: req.user._id, // Add userId filter
      date: {
        $gte: start,
        $lte: end
      }
    }).sort({ date: 1 });
    
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Get monthly expense summary
export const getMonthlyExpenseSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { year, month } = req.params;
    
    // Create date range for the specified month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    endDate.setHours(23, 59, 59, 999);
    
    // Get all expenses for the month
    const expenses = await Expense.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calculate total expense amount
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    res.status(200).json({
      year: parseInt(year),
      month: parseInt(month),
      totalExpenses,
      expenseCount: expenses.length,
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Get current month expense summary
export const getCurrentMonthExpenseSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    // Create date range for current month
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
    
    // Get all expenses for current month
    const expenses = await Expense.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calculate total expense amount
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      if (acc[expense.category]) {
        acc[expense.category] += expense.amount;
      } else {
        acc[expense.category] = expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate daily average
    const daysInMonth = new Date(year, month, 0).getDate();
    const currentDay = now.getDate();
    const dailyAverage = totalExpenses / currentDay;
    const projectedMonthlyExpense = dailyAverage * daysInMonth;
    
    // Get the highest expense
    const highestExpense = expenses.length > 0 
      ? Math.max(...expenses.map(expense => expense.amount))
      : 0;
    
    // Get the most recent expenses (last 5)
    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    res.status(200).json({
      year,
      month,
      monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
      totalExpenses,
      expenseCount: expenses.length,
      expensesByCategory,
      dailyAverage: Math.round(dailyAverage * 100) / 100,
      projectedMonthlyExpense: Math.round(projectedMonthlyExpense * 100) / 100,
      highestExpense,
      averageExpenseAmount: expenses.length > 0 ? Math.round((totalExpenses / expenses.length) * 100) / 100 : 0,
      recentExpenses,
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error in getCurrentMonthExpenseSummary:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

