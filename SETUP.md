# Election Watch - Setup Guide

## Prerequisites

- Node.js 18+ (currently using v22.16.0)
- npm 9+ (currently using v10.9.2)
- PostgreSQL 16+ (local or Supabase)
- Redis (local or Upstash)

## Initial Setup

### 1. Clone and Install

```bash
# Install dependencies
npm install

# The monorepo includes:
# - apps/web (Next.js web app)
# - apps/mobile (React Native/Expo app)
# - apps/api (Fastify backend)
# - packages/shared (Shared types and utilities)
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Required API keys and services:

#### Database (Choose one):

**Option A: Supabase (Recommended for quick start)**
```bash
# Sign up at https://supabase.com
# Create a new project
# Get connection string from Project Settings > Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally
brew install postgresql@16  # macOS
# or use Docker: docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16

DATABASE_URL=postgresql://postgres:password@localhost:5432/election_watch
```

#### Redis (Choose one):

**Option A: Upstash (Recommended for deployment)**
```bash
# Sign up at https://upstash.com
# Create a Redis database
# Copy the connection string
REDIS_URL=redis://default:[PASSWORD]@[HOST]:6379
```

**Option B: Local Redis**
```bash
# Install Redis locally
brew install redis  # macOS
redis-server

REDIS_URL=redis://localhost:6379
```

#### Google Civic Information API
```bash
# Get API key: https://console.cloud.google.com/
# Enable Google Civic Information API
# Create credentials (API key)
GOOGLE_CIVIC_API_KEY=your_api_key_here
```

#### Anthropic API (for AI analysis)
```bash
# Get API key: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_api_key_here
```

#### Apify (for web scraping)
```bash
# Sign up at https://apify.com
# Get API token from Account > Integrations
APIFY_API_KEY=your_api_token_here
```

#### JWT Secret
```bash
# Generate a secure random string
JWT_SECRET=$(openssl rand -base64 32)
```

### 3. Database Setup

```bash
# Navigate to API directory
cd apps/api

# Generate database migration
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Drizzle Studio to view database
npm run db:studio
```

## Development

### Start All Services

From the root directory:

```bash
# Start all apps concurrently (web, mobile, api)
npm run dev
```

This will start:
- Web app: http://localhost:3000
- API: http://localhost:3001
- Mobile: Expo DevTools (scan QR code with Expo Go app)

### Start Individual Apps

```bash
# Web only
npm run dev --filter=web

# API only
npm run dev --filter=api

# Mobile only
npm run dev --filter=mobile
```

### Mobile Development

```bash
cd apps/mobile

# Start Expo
npm start

# Scan QR code with:
# - iOS: Camera app or Expo Go
# - Android: Expo Go app

# Or run in simulator:
npm run ios     # iOS Simulator (macOS only)
npm run android # Android Emulator
npm run web     # Web browser
```

## Project Structure

```
election-watch/
├── apps/
│   ├── mobile/              # React Native (Expo) app
│   │   ├── App.tsx          # Main app component
│   │   └── package.json
│   ├── web/                 # Next.js web app
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── package.json
│   └── api/                 # Fastify backend
│       ├── src/
│       │   ├── index.ts     # Server entry
│       │   ├── db/          # Database schema & migrations
│       │   ├── routes/      # API routes
│       │   └── services/    # Business logic
│       └── package.json
├── packages/
│   └── shared/              # Shared types & utilities
│       ├── src/
│       │   ├── types/       # TypeScript types
│       │   ├── constants.ts # Constants
│       │   └── utils/       # Utility functions
│       └── package.json
├── docs/                    # Documentation
├── ARCHITECTURE.md          # Technical architecture
├── README.md                # Project overview
└── package.json             # Root workspace config
```

## API Development

### Database Operations

```bash
cd apps/api

# Generate new migration after schema changes
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### API Endpoints

The API will be available at `http://localhost:3001`

#### Health Check
```bash
curl http://localhost:3001/health
```

#### API v1 Info
```bash
curl http://localhost:3001/api/v1
```

## Testing

```bash
# Type check all packages
npm run type-check

# Lint all packages
npm run lint

# Format code
npm run format
```

## Building for Production

```bash
# Build all apps
npm run build

# Build specific app
npm run build --filter=web
npm run build --filter=api
```

## Troubleshooting

### Port Already in Use

If port 3000 (web) or 3001 (api) is already in use:

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues

1. Verify PostgreSQL is running:
```bash
# Local
psql -U postgres -l

# Supabase
# Check project status in Supabase dashboard
```

2. Check connection string format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### Module Resolution Issues

```bash
# Clear caches and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Mobile App Not Loading

1. Ensure Expo CLI is up to date:
```bash
cd apps/mobile
npx expo-doctor
```

2. Clear Expo cache:
```bash
npx expo start -c
```

## Next Steps

1. ✅ Project initialized
2. ⬜ Set up environment variables
3. ⬜ Configure database
4. ⬜ Obtain API keys (Google Civic, Anthropic, Apify)
5. ⬜ Start development
6. ⬜ Build first feature: Election lookup by address

## Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Google Civic Information API Docs](https://developers.google.com/civic-information)
- [Fastify Documentation](https://fastify.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## Support

For issues or questions:
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- Review API documentation (coming soon)
- Open an issue on GitHub (if applicable)
