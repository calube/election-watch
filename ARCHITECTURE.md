# Election Watch - Technical Architecture

## Project Overview

Election Watch is a non-partisan application that provides comprehensive election information across all levels of government (local, state, national), with intelligent reminders and objective candidate information.

## Core Requirements

### Election Coverage
- **Local Elections**: Alderman, judges, tax collectors, school boards, city councils
- **State Elections**: Governor, state senate, state representatives, state propositions
- **National Elections**: President, U.S. Senate, U.S. House of Representatives

### Key Features
1. **Comprehensive Election Data**: When, where, who's running, how to get there
2. **Objective Candidate Information**: Non-partisan pros/cons aggregation
3. **Smart Reminders**: User-configurable notifications for selected elections
4. **Location-Based Information**: Polling places, early voting locations, voter registration

## Data Sources & APIs

### Primary APIs

#### 1. Google Civic Information API
- **Purpose**: Primary source for polling locations, election dates, and official data
- **Coverage**: All U.S. elections (federal, state, local)
- **Data Includes**:
  - Polling places and early vote locations
  - Election dates and deadlines
  - Candidate information
  - Ballot measures
  - Election official contact information
- **Rate Limits**: Free tier available with API key
- **Data Quality**: Official data from Voting Information Project (VIP) and CTCL
- **Documentation**: https://developers.google.com/civic-information

#### 2. Democracy Works Elections API
- **Purpose**: Comprehensive election calendar and deadlines
- **Coverage**: Thousands of elections yearly at every level
- **Data Includes**:
  - Election dates across all jurisdictions
  - Registration deadlines
  - Voting requirements
  - Election notices
- **Documentation**: https://data.democracy.works/

#### 3. ProPublica Campaign Finance API
- **Purpose**: Campaign contributions and spending data
- **Coverage**: Federal elections
- **Data Includes**:
  - Candidate fundraising
  - Committee expenditures
  - Donor information (for transparency)
- **Update Frequency**: Daily updates, electronic filings every 15 minutes
- **Documentation**: Available through ProPublica

#### 4. FEC (Federal Election Commission) API
- **Purpose**: Official federal campaign finance data
- **Coverage**: Federal candidates and committees
- **Update Frequency**: Nightly updates
- **Documentation**: https://api.open.fec.gov/

### Secondary Data Sources

#### 5. Ballotpedia
- **Purpose**: Comprehensive encyclopedia of candidates and ballot measures
- **Access Method**: Web scraping (no public API for all data)
- **Data Includes**:
  - Candidate biographies
  - Voting records
  - Endorsements
  - Ballot measure details
- **Note**: Ballotpedia API may be available for commercial licensing

#### 6. Vote411 (League of Women Voters)
- **Purpose**: Non-partisan candidate questionnaires
- **Access Method**: Web scraping via e.thePeople platform
- **Data Includes**:
  - Candidate responses to standardized questions
  - Issue positions
  - Bilingual content (English/Spanish)

#### 7. MIT Election Lab
- **Purpose**: Historical election data and research
- **Access Method**: Public datasets via GitHub
- **Data Includes**:
  - Historical election results
  - Voting behavior research
  - Electoral analytics

#### 8. State/Local Election Websites
- **Purpose**: Jurisdiction-specific data
- **Access Method**: Targeted web scraping via Apify
- **Data Includes**:
  - Local candidate information
  - Sample ballots
  - Precinct-specific information
  - Local measures and propositions

## Web Scraping Strategy

### Apify Integration
We have Apify MCP server configured, which provides access to:

#### Available Apify Actors
- **Website Content Crawler**: Extract structured data from election websites
- **Google Search Scraper**: Find candidate websites and news articles
- **Cheerio Scraper**: Fast, lightweight scraper for static HTML pages
- **Puppeteer Scraper**: JavaScript-rendered pages (modern election portals)

#### Scraping Targets
1. **Ballotpedia**: Candidate profiles, endorsements, voting records
2. **Vote411**: Candidate questionnaires and issue positions
3. **State Election Websites**: Official candidate filings, local measures
4. **Candidate Websites**: Campaign platforms and policy positions
5. **News Sources**: Objective reporting on candidates (AP, Reuters, NPR)

#### Legal & Ethical Compliance
- Only scrape publicly available information
- Respect robots.txt and rate limits
- Cache data to minimize requests
- Attribute sources transparently
- No voter registration or PII data collection
- Follow state election data access laws

### Scraping Architecture
```
┌─────────────────────┐
│   Apify Platform    │
│   (Managed Actors)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Scraping Service   │
│  (Node.js/TS)       │
│  - Rate limiting    │
│  - Error handling   │
│  - Data validation  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Data Normalization │
│  & Deduplication    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Database          │
│   (PostgreSQL)      │
└─────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React Native (iOS & Web initially, Android later)
  - Code sharing across platforms
  - Native performance on mobile
  - Web deployment via React Native Web
- **State Management**: TanStack Query (React Query)
  - Server state synchronization
  - Caching and background updates
  - Optimistic updates
- **UI Components**:
  - React Native Paper (Material Design)
  - OR React Native Elements
  - TailwindCSS via NativeWind for web
- **Navigation**: React Navigation
- **Maps**: React Native Maps (with Google Maps)
- **Notifications**:
  - Expo Notifications (mobile)
  - Web Push API (web)

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
  - High performance
  - Schema validation built-in
  - TypeScript support
  - Plugin ecosystem
- **API Design**: REST + GraphQL
  - REST for simple CRUD operations
  - GraphQL for complex election data queries
- **Authentication**:
  - Supabase Auth OR Auth0
  - JWT tokens
  - OAuth providers (Google, Apple)

### Database
- **Primary Database**: PostgreSQL 16+
  - JSONB for flexible candidate data
  - PostGIS extension for geospatial queries
  - Full-text search for candidate information
- **Schema Design**: See Data Model section below
- **Hosting**:
  - Supabase (managed Postgres + Auth + Storage)
  - OR Railway/Render for self-hosted

### Caching & Performance
- **Redis**:
  - API response caching
  - Rate limiting
  - Session storage
  - Job queues (Bull/BullMQ)
- **CDN**: Cloudflare for static assets

### Background Jobs
- **Queue System**: BullMQ (Redis-backed)
- **Scheduler**: node-cron
- **Jobs**:
  - Daily election data refresh
  - Weekly candidate information scraping
  - Reminder notifications (hourly checks)
  - Data validation and cleanup

### Infrastructure
- **Hosting**:
  - Backend: Railway/Render/Fly.io
  - Database: Supabase or managed PostgreSQL
  - Web: Vercel/Netlify
  - Mobile: Expo EAS
- **CI/CD**: GitHub Actions
- **Monitoring**:
  - Sentry (error tracking - already configured)
  - LogTail or Axiom (log aggregation)
  - Uptime monitoring (UptimeRobot/Better Uptime)

## Data Model

### Core Entities

#### Elections
```typescript
interface Election {
  id: string;
  type: 'local' | 'state' | 'national';
  subtype: string; // 'primary', 'general', 'special', 'runoff'
  name: string;
  date: Date;
  registrationDeadline: Date | null;
  earlyVotingStart: Date | null;
  earlyVotingEnd: Date | null;
  jurisdiction: string; // state, county, city
  jurisdictionId: string;
  geoBounds: GeoJSON; // polygon for election area
  status: 'upcoming' | 'active' | 'completed';
  dataSource: string[];
  lastUpdated: Date;
  createdAt: Date;
}
```

#### Candidates
```typescript
interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  party: string | null;
  photoUrl: string | null;
  websiteUrl: string | null;
  email: string | null;
  phone: string | null;

  // Biographical
  biography: string | null;
  education: Education[];
  experience: Experience[];

  // Platform & Positions
  platformSummary: string | null;
  issuePositions: IssuePosition[];

  // Campaign Finance
  fundraisingTotal: number | null;
  expendituresTotal: number | null;
  topDonors: Donor[];

  // Endorsements
  endorsements: Endorsement[];

  // Voting Record (for incumbents)
  votingRecord: VoteRecord[];

  // Social Media
  socialMedia: SocialMediaLinks;

  // Metadata
  dataSources: DataSource[];
  lastUpdated: Date;
  createdAt: Date;
}
```

#### Races (Offices)
```typescript
interface Race {
  id: string;
  electionId: string;
  officeName: string; // "U.S. House District 5", "City Alderman Ward 3"
  officeLevel: 'local' | 'state' | 'national';
  officeType: string; // 'executive', 'legislative', 'judicial'
  districtNumber: string | null;
  candidates: string[]; // candidate IDs
  incumbents: string[]; // candidate IDs
  totalSeats: number;
  termLength: string; // "2 years", "4 years"
  salary: number | null;
  responsibilities: string | null;
  geoBounds: GeoJSON | null;
}
```

#### PollingLocations
```typescript
interface PollingLocation {
  id: string;
  electionId: string;
  name: string;
  address: Address;
  geoLocation: { lat: number; lng: number };
  locationType: 'polling_place' | 'early_voting' | 'dropbox';
  hoursOpen: TimeRange[];
  accessibilityInfo: string | null;
  parkingInfo: string | null;
  notes: string | null;
}
```

#### UserReminders
```typescript
interface UserReminder {
  id: string;
  userId: string;
  electionId: string;
  reminderType: 'registration' | 'early_voting' | 'election_day';
  frequency: 'once' | 'daily' | 'weekly';
  daysBeforeEvent: number[];
  notificationMethod: ('push' | 'email' | 'sms')[];
  enabled: boolean;
  lastSent: Date | null;
  createdAt: Date;
}
```

#### ObjectiveAnalysis
```typescript
interface ObjectiveAnalysis {
  id: string;
  candidateId: string;
  category: 'pros' | 'cons' | 'neutral';
  statement: string;
  sources: Source[];
  confidence: number; // 0-1, based on source quality
  verifiedAt: Date;
  verifiedBy: 'ai' | 'human' | 'community';
}
```

## Objective Candidate Information System

### Multi-Source Aggregation
To maintain non-partisan objectivity, we aggregate data from multiple sources:

1. **Official Sources** (Highest Weight)
   - Government election websites
   - Campaign finance filings
   - Official voting records

2. **Non-Partisan Organizations** (High Weight)
   - League of Women Voters (Vote411)
   - Ballotpedia
   - Project Vote Smart

3. **Reputable News Sources** (Medium Weight)
   - Associated Press
   - Reuters
   - NPR
   - Local newspaper editorial boards

4. **Academic & Research** (Medium Weight)
   - MIT Election Lab analysis
   - University political science departments

### Objectivity Algorithm

```typescript
interface ObjectivityMetrics {
  sourceBalance: number; // 0-1, diversity of sources
  factualAccuracy: number; // 0-1, based on fact-checking
  languageNeutrality: number; // 0-1, sentiment analysis
  citationQuality: number; // 0-1, source credibility
}

// Weighted scoring for candidate information
function calculateObjectivityScore(data: CandidateData): number {
  const weights = {
    sourceBalance: 0.3,
    factualAccuracy: 0.4,
    languageNeutrality: 0.2,
    citationQuality: 0.1
  };

  return (
    data.sourceBalance * weights.sourceBalance +
    data.factualAccuracy * weights.factualAccuracy +
    data.languageNeutrality * weights.languageNeutrality +
    data.citationQuality * weights.citationQuality
  );
}
```

### AI-Assisted Analysis
- **Model**: Claude 3.5 Sonnet (via Anthropic API)
- **Purpose**:
  - Summarize candidate positions from multiple sources
  - Detect bias in source material
  - Generate neutral language summaries
  - Extract key policy positions
- **Human Oversight**:
  - Flag controversial summaries for human review
  - Community feedback mechanism
  - Expert panel for disputed content

### Pros/Cons Presentation
```typescript
interface CandidateComparison {
  candidateId: string;
  strengths: Array<{
    category: string; // 'experience', 'policy', 'funding', 'endorsements'
    statement: string;
    sources: Source[];
  }>;
  weaknesses: Array<{
    category: string;
    statement: string;
    sources: Source[];
  }>;
  neutralFacts: Array<{
    category: string;
    statement: string;
    sources: Source[];
  }>;
}
```

## Reminder System Architecture

### User Preferences
```typescript
interface ReminderPreferences {
  userId: string;
  elections: Array<{
    electionId: string;
    enableReminders: boolean;
    reminderSchedule: {
      registrationDeadline?: {
        enabled: boolean;
        daysBeforeDeadline: number[]; // e.g., [30, 14, 7, 1]
      };
      earlyVoting?: {
        enabled: boolean;
        frequency: 'once' | 'daily' | 'weekly';
        startOffset: number; // days before early voting starts
      };
      electionDay: {
        enabled: boolean;
        daysBeforeElection: number[]; // e.g., [7, 3, 1]
        morningOfElection: boolean;
      };
    };
    notificationChannels: {
      push: boolean;
      email: boolean;
      sms: boolean; // future feature
    };
  }>;
  timezone: string;
  quietHours: {
    start: string; // "22:00"
    end: string; // "08:00"
  };
}
```

### Notification Queue System
```
┌─────────────────────────┐
│   Scheduled Job         │
│   (runs hourly)         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Check Due Reminders   │
│   - Query DB for users  │
│   - Filter by timezone  │
│   - Respect quiet hours │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   BullMQ Job Queue      │
│   - Push notifications  │
│   - Email notifications │
│   - Rate limiting       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Notification Workers  │
│   - Expo push service   │
│   - SendGrid/Resend     │
│   - Twilio (SMS future) │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Log & Track           │
│   - Delivery status     │
│   - User engagement     │
│   - Error handling      │
└─────────────────────────┘
```

### Notification Content
```typescript
interface ElectionNotification {
  type: 'registration_deadline' | 'early_voting_start' | 'election_day';
  election: {
    name: string;
    date: Date;
    type: string;
  };
  action: {
    title: string; // "Register to Vote by Tomorrow"
    body: string;
    cta: string; // "Find Your Polling Place"
    deepLink: string; // app://elections/{id}
  };
  locationInfo: {
    pollingPlace?: PollingLocation;
    registrationUrl?: string;
  };
  urgency: 'high' | 'medium' | 'low';
}
```

## API Architecture

### REST Endpoints

#### Elections API
```
GET    /api/v1/elections                    # List elections (with filters)
GET    /api/v1/elections/:id                # Get election details
GET    /api/v1/elections/nearby             # Elections by location
GET    /api/v1/elections/:id/races          # Races in election
GET    /api/v1/elections/:id/polling-places # Polling locations
```

#### Candidates API
```
GET    /api/v1/candidates/:id               # Candidate details
GET    /api/v1/candidates/:id/comparison    # Objective pros/cons
GET    /api/v1/candidates/:id/voting-record # Incumbent voting history
GET    /api/v1/candidates/search            # Search candidates
```

#### User API
```
GET    /api/v1/user/profile                 # User profile
PATCH  /api/v1/user/profile                 # Update profile
GET    /api/v1/user/reminders               # User's election reminders
POST   /api/v1/user/reminders               # Create reminder
PATCH  /api/v1/user/reminders/:id           # Update reminder
DELETE /api/v1/user/reminders/:id           # Delete reminder
POST   /api/v1/user/location                # Save user location
```

#### Search API
```
GET    /api/v1/search                       # Universal search
  ?q=query
  &type=elections,candidates,races
  &location=lat,lng
```

### GraphQL Schema
```graphql
type Query {
  election(id: ID!): Election
  elections(filter: ElectionFilter, location: LocationInput): [Election!]!

  candidate(id: ID!): Candidate
  candidates(raceId: ID!): [Candidate!]!

  races(electionId: ID!): [Race!]!
  race(id: ID!): Race

  pollingLocations(electionId: ID!, location: LocationInput!): [PollingLocation!]!

  userReminders: [Reminder!]!
}

type Mutation {
  createReminder(input: ReminderInput!): Reminder!
  updateReminder(id: ID!, input: ReminderInput!): Reminder!
  deleteReminder(id: ID!): Boolean!

  updateUserLocation(location: LocationInput!): User!
}

type Election {
  id: ID!
  name: String!
  date: DateTime!
  type: ElectionType!
  races: [Race!]!
  pollingLocations(near: LocationInput): [PollingLocation!]!
  upcomingDeadlines: [Deadline!]!
}

type Candidate {
  id: ID!
  name: String!
  party: String
  biography: String
  platformSummary: String
  issuePositions: [IssuePosition!]!
  objectiveAnalysis: ObjectiveAnalysis!
  campaignFinance: CampaignFinance
  votingRecord: [VoteRecord!]!
  endorsements: [Endorsement!]!
}
```

## Development Phases

### Phase 1: MVP (8-10 weeks)
**Goal**: Basic election lookup and reminder functionality

- [ ] Project setup and infrastructure
  - Initialize React Native project with Expo
  - Set up Fastify backend with TypeScript
  - Configure PostgreSQL with Supabase
  - Set up Redis for caching
  - Configure Sentry error tracking

- [ ] Core data integrations
  - Integrate Google Civic Information API
  - Set up Democracy Works Elections API
  - Build data ingestion pipeline
  - Create database schema and migrations

- [ ] Basic mobile app
  - User authentication (email/password)
  - Location-based election lookup
  - List elections by user location
  - View election details and dates
  - View races and candidates (basic info)
  - Find polling places

- [ ] Reminder system
  - User reminder preferences UI
  - Notification scheduling service
  - Push notification delivery
  - Email notifications

- [ ] Deployment
  - Deploy backend to Railway/Render
  - Deploy mobile app to TestFlight (iOS)
  - Set up CI/CD pipeline

### Phase 2: Enhanced Data (6-8 weeks)
**Goal**: Add comprehensive candidate information

- [ ] Web scraping system
  - Set up Apify actors for Ballotpedia
  - Scrape Vote411 candidate questionnaires
  - Build state election website scrapers
  - Implement data normalization pipeline

- [ ] Campaign finance integration
  - ProPublica Campaign Finance API
  - FEC API integration
  - Visualize donation patterns

- [ ] Candidate profiles
  - Detailed biographies
  - Issue positions
  - Voting records (for incumbents)
  - Social media links
  - Endorsements

- [ ] Search functionality
  - Full-text search for candidates
  - Filter by party, office, location
  - Compare candidates side-by-side

### Phase 3: Objective Analysis (4-6 weeks)
**Goal**: AI-powered objective candidate analysis

- [ ] AI integration
  - Claude 3.5 Sonnet API integration
  - Multi-source aggregation algorithm
  - Bias detection system
  - Generate neutral summaries

- [ ] Pros/Cons system
  - Extract strengths from multiple sources
  - Identify weaknesses objectively
  - Display with source citations
  - User feedback mechanism

- [ ] Quality assurance
  - Human review queue
  - Community flagging system
  - Expert panel review for disputes
  - Continuous bias monitoring

### Phase 4: Polish & Scale (4-6 weeks)
**Goal**: Production-ready with full feature set

- [ ] Android support
  - React Native Android build
  - Google Play Store deployment
  - Platform-specific optimizations

- [ ] Web application
  - React Native Web deployment
  - Responsive design
  - PWA capabilities
  - SEO optimization

- [ ] Advanced features
  - Sample ballot builder
  - Voting record comparisons
  - Historical election data
  - Shareable candidate comparisons
  - SMS reminders
  - Calendar integration

- [ ] Performance & scale
  - Database optimization
  - CDN for static assets
  - API rate limiting and caching
  - Load testing
  - Monitoring dashboards

## Compliance & Legal

### Data Privacy
- **GDPR Compliance**: Data portability, right to deletion
- **CCPA Compliance**: California privacy requirements
- **User Data**: Minimal collection, transparent usage
- **Location Data**: User consent, secure storage
- **No PII Scraping**: Never collect voter registration data

### Election Law Compliance
- **Non-Partisan**: No endorsements or recommendations
- **Fact-Based**: All claims must be sourced
- **Transparency**: Clear source attribution
- **Accessibility**: WCAG 2.1 AA compliance
- **State Laws**: Comply with state-specific election information laws

### Terms of Service
- No voter manipulation
- No false information
- User content moderation
- Data usage transparency
- Third-party API compliance

## Cost Estimates (Monthly)

### Development Phase
- **Supabase**: $25/month (Pro plan)
- **Railway/Render**: $20/month (backend hosting)
- **Redis Cloud**: $0 (free tier) → $10 (production)
- **Apify**: $49/month (scraping operations)
- **Anthropic API**: ~$50-100/month (AI analysis)
- **Expo EAS**: $0 (development) → $99/month (production builds)
- **Domain & SSL**: $15/year
- **Monitoring (Sentry)**: $0 (already configured)
- **SendGrid/Resend**: $0-20/month (email notifications)

**Total Development**: ~$200-250/month

### Production (scaled)
- **Database**: $100-200/month (larger instance)
- **Backend**: $50-100/month (scaled compute)
- **CDN**: $20-50/month (Cloudflare)
- **APIs**: $200-500/month (increased usage)
- **Notifications**: $100-300/month (at scale)

**Total Production**: ~$500-1200/month (depending on user base)

## Success Metrics

### User Engagement
- Monthly active users
- Elections tracked per user
- Reminder conversion rate (clicked → voted)
- Time spent on candidate profiles
- Candidate comparisons viewed

### Data Quality
- API uptime (target: 99.5%)
- Data freshness (target: <24 hours)
- Scraping success rate (target: >95%)
- Objectivity score consistency

### Impact
- User-reported voter turnout
- Informed voting confidence (user surveys)
- Feature usage patterns
- User retention rate

## Future Enhancements

### Community Features
- User-generated candidate questions
- Community Q&A for candidates
- Voter guide sharing
- Discussion forums (moderated)

### Advanced Analytics
- Voting pattern predictions
- Demographic-based recommendations
- Turnout forecasting
- Redistricting impact analysis

### Accessibility
- Screen reader optimization
- Multiple language support (Spanish priority)
- SMS-based interaction for low-data users
- Offline mode for cached elections

### Partnerships
- Local news organizations
- Civic organizations
- Universities and research institutions
- Government election offices

## Next Steps

1. **Technology Decisions**
   - Confirm: React Native + Expo?
   - Confirm: Fastify backend?
   - Confirm: Supabase or self-hosted PostgreSQL?

2. **API Keys & Access**
   - Obtain Google Civic Information API key
   - Register for Democracy Works API access
   - Configure Apify actors
   - Set up Anthropic API key

3. **Project Initialization**
   - Create React Native project structure
   - Set up monorepo (optional: Turborepo/Nx)
   - Initialize backend with Fastify
   - Configure database schema

4. **First Sprint**
   - Basic authentication
   - Google Civic API integration
   - Simple election lookup by address
   - Display election dates and polling locations

---

**Document Version**: 1.0
**Last Updated**: November 17, 2025
**Author**: Claude (AI Assistant)
**Review Status**: Pending stakeholder review
