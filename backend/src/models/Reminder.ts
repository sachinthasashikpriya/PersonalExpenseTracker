import mongoose from "mongoose";

export interface IReminder {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  notifyBefore: number; // minutes before the due date
  completed: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const reminderSchema = new mongoose.Schema<IReminder>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notifyBefore: {
      type: Number,
      default: 30, // 30 minutes before by default
      min: [0, "Notification time cannot be negative"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

// Create indexes for faster queries
reminderSchema.index({ userId: 1, dueDate: 1 });
reminderSchema.index({ completed: 1 });

// Virtual for calculating notification time
reminderSchema.virtual("notificationTime").get(function() {
  const notificationTime = new Date(this.dueDate);
  notificationTime.setMinutes(notificationTime.getMinutes() - this.notifyBefore);
  return notificationTime;
});

// Method to check if notification should be sent
reminderSchema.methods.shouldNotify = function() {
  if (this.completed) return false;
  
  const now = new Date();
  const notificationTime = this.notificationTime;
  const fiveMinutesAgo = new Date(now);
  fiveMinutesAgo.setMinutes(now.getMinutes() - 5);
  
  // Check if notification time is within the last 5 minutes (to prevent duplicate notifications)
  return notificationTime <= now && notificationTime >= fiveMinutesAgo;
};

const Reminder = mongoose.model<IReminder>("Reminder", reminderSchema);

export default Reminder;