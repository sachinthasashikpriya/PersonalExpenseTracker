import mongoose from 'mongoose';

const contributorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  contribution: {
    type: Number,
    required: true,
    min: 0
  }
});

const budgetItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  estimatedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  actualAmount: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'essentials',
      'housing',
      'transportation',
      'food',
      'utilities',
      'insurance',
      'healthcare',
      'entertainment',
      'education',
      'personal',
      'debt',
      'savings',
      'other'
    ]
  },
  contributors: [contributorSchema]
});

const budgetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['planning', 'ongoing', 'completed'],
    default: 'planning'
  },
  items: [budgetItemSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Middleware to calculate total budget automatically
budgetSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalBudget = this.items.reduce((sum, item) => sum + item.estimatedAmount, 0);
  }
  next();
});

export default mongoose.model('Budget', budgetSchema);