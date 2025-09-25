// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/UserModel';
import { generateToken } from '../utils/jwtUtils';

// Register new user
export const register = async (req: Request, res: Response) => {
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
    }) as { _id: string, firstname: string, lastname: string, username: string, email: string };
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password') as { _id: string, firstname: string, lastname: string, username: string, email: string, matchPassword: (password: string) => Promise<boolean> };
    
    // Check if user exists and password matches
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};