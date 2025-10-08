import { Request, Response } from 'express';
import Income from '../models/Income';

export const getAllIncomes = async (req: Request, res: Response) => {
  try {
     // Ensure req.user exists
     if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const incomes = await Income.find().sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};



// In your incomeController.ts
export const getIncomesByDate = async (req:Request, res:Response) => {
  try {
      // Ensure req.user exists
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
    
    const incomes = await Income.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });
    
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const createIncome = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { category, description, amount, date } = req.body;

    // Validate required fields
    if (!category || !description || !amount) {
      return res.status(400).json({ message: 'Category, description, and amount are required' });
    }

    // Convert amount to number if it's a string
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Validate amount is a valid positive number
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    console.log('Received income data:', { category, description, amount, date });
console.log('Amount type:', typeof amount);

    const income = new Income({
      category,
      description,
      amount: parsedAmount, // Use parsed amount
      date: date ? new Date(date) : Date.now(),
      userId: req.user._id
    });

    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};
export const deleteIncome = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

  export const getIncomesByDateRange = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.params;
      // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

      // Create date range 
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      const incomes = await Income.find({
        date: {
          $gte: start,
          $lte: end
        }
      }).sort({ date: 1 });
      
      res.status(200).json(incomes);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  };

