// backend/src/routes/authRoutes.ts
import express from 'express';
import { getProfile, login, register, updatePassword, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/signup', register);
router.post('/signin', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

// Add a test endpoint to verify API connectivity
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working' });
});

export default router;