import express from 'express';
import {
    createExpense,
    deleteExpense,
    getAllExpenses,
    getExpensesByDate
} from '../controllers/expenseController';
  

const router = express.Router();

router.get('/', getAllExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);
router.get('/date/:date', getExpensesByDate);

export default router;