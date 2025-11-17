# API Keys Setup Guide

## Priority 1: Google Civic Information API (REQUIRED)

The Google Civic Information API is essential for the core functionality of Election Watch.

### Steps to Get API Key:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" at the top
   - Click "New Project"
   - Name: "Election Watch"
   - Click "Create"

3. **Enable the Google Civic Information API**
   - In the search bar, type "Civic Information API"
   - Click on "Google Civic Information API"
   - Click "Enable"

4. **Create Credentials**
   - Click "Credentials" in the left sidebar
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "API key"
   - Copy the API key that's generated
   - (Optional) Click "Restrict Key" to add restrictions:
     - API restrictions: Select "Google Civic Information API"
     - Application restrictions: Set to your domain/IP for production

5. **Add to .env file**
   ```bash
   GOOGLE_CIVIC_API_KEY=your_api_key_here
   ```

### API Quotas & Limits:

- **Free Tier**: 25,000 requests per day
- **Cost**: Free for most use cases
- **Rate Limit**: Be mindful of caching to stay within limits

### Testing the API:

Once you have the key, test it:
```bash
curl "https://www.googleapis.com/civicinfo/v2/elections?key=YOUR_API_KEY"
```

You should see a list of elections.

---

## Priority 2: Supabase Setup (REQUIRED)

Supabase provides PostgreSQL database and authentication.

### Steps:

1. **Sign up at Supabase**
   - Visit: https://supabase.com
   - Sign up with GitHub (recommended)

2. **Create a New Project**
   - Click "New Project"
   - Name: "election-watch"
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get Connection String**
   - Go to Project Settings (gear icon) > Database
   - Find "Connection string" section
   - Copy the "URI" connection string
   - Replace `[YOUR-PASSWORD]` with your database password

4. **Add to .env file**
   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres
   ```

5. **Get Supabase URL and Anon Key** (for auth later)
   - Go to Project Settings > API
   - Copy "Project URL"
   - Copy "anon public" key
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

---

## Priority 3: Redis Setup (REQUIRED for production)

For development, you can skip this initially. For production:

### Option A: Upstash (Recommended)

1. **Sign up at Upstash**
   - Visit: https://upstash.com
   - Sign up with GitHub

2. **Create Redis Database**
   - Click "Create Database"
   - Name: "election-watch"
   - Region: Choose closest to you
   - Click "Create"

3. **Get Connection String**
   - Copy the "Redis URL" from the dashboard
   ```bash
   REDIS_URL=redis://default:[PASSWORD]@[HOST]:6379
   ```

### Option B: Local Redis (Development)

```bash
# macOS
brew install redis
brew services start redis

# In .env
REDIS_URL=redis://localhost:6379
```

---

## Your Existing APIs ✅

### Anthropic API (Already Have)
```bash
ANTHROPIC_API_KEY=your_existing_key_here
```

### Apify API (Already Have)
```bash
APIFY_API_KEY=your_existing_key_here
```

---

## Optional APIs (Add Later)

### SendGrid or Resend (Email Notifications)
**SendGrid:**
- https://sendgrid.com
- Free tier: 100 emails/day

**Resend (Recommended):**
- https://resend.com
- Free tier: 100 emails/day
- Better developer experience

```bash
SENDGRID_API_KEY=your_key_here
# OR
RESEND_API_KEY=your_key_here
```

---

## Complete .env File Template

Once you have all the keys, your `.env` file should look like:

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres

# Redis (Upstash or local)
REDIS_URL=redis://localhost:6379  # or Upstash URL

# Google Civic Information API (REQUIRED)
GOOGLE_CIVIC_API_KEY=your_google_api_key_here

# Anthropic API (for AI analysis)
ANTHROPIC_API_KEY=your_existing_anthropic_key

# Apify (for web scraping)
APIFY_API_KEY=your_existing_apify_key

# Supabase Auth (for frontend)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)

# API Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Email Service (optional, add later)
# RESEND_API_KEY=your_resend_api_key_here

# Sentry (optional, for error tracking)
# SENTRY_DSN=your_sentry_dsn_here
```

---

## Quick Start Checklist

- [ ] Get Google Civic Information API key
- [ ] Set up Supabase project
- [ ] Get Supabase connection string
- [ ] Create `.env` file with all keys
- [ ] Test database connection
- [ ] Run first migration

Once you have the Google Civic API key and Supabase set up, run:

```bash
# Create .env file
cp .env.example .env
# Edit .env with your keys

# Run database migrations
cd apps/api
npm run db:generate
npm run db:migrate

# Start development
cd ../..
npm run dev
```

---

## Next Steps After Setup

Once you have the API keys configured:

1. **Test Google Civic API** - Fetch elections by address
2. **Build Election Lookup UI** - Search form on web app
3. **Display Election Results** - Show upcoming elections
4. **Add Polling Locations** - Map integration
5. **Scrape Additional Data** - Use Apify for Ballotpedia
6. **AI Analysis** - Use Anthropic for objective summaries

---

**Need Help?**
- Google Civic API Docs: https://developers.google.com/civic-information
- Supabase Docs: https://supabase.com/docs
- See SETUP.md for troubleshooting
