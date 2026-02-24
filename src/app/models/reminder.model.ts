export interface Reminder {
 
    id?: number;
    title: string;
    dueDateTime: Date; 
    notifyBeforeMinutes: number;
    attachmentPath?: string;
    recurring?: boolean;
    recurringType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | null;
     notified?: boolean; 
  }
  