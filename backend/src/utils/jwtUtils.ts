import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Ensure environment variables are loaded
dotenv.config();

// Generate a secure random string if JWT_SECRET is missing
const generateSecureSecret = (): string => {
  const crypto = require('crypto');
  return crypto.randomBytes(64).toString('hex');
};

// Use environment variable or generate a secure random secret (not hardcoded)
const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || generateSecureSecret();
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '24h';

// Verify JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not found in environment variables, using generated secure key');
  console.warn('⚠️  This secure key will change on server restart. Set JWT_SECRET in your .env file!');
} else {
  console.log('✓ JWT_SECRET loaded from environment');
}

export interface JwtPayload {
  id: string;
}

export const generateToken = (id: string): string => {
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  console.log('✓ Token generated for user ID:', id);
  return token;
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('✗ Token verification error:', error);
    return null;
  }
};