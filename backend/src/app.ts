import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes';
import budgetRoutes from './routes/budgetRoutes';
import expenseRoutes from './routes/expenseRoutes';
import incomeRoutes from './routes/incomeRoutes';
//import { errorHandler } from './middleware/error.middleware';
//import authRoutes from './routes/auth.routes';
//import transactionRoutes from './routes/transaction.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expense', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/budget', budgetRoutes);
//app.use('/api/auth', authRoutes);
//app.use('/api/transactions', transactionRoutes);

//app.use(errorHandler);
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API' });
  });
  

export default app;
