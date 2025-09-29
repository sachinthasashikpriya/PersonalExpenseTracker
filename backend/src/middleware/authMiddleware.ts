import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/UserModel';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    
    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✓ Token extracted from Authorization header');
    }
    
    if (!token) {
      console.log('✗ No token found in request');
      return res.status(401).json({ 
        message: 'Not authorized, no token',
        code: 'NO_TOKEN'
      });
    }
    
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      console.log('✓ Token verified, user ID:', decoded.id);
      
      // Find user by ID and exclude password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('✗ User not found for ID:', decoded.id);
        return res.status(401).json({ 
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      // Attach user to request
      req.user = user as IUser;
      console.log('✓ User authenticated:', user.email);
      next();
      
    } catch (error: any) {
      console.error('✗ Token verification failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }
      
      return res.status(401).json({ 
        message: 'Not authorized',
        code: 'AUTH_ERROR'
      });
    }
  } catch (error) {
    console.error('✗ Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
};