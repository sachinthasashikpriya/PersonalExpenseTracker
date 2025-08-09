import express from 'express';
import {
    createExpense,
    deleteExpense,
    getAllExpenses
} from '../controllers/expenseController';
  

const router = express.Router();

router.get('/', getAllExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);

export default router;