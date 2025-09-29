import express from 'express';
import {
    createExpense,
    deleteExpense,
    getAllExpenses,
    getExpensesByDate,
    getExpensesByDateRange
} from '../controllers/expenseController';
import { protect } from '../middleware/authMiddleware';
  

const router = express.Router();
router.use(protect); // Apply authentication middleware to all routes

router.get('/', getAllExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);
router.get('/date/:date', getExpensesByDate);
router.get('/range/:startDate/:endDate', getExpensesByDateRange);

export default router;