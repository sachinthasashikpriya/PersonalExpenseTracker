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

