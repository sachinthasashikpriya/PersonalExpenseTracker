import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Reminder from '../models/Reminder';

// Get all reminders for the current user
export const getAllReminders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const reminders = await Reminder.find({ userId })
      .sort({ dueDate: 1 }) // Sort by due date ascending
      .lean();

    return res.status(200).json(reminders);
  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific reminder by ID
export const getReminderById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const reminderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ message: 'Invalid reminder ID' });
    }

    const reminder = await Reminder.findOne({ _id: reminderId, userId }).lean();

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    return res.status(200).json(reminder);
  } catch (error: any) {
    console.error('Error fetching reminder:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new reminder
export const createReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { title, description, dueDate, priority, notifyBefore, completed } = req.body;

    // Validate required fields
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    const reminder = new Reminder({
      title,
      description: description || '',
      dueDate: new Date(dueDate),
      priority: priority || 'medium',
      notifyBefore: notifyBefore || 30, // Default: 30 minutes before
      completed: completed || false,
      userId
    });

    await reminder.save();
    return res.status(201).json(reminder);
  } catch (error: any) {
    console.error('Error creating reminder:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a reminder
export const updateReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const reminderId = req.params.id;
    const { title, description, dueDate, priority, notifyBefore, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ message: 'Invalid reminder ID' });
    }

    // Create update object with only provided fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (priority !== undefined) updateData.priority = priority;
    if (notifyBefore !== undefined) updateData.notifyBefore = notifyBefore;
    if (completed !== undefined) updateData.completed = completed;

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    return res.status(200).json(updatedReminder);
  } catch (error: any) {
    console.error('Error updating reminder:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a reminder
export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const reminderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ message: 'Invalid reminder ID' });
    }

    const result = await Reminder.findOneAndDelete({ _id: reminderId, userId });

    if (!result) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    return res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle reminder completion status
export const toggleReminderStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const reminderId = req.params.id;
    const { completed } = req.body;

    if (completed === undefined) {
      return res.status(400).json({ message: 'Completed status is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ message: 'Invalid reminder ID' });
    }

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { $set: { completed } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    return res.status(200).json(updatedReminder);
  } catch (error: any) {
    console.error('Error updating reminder status:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};