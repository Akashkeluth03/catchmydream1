# Setup & Installation Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Option A: Using Existing PostgreSQL
Ensure PostgreSQL is running:
```bash
# macOS (Homebrew)
brew services start postgresql@18

# Or restart if already running
brew services restart postgresql@18
```

#### Option B: Using Docker
```bash
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=study_in_asia \
  postgres:15
```

### 3. Configure Environment
The `.env` file is already configured for local PostgreSQL:
```env
DATABASE_URL="postgresql://akashkeluth@localhost:5432/study_in_asia"
```

Update if using different credentials:
```bash
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://username:password@localhost:5432/study_in_asia"
```

### 4. Initialize Database Schema
```bash
npx prisma db push
```

### 5. Seed Database with Sample Data
```bash
node prisma/seed.js
```

This will add:
- 6 countries (Singapore, Malaysia, UAE, Japan, South Korea, Thailand)
- 7 universities
- 3 sample courses per university
- 14 accommodations
- 12 job listings

### 6. Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Verification

### Check if Everything Works

1. **Homepage**: http://localhost:3000
   - Should show featured countries
   - Search bar should be functional

2. **Universities Page**: http://localhost:3000/universities
   - Should display 7 universities
   - Each card clickable

3. **University Details**: http://localhost:3000/universities/national-university-of-singapore-nus
   - Should show:
     - Courses with fees
     - Accommodations with distances
     - Job listings
     - Location info

## Common Issues & Solutions

### ❌ "Can't reach database server"
**Solution**: Start PostgreSQL
```bash
# Check if running
brew services list

# Start/restart
brew services restart postgresql@18

# Or with Docker
docker-compose up -d  # if using docker-compose
```

### ❌ "Port 3000 already in use"
**Solution**: Kill the process or use different port
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### ❌ "Migration/Schema errors"
**Solution**: Reset database
```bash
# Drop and recreate
npx prisma db push --force-reset

# Then seed
node prisma/seed.js
```

### ❌ "Prisma Client not generated"
**Solution**: Generate client
```bash
npx prisma generate
```

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run seed script
node prisma/seed.js

# Access Prisma Studio (database GUI)
npx prisma studio

# Check database schema
npx prisma db push --dry-run
```

## Database Management

### View Database in GUI
```bash
npx prisma studio
```
Opens at `http://localhost:5555`

### Access PostgreSQL CLI
```bash
psql -U akashkeluth -d study_in_asia
```

Useful commands:
```sql
-- List tables
\dt

-- Count records
SELECT COUNT(*) FROM "University";
SELECT COUNT(*) FROM "Accommodation";
SELECT COUNT(*) FROM "Job";

-- Exit
\q
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── universities/
│   │   ├── page.tsx        # Universities list
│   │   └── [slug]/
│   │       └── page.tsx    # University detail (WITH ACCOMMODATIONS & JOBS)
│   ├── countries/          # Country pages
│   ├── accommodation/      # Accommodation pages
│   └── jobs/               # Job pages
├── components/             # Reusable components
├── lib/
│   ├── db.ts               # Prisma client
│   └── distance.ts         # Distance calculation utilities
└── styles/                 # Global styles

prisma/
├── schema.prisma           # Database schema definition
└── seed.js                 # Database seeding script
```

## Data Schema Overview

### Country
- Name, ISO code, capital
- Official languages, currency
- Visa info, work rules, top student cities

### University
- Name, ranking, type (public/private)
- City, country, coordinates
- Description, website, logo

### Course
- Name, degree type (UG/Masters/PhD)
- Tuition, duration, intakes
- Language requirements (IELTS, TOEFL)

### Accommodation
- Name, type (hall/apartment/shared)
- Distance from campus (km), price
- Furnished status, safety score
- Address, coordinates

### Job
- Title, company, employment type
- Distance from campus (km), salary
- Visa sponsorship availability
- Application URL, city

## Performance Tips

1. **Database indexes**: Already configured in schema
2. **Pagination**: Add for large result sets
3. **Caching**: Configure Next.js ISR for static pages
4. **Distance filtering**: Pre-compute if needed

## Security Notes

- ✓ Environment variables in `.env` (not committed)
- ✓ Prisma escapes all queries
- ✓ Next.js CORS configured
- ⚠️ Add authentication before production
- ⚠️ Validate all user inputs

## Next Steps

1. Add user authentication (NextAuth.js)
2. Create saved items/favorites feature
3. Add interactive map (Google Maps/Mapbox)
4. Implement user dashboards
5. Add review system
6. Create admin panel

## Documentation

- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Created**: April 2026
**Last Updated**: April 2026
