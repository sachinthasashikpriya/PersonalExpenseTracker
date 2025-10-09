export interface Reminder {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  notifyBefore: number; // minutes before the due date
  completed: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReminderFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  notifyBefore: number; // minutes before the due date
}

export interface ReminderListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminderId: string) => void;
  onComplete: (reminder: Reminder) => void;
  loading: boolean;
}

export interface ReminderFormProps {
  reminder?: Reminder | null;
  onSubmit: (reminderData: ReminderFormData) => void;
  onCancel: () => void;
}