import express from 'express';
import {
    createReminder,
    deleteReminder,
    getAllReminders,
    getReminderById,
    toggleReminderStatus,
    updateReminder
} from '../controllers/reminderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /reminder - Get all reminders for current user
router.get('/', getAllReminders);

// GET /reminder/:id - Get a specific reminder by ID
router.get('/:id', getReminderById);

// POST /reminder - Create a new reminder
router.post('/', createReminder);

// PUT /reminder/:id - Update a reminder
router.put('/:id', updateReminder);

// DELETE /reminder/:id - Delete a reminder
router.delete('/:id', deleteReminder);

// PATCH /reminder/:id/complete - Toggle reminder completion status
router.patch('/:id/complete', toggleReminderStatus);

export default router;