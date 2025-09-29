import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Salary', 'Investments', 'Rental income', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Add this when you implement user authentication
  }
}, {
  timestamps: true
});

export default mongoose.model('Income', incomeSchema);