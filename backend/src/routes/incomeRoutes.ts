import express from 'express';
import {
    createIncome,
    deleteIncome,
    getAllIncomes,
    getIncomesByDate,
    getIncomesByDateRange
} from '../controllers/incomeController';
  

const router = express.Router();

router.get('/', getAllIncomes);
router.post('/', createIncome);
router.delete('/:id', deleteIncome);
router.get('/date/:date', getIncomesByDate);
router.get('/range/:startDate/:endDate', getIncomesByDateRange);

export default router;