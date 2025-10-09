import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MONGODB_URI from the .env file or fall back to a default local MongoDB URI
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
