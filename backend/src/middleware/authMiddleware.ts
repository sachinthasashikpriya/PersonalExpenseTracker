// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add debugging
    console.log("Auth headers:", req.headers.authorization);
    
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log("Token extracted:", token.substring(0, 15) + '...');
    }
    
    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    try {
      // Verify token
      const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token decoded:", decoded);
      
      if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        console.log("Invalid token format", decoded);
        return res.status(401).json({ message: 'Invalid token format' });
      }
      
      // Find user by id
      const user = await User.findById(decoded.id);
      
      if (!user) {
        console.log("User not found for id:", decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Set user in request
      req.user = user;
      console.log("User found and set in request:", user._id);
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: 'Not authorized' });
  }
};