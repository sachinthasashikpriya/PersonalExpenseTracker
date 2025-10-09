import express from 'express';
import {
    createBudget,
    deleteBudget,
    getAllBudgets,
    getBudgetById,
    updateBudget,
    updateBudgetItem,
    updateBudgetStatus
} from '../controllers/budgetController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all budget routes
router.use(protect);

// Budget routes
router.get('/', getAllBudgets);
router.get('/:id', getBudgetById);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);
router.patch('/:id/status', updateBudgetStatus);
router.patch('/:budgetId/item/:itemId', updateBudgetItem);

export default router;