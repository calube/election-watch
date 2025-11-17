export type ReminderType = 'registration' | 'early_voting' | 'election_day';
export type ReminderFrequency = 'once' | 'daily' | 'weekly';
export type NotificationMethod = 'push' | 'email' | 'sms';

export interface UserReminder {
  id: string;
  userId: string;
  electionId: string;
  reminderType: ReminderType;
  frequency: ReminderFrequency;
  daysBeforeEvent: number[];
  notificationMethods: NotificationMethod[];
  enabled: boolean;
  lastSent: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderPreferences {
  userId: string;
  elections: ElectionReminderSettings[];
  timezone: string;
  quietHours: QuietHours;
}

export interface ElectionReminderSettings {
  electionId: string;
  enableReminders: boolean;
  reminderSchedule: {
    registrationDeadline?: {
      enabled: boolean;
      daysBeforeDeadline: number[];
    };
    earlyVoting?: {
      enabled: boolean;
      frequency: ReminderFrequency;
      startOffset: number;
    };
    electionDay: {
      enabled: boolean;
      daysBeforeElection: number[];
      morningOfElection: boolean;
    };
  };
  notificationChannels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface QuietHours {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface ElectionNotification {
  type: ReminderType;
  election: {
    name: string;
    date: Date;
    type: string;
  };
  action: {
    title: string;
    body: string;
    cta: string;
    deepLink: string;
  };
  locationInfo?: {
    pollingPlace?: {
      name: string;
      address: string;
    };
    registrationUrl?: string;
  };
  urgency: 'high' | 'medium' | 'low';
}
