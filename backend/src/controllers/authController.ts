import { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
import { generateToken } from '../utils/jwtUtils';

// Register new user
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    
    // Validate required fields
    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }
    
    // Create new user
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password
    }) as IUser;
    
    // Generate token - Convert ObjectId to string
    const token = generateToken(user._id.toString());
    
    console.log('✓ User registered:', email);
    
    return res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('✗ Registration error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Registration failed' 
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    
    console.log('→ Login attempt for:', email);
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find user with password field included
    const user = await User.findOne({ email }).select('+password') as IUser | null;
    
    if (!user) {
      console.log('✗ User not found:', email);
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    console.log('✓ User found:', email);
    
    // Verify password
    try {
      const isPasswordMatch = await user.matchPassword(password);
      
      if (!isPasswordMatch) {
        console.log('✗ Invalid password for:', email);
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        });
      }
      
      console.log('✓ Password verified for:', email);
      
      // Generate token - Convert ObjectId to string
      const token = generateToken(user._id.toString());
      
      console.log('✓ Login successful for:', email);
      console.log('✓ Token length:', token.length);
      
      // Return user data with token
      return res.status(200).json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        token
      });
    } catch (passwordError) {
      console.error('✗ Password comparison error:', passwordError);
      return res.status(500).json({ 
        message: 'Error verifying credentials' 
      });
    }
  } catch (error) {
    console.error('✗ Login error:', error);
    return res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
};

// Get current user profile (protected route example)
export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Not authorized' 
      });
    }
    
    return res.status(200).json({
      _id: req.user._id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      username: req.user.username,
      email: req.user.email,
    });
  } catch (error) {
    console.error('✗ Get profile error:', error);
    return res.status(500).json({ 
      message: 'Server error' 
    });
  }
};