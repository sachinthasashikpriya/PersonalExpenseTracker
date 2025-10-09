import notificationService from '../utils/notificationService';

/**
 * Scheduler class to handle periodic tasks
 */
class ReminderScheduler {
  private notificationInterval: NodeJS.Timeout | null = null;
  private overdueInterval: NodeJS.Timeout | null = null;
  
  /**
   * Start the reminder notification checker
   * Runs every minute to check for reminders that need notifications
   */
  startNotificationChecker() {
    // Clear any existing interval
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    
    // Check immediately on startup
    this.checkReminders();
    
    // Set interval to check every minute
    this.notificationInterval = setInterval(() => {
      this.checkReminders();
    }, 60000); // 1 minute
    
    console.log('Reminder notification checker started');
  }
  
  /**
   * Start the overdue reminder checker
   * Runs every hour to check for overdue reminders
   */
  startOverdueChecker() {
    // Clear any existing interval
    if (this.overdueInterval) {
      clearInterval(this.overdueInterval);
    }
    
    // Set interval to check every hour
    this.overdueInterval = setInterval(() => {
      this.checkOverdueReminders();
    }, 3600000); // 1 hour
    
    console.log('Overdue reminder checker started');
  }
  
  /**
   * Stop all schedulers
   */
  stopAll() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }
    
    if (this.overdueInterval) {
      clearInterval(this.overdueInterval);
      this.overdueInterval = null;
    }
    
    console.log('All reminder checkers stopped');
  }
  
  /**
   * Check for reminders that need notifications
   */
  private async checkReminders() {
    try {
      const count = await notificationService.checkReminders();
      if (count > 0) {
        console.log(`Sent ${count} reminder notifications`);
      }
    } catch (error) {
      console.error('Error in reminder notification checker:', error);
    }
  }
  
  /**
   * Check for overdue reminders
   */
  private async checkOverdueReminders() {
    try {
      const count = await notificationService.sendOverdueNotifications();
      if (count > 0) {
        console.log(`Sent ${count} overdue reminder notifications`);
      }
    } catch (error) {
      console.error('Error in overdue reminder checker:', error);
    }
  }
}

export default new ReminderScheduler();