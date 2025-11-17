import type { Address, GeoLocation } from './location';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  address: Address | null;
  geoLocation: GeoLocation | null;
  timezone: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  savedElections: string[]; // election IDs
  reminderCount: number;
}
