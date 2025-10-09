import Reminder from '../models/Reminder';

/**
 * Service to handle reminder notifications
 */
class NotificationService {
  /**
   * Check for upcoming reminders that need notifications
   * This should be called by a scheduled job (e.g., cron)
   */
  async checkReminders() {
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now);
      fiveMinutesAgo.setMinutes(now.getMinutes() - 5);
      
      // Find reminders where notification time is within the last 5 minutes
      const upcomingReminders = await Reminder.find({
        completed: false,
        dueDate: {
          $gt: now, // Due date is in the future
        },
      }).populate('userId', 'email name');
      
      // Filter reminders that should trigger notifications
      const remindersToNotify = upcomingReminders.filter(reminder => {
        const notificationTime = new Date(reminder.dueDate);
        notificationTime.setMinutes(notificationTime.getMinutes() - reminder.notifyBefore);
        
        return notificationTime <= now && notificationTime >= fiveMinutesAgo;
      });
      
      // Send notifications for each reminder
      for (const reminder of remindersToNotify) {
        await this.sendNotification(reminder);
      }
      
      return remindersToNotify.length;
    } catch (error) {
      console.error('Error checking reminders:', error);
      throw error;
    }
  }
  
  /**
   * Send notification for a specific reminder
   * This is a placeholder - in a real app, this would send an email, push notification, etc.
   */
  async sendNotification(reminder: any) {
    try {
      const user = reminder.userId;
      if (!user) {
        console.error('No user associated with reminder:', reminder._id);
        return;
      }
      
      // Format due date
      const dueDate = new Date(reminder.dueDate).toLocaleString();
      
      // Log notification (in a real app, this would be an actual notification)
      console.log(`NOTIFICATION for ${user.name} (${user.email}): Reminder "${reminder.title}" is due at ${dueDate}`);
      
      // In a real app, you would send an email or push notification here
      // For example:
      // await emailService.send({
      //   to: user.email,
      //   subject: `Reminder: ${reminder.title}`,
      //   text: `Your reminder "${reminder.title}" is due at ${dueDate}.\n\n${reminder.description}`
      // });
      
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
  
  /**
   * Send overdue notifications for reminders that are past due and not completed
   */
  async sendOverdueNotifications() {
    try {
      const now = new Date();
      
      // Find overdue reminders
      const overdueReminders = await Reminder.find({
        completed: false,
        dueDate: {
          $lt: now, // Due date is in the past
        },
      }).populate('userId', 'email name');
      
      // Send overdue notifications
      for (const reminder of overdueReminders) {
        await this.sendOverdueNotification(reminder);
      }
      
      return overdueReminders.length;
    } catch (error) {
      console.error('Error sending overdue notifications:', error);
      throw error;
    }
  }
  
  /**
   * Send overdue notification for a specific reminder
   */
  async sendOverdueNotification(reminder: any) {
    try {
      const user = reminder.userId;
      if (!user) {
        console.error('No user associated with reminder:', reminder._id);
        return;
      }
      
      // Format due date
      const dueDate = new Date(reminder.dueDate).toLocaleString();
      
      // Log notification (in a real app, this would be an actual notification)
      console.log(`OVERDUE NOTIFICATION for ${user.name} (${user.email}): Reminder "${reminder.title}" was due at ${dueDate}`);
      
      // In a real app, you would send an email or push notification here
      
      return true;
    } catch (error) {
      console.error('Error sending overdue notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();