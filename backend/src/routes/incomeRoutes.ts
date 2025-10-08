import express from 'express';
import {
    createIncome,
    deleteIncome,
    getAllIncomes,
    getIncomesByDate,
    getIncomesByDateRange
} from '../controllers/incomeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
router.use(protect); // Apply authentication middleware to all routes
router.get('/', getAllIncomes);
router.post('/', createIncome);
router.delete('/:id', deleteIncome);
router.get('/date/:date', getIncomesByDate);
router.get('/range/:startDate/:endDate', getIncomesByDateRange);

export default router;