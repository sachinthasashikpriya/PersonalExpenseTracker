import { Request, Response } from 'express';
import Income from '../models/Income';

export const getAllIncomes = async (req: Request, res: Response) => {
  try {
     // Ensure req.user exists
     if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch incomes for the logged-in user only
    const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
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
      userId: req.user._id, // Add userId filter
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
    console.log('Full request body:', req.body);
    console.log('User:', req.user);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { category, description, amount, date } = req.body;

    // Validate required fields
    if (!category || !description || amount === undefined) {
      console.log('Validation failed:', { category, description, amount });
      return res.status(400).json({ message: 'Category, description, and amount are required' });
    }

    // Validate amount is a number
    if (typeof amount !== 'number' || amount <= 0) {
      console.log('Amount validation failed:', amount, typeof amount);
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Create and save the income
    const income = new Income({
      userId: req.user._id,
      category,
      description,
      amount,
      date: date ? new Date(date) : Date.now()
    });

    const savedIncome = await income.save();
    console.log('Income saved successfully:', savedIncome);
    res.status(201).json(savedIncome);
  } catch (error) {
    console.error('Full error:', error);
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
      userId: req.user._id, // Add userId filter
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

// Get monthly income summary
export const getMonthlyIncomeSummary = async (req: Request, res: Response) => {
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
    
    // Get all incomes for the month
    const incomes = await Income.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calculate total income amount
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    res.status(200).json({
      year: parseInt(year),
      month: parseInt(month),
      totalIncome,
      incomeCount: incomes.length,
      incomes
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Get current month income summary
export const getCurrentMonthIncomeSummary = async (req: Request, res: Response) => {
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
    
    // Get all incomes for current month
    const incomes = await Income.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calculate total income amount
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

     // Calculate incomes by category
     const incomesByCategory = incomes.reduce((acc, income) => {
      if (acc[income.category]) {
        acc[income.category] += income.amount;
      } else {
        acc[income.category] = income.amount;
      }
      return acc;
    }, {} as Record<string, number>);

     // Calculate daily average
     const daysInMonth = new Date(year, month, 0).getDate();
     const currentDay = now.getDate();
     const dailyAverage = totalIncome / currentDay;
     const projectedMonthlyIncome = dailyAverage * daysInMonth;
     
     // Get the highest income
     const highestIncome = incomes.length > 0 
       ? Math.max(...incomes.map(income => income.amount))
       : 0;
     
     // Get the most recent incomes (last 5)
     const recentIncomes = incomes
       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
       .slice(0, 5);
    
    
       res.status(200).json({
        year,
        month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
        totalIncome,
        incomeCount: incomes.length,
        incomesByCategory,
        dailyAverage: Math.round(dailyAverage * 100) / 100,
        projectedMonthlyIncome: Math.round(projectedMonthlyIncome * 100) / 100,
        highestIncome,
        averageIncomeAmount: incomes.length > 0 ? Math.round((totalIncome / incomes.length) * 100) / 100 : 0,
        recentIncomes,
        dateRange: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });
    } catch (error) {
      console.error('Error in getCurrentMonthIncomeSummary:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

