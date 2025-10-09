// backend/src/routes/authRoutes.ts
import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);

// Add a test endpoint to verify API connectivity
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working' });
});

export default router;