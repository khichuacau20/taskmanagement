export interface Notification {
  userId: number;
  type: 'reminder' | 'due_date' | 'assignment';
  message: string;
  taskId?: number;
  sendAt?: Date;
}

export class NotificationService {
  static async send(notification: Notification): Promise<void> {
    console.log(`Notify user ${notification.userId}: [${notification.type}] ${notification.message}`);
  }

  static async sendTaskReminder(userId: number, taskId: number, taskTitle: string, dueDate: string) {
    await NotificationService.send({
      userId,
      type: 'reminder',
      message: `Reminder: Task "${taskTitle}" is due on ${dueDate}.`,
      taskId,
      sendAt: new Date(dueDate)
    });
  }

  static async sendDueDateAlert(userId: number, taskId: number, taskTitle: string, dueDate: string) {
    await NotificationService.send({
      userId,
      type: 'due_date',
      message: `Alert: Task "${taskTitle}" is due today (${dueDate}).`,
      taskId,
      sendAt: new Date(dueDate)
    });
  }

  static async sendTaskAssignment(userId: number, taskId: number, taskTitle: string, assignedBy: string) {
    await NotificationService.send({
      userId,
      type: 'assignment',
      message: `You have been assigned to task "${taskTitle}" by ${assignedBy}.`,
      taskId
    });
  }
}
