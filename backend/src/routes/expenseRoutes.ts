import express from 'express';
import {
    createExpense,
    deleteExpense,
    getAllExpenses,
    getExpensesByDate,
    getExpensesByDateRange
} from '../controllers/expenseController';
  

const router = express.Router();

router.get('/', getAllExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);
router.get('/date/:date', getExpensesByDate);
router.get('/range/:startDate/:endDate', getExpensesByDateRange);

export default router;