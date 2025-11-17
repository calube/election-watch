import { pgTable, text, timestamp, varchar, integer, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { races } from './elections';

export const candidates = pgTable('candidates', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  party: varchar('party', { length: 100 }),
  photoUrl: varchar('photo_url', { length: 512 }),
  websiteUrl: varchar('website_url', { length: 512 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),

  // Biographical
  biography: text('biography'),
  education: jsonb('education')
    .$type<
      Array<{
        institution: string;
        degree: string;
        field?: string;
        year?: number;
      }>
    >()
    .default([]),
  experience: jsonb('experience')
    .$type<
      Array<{
        title: string;
        organization: string;
        startDate?: string;
        endDate?: string;
        description?: string;
        current: boolean;
      }>
    >()
    .default([]),

  // Platform
  platformSummary: text('platform_summary'),
  issuePositions: jsonb('issue_positions')
    .$type<
      Array<{
        issue: string;
        category: string;
        position: string;
        sources: Array<{ name: string; url: string; publishedAt?: string }>;
        lastUpdated: string;
      }>
    >()
    .default([]),

  // Campaign Finance
  fundraisingTotal: integer('fundraising_total'),
  expendituresTotal: integer('expenditures_total'),
  topDonors: jsonb('top_donors')
    .$type<
      Array<{
        name: string;
        amount: number;
        type: 'individual' | 'organization' | 'pac';
      }>
    >()
    .default([]),

  // Endorsements
  endorsements: jsonb('endorsements')
    .$type<
      Array<{
        endorser: string;
        endorserType: 'individual' | 'organization' | 'media' | 'political_group';
        date: string;
        source: { name: string; url: string };
      }>
    >()
    .default([]),

  // Voting Record
  votingRecord: jsonb('voting_record')
    .$type<
      Array<{
        bill: string;
        billNumber: string;
        date: string;
        vote: 'yes' | 'no' | 'abstain' | 'present';
        description: string;
        category: string;
        source: { name: string; url: string };
      }>
    >()
    .default([]),

  // Social Media
  socialMedia: jsonb('social_media')
    .$type<{
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
      tiktok?: string;
    }>()
    .default({}),

  // Metadata
  dataSources: jsonb('data_sources')
    .$type<
      Array<{
        name: string;
        url: string;
        type: 'official' | 'news' | 'campaign' | 'nonprofit' | 'research';
        scrapedAt: string;
      }>
    >()
    .default([]),

  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const raceCandidates = pgTable('race_candidates', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  raceId: varchar('race_id', { length: 128 })
    .notNull()
    .references(() => races.id, { onDelete: 'cascade' }),
  candidateId: varchar('candidate_id', { length: 128 })
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  isIncumbent: varchar('is_incumbent', { length: 10 }).notNull().default('false'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
