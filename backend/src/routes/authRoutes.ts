// backend/src/routes/authRoutes.ts
import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);

export default router;