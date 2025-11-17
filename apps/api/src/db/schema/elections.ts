import { pgTable, text, timestamp, varchar, integer, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const elections = pgTable('elections', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  type: varchar('type', { length: 50, enum: ['local', 'state', 'national'] }).notNull(),
  subtype: varchar('subtype', {
    length: 50,
    enum: ['primary', 'general', 'special', 'runoff'],
  }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  date: timestamp('date').notNull(),
  registrationDeadline: timestamp('registration_deadline'),
  earlyVotingStart: timestamp('early_voting_start'),
  earlyVotingEnd: timestamp('early_voting_end'),
  jurisdiction: varchar('jurisdiction', { length: 255 }).notNull(),
  jurisdictionId: varchar('jurisdiction_id', { length: 128 }).notNull(),
  geoBounds: jsonb('geo_bounds'), // GeoJSON polygon
  status: varchar('status', {
    length: 50,
    enum: ['upcoming', 'active', 'completed'],
  })
    .notNull()
    .default('upcoming'),
  dataSources: jsonb('data_sources').$type<string[]>().notNull().default([]),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const races = pgTable('races', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  electionId: varchar('election_id', { length: 128 })
    .notNull()
    .references(() => elections.id, { onDelete: 'cascade' }),
  officeName: varchar('office_name', { length: 255 }).notNull(),
  officeLevel: varchar('office_level', {
    length: 50,
    enum: ['local', 'state', 'national'],
  }).notNull(),
  officeType: varchar('office_type', {
    length: 50,
    enum: ['executive', 'legislative', 'judicial', 'other'],
  }).notNull(),
  districtNumber: varchar('district_number', { length: 50 }),
  totalSeats: integer('total_seats').notNull().default(1),
  termLength: varchar('term_length', { length: 100 }),
  salary: integer('salary'),
  responsibilities: text('responsibilities'),
  geoBounds: jsonb('geo_bounds'), // GeoJSON polygon
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const pollingLocations = pgTable('polling_locations', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  electionId: varchar('election_id', { length: 128 })
    .notNull()
    .references(() => elections.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  address: jsonb('address')
    .$type<{
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    }>()
    .notNull(),
  geoLocation: jsonb('geo_location')
    .$type<{
      lat: number;
      lng: number;
    }>()
    .notNull(),
  locationType: varchar('location_type', {
    length: 50,
    enum: ['polling_place', 'early_voting', 'dropbox'],
  }).notNull(),
  hoursOpen: jsonb('hours_open')
    .$type<
      Array<{
        dayOfWeek?: string;
        date?: string;
        open: string;
        close: string;
      }>
    >()
    .notNull()
    .default([]),
  accessibilityInfo: text('accessibility_info'),
  parkingInfo: text('parking_info'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
