import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';
import reminderScheduler from './utils/reminderScheduler';

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start reminder notification services
  reminderScheduler.startNotificationChecker();
  reminderScheduler.startOverdueChecker();
  console.log('Reminder notification services started');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  reminderScheduler.stopAll();
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  reminderScheduler.stopAll();
  server.close(() => {
    console.log('Process terminated');
  });
});
