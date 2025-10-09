import { Request, Response } from 'express';
import Budget from '../models/Budget';

// Get all budgets for the current user
export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const budgets = await Budget.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Get budget by ID
export const getBudgetById = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Create new budget
export const createBudget = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, startDate, endDate, status, items } = req.body;

    // Validate required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, start date and end date are required' });
    }

    // Calculate total budget from items
    const totalBudget = items?.reduce((sum: number, item: any) => sum + (parseFloat(item.estimatedAmount) || 0), 0) || 0;

    const budget = new Budget({
      title,
      description,
      startDate,
      endDate,
      totalBudget,
      status: status || 'planning',
      items: items || [],
      userId: req.user._id
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }
};

// Update budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, startDate, endDate, status, items } = req.body;

    // Validate required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, start date and end date are required' });
    }

    // Calculate total budget from items
    const totalBudget = items?.reduce((sum: number, item: any) => sum + (parseFloat(item.estimatedAmount) || 0), 0) || 0;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        title,
        description,
        startDate,
        endDate,
        totalBudget,
        status,
        items
      },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }
};

// Delete budget
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Update budget status
export const updateBudgetStatus = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { status } = req.body;

    // Validate status value
    if (!status || !['planning', 'ongoing', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required: planning, ongoing, or completed' });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Update budget item
export const updateBudgetItem = async (req: Request, res: Response) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { budgetId, itemId } = req.params;
    const itemData = req.body;

    const budget = await Budget.findOne({ _id: budgetId, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Find the item to update
    const itemIndex = budget.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Budget item not found' });
    }

    // Update the item
    Object.keys(itemData).forEach(key => {
      if (key !== '_id' && key !== 'id') {
        (budget.items[itemIndex] as any)[key] = itemData[key];
      }
    });

    // Recalculate total budget
    budget.totalBudget = budget.items.reduce((sum, item) => sum + item.estimatedAmount, 0);

    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};