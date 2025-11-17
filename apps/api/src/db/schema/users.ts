import { pgTable, text, timestamp, varchar, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { elections } from './elections';

export const users = pgTable('users', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  photoUrl: varchar('photo_url', { length: 512 }),
  address: jsonb('address').$type<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  geoLocation: jsonb('geo_location').$type<{
    lat: number;
    lng: number;
  }>(),
  timezone: varchar('timezone', { length: 100 }).notNull().default('America/New_York'),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userReminders = pgTable('user_reminders', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  electionId: varchar('election_id', { length: 128 })
    .notNull()
    .references(() => elections.id, { onDelete: 'cascade' }),
  reminderType: varchar('reminder_type', {
    length: 50,
    enum: ['registration', 'early_voting', 'election_day'],
  }).notNull(),
  frequency: varchar('frequency', {
    length: 50,
    enum: ['once', 'daily', 'weekly'],
  })
    .notNull()
    .default('once'),
  daysBeforeEvent: jsonb('days_before_event').$type<number[]>().notNull().default([]),
  notificationMethods: jsonb('notification_methods')
    .$type<Array<'push' | 'email' | 'sms'>>()
    .notNull()
    .default(['push']),
  enabled: boolean('enabled').notNull().default(true),
  lastSent: timestamp('last_sent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const savedElections = pgTable('saved_elections', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  electionId: varchar('election_id', { length: 128 })
    .notNull()
    .references(() => elections.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
