# Election Watch

A non-partisan platform providing comprehensive election information across all levels of government (local, state, national) with intelligent reminders and objective candidate information.

## 🏗️ Project Structure

This is a monorepo managed with Turborepo:

```
election-watch/
├── apps/
│   ├── mobile/          # React Native (Expo) mobile app
│   ├── web/             # Next.js web application
│   └── api/             # Fastify backend API
├── packages/
│   ├── shared/          # Shared types, utils, and constants
│   ├── ui/              # Shared UI components (React Native + Web)
│   └── api-client/      # API client for frontend apps
└── docs/                # Documentation
```

## 🚀 Tech Stack

### Frontend
- **Mobile**: React Native + Expo
- **Web**: Next.js 14 (App Router)
- **State Management**: TanStack Query (React Query)
- **UI**: NativeWind (TailwindCSS for React Native) + Shadcn/ui

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Cache**: Redis (Upstash)
- **Jobs**: BullMQ

### Infrastructure
- **Monorepo**: Turborepo
- **Package Manager**: npm
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (web), Expo EAS (mobile), Railway (API)

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development servers
npm run dev
```

## 🔑 Required API Keys

Create a `.env` file in the root with:

```bash
# Google Civic Information API
GOOGLE_CIVIC_API_KEY=

# Anthropic API (for AI analysis)
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=

# Redis
REDIS_URL=

# Apify (for web scraping)
APIFY_API_KEY=
```

## 🛠️ Development

```bash
# Run all apps in development mode
npm run dev

# Run specific app
npm run dev --filter=web
npm run dev --filter=mobile
npm run dev --filter=api

# Build all apps
npm run build

# Lint all code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📱 Mobile Development

```bash
cd apps/mobile

# Start Expo
npm start

# iOS
npm run ios

# Android
npm run android

# Web preview
npm run web
```

## 🌐 Web Development

```bash
cd apps/web

# Start Next.js dev server
npm run dev

# Build for production
npm run build
```

## 🔌 API Development

```bash
cd apps/api

# Start Fastify dev server
npm run dev

# Run migrations
npm run db:migrate

# Generate DB types
npm run db:generate
```

## 📚 Documentation

See the `/docs` folder for detailed documentation:

- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions
- [API Documentation](./docs/api.md) - API endpoints and schemas
- [Data Model](./docs/data-model.md) - Database schema and relationships
- [Deployment](./docs/deployment.md) - Deployment guides

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## 📄 License

MIT

## 🎯 Roadmap

- [x] Project initialization
- [ ] MVP: Basic election lookup
- [ ] Reminder system
- [ ] Candidate information
- [ ] AI-powered objective analysis
- [ ] Android & Web deployment

---

**Status**: 🚧 In Development
**Version**: 0.1.0
