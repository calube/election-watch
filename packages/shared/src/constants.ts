export const ELECTION_TYPES = {
  LOCAL: 'local',
  STATE: 'state',
  NATIONAL: 'national',
} as const;

export const ELECTION_SUBTYPES = {
  PRIMARY: 'primary',
  GENERAL: 'general',
  SPECIAL: 'special',
  RUNOFF: 'runoff',
} as const;

export const OFFICE_LEVELS = {
  LOCAL: 'local',
  STATE: 'state',
  NATIONAL: 'national',
} as const;

export const OFFICE_TYPES = {
  EXECUTIVE: 'executive',
  LEGISLATIVE: 'legislative',
  JUDICIAL: 'judicial',
  OTHER: 'other',
} as const;

export const NOTIFICATION_METHODS = {
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms',
} as const;

export const REMINDER_TYPES = {
  REGISTRATION: 'registration',
  EARLY_VOTING: 'early_voting',
  ELECTION_DAY: 'election_day',
} as const;

// Default reminder schedules
export const DEFAULT_REMINDER_DAYS = {
  REGISTRATION: [30, 14, 7, 1], // days before registration deadline
  ELECTION_DAY: [7, 3, 1], // days before election
  EARLY_VOTING_OFFSET: 3, // start reminders 3 days before early voting
};

// API Rate limits
export const RATE_LIMITS = {
  GOOGLE_CIVIC_API_DAILY: 25000,
  APIFY_REQUESTS_PER_MONTH: 10000,
};

// Data refresh intervals (in hours)
export const REFRESH_INTERVALS = {
  ELECTIONS: 24, // Daily
  CANDIDATES: 168, // Weekly
  POLLING_LOCATIONS: 24, // Daily during election season
  CAMPAIGN_FINANCE: 24, // Daily
};
