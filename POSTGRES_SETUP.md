# 🐘 PostgreSQL Setup Guide

## Current Status
✅ Schema updated to PostgreSQL
✅ SQLite backup created
✅ docker-compose.yml created
✅ .env.example created

## ⚠️ Next Steps Required

You need to start PostgreSQL before continuing. Choose one of these options:

---

## Option 1: Docker (Recommended) 🐳

### Prerequisites
- Install Docker Desktop from: https://www.docker.com/products/docker-desktop

### Steps
1. Start Docker Desktop
2. Run in terminal:
   ```bash
   docker-compose up -d
   ```
3. Verify it's running:
   ```bash
   docker ps
   ```

### Connection String (already in .env)
```
DATABASE_URL="postgresql://planova:planova123@localhost:5432/planova_dev"
```

---

## Option 2: Local PostgreSQL Installation

### Windows Installation
1. Download from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL 15 or higher
3. During installation, set password for postgres user
4. Create database:
   ```bash
   createdb planova_dev
   ```

### Connection String
Update `.env` with:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planova_dev"
```

---

## Option 3: Cloud Database (Easiest) ☁️

### Vercel Postgres (Free Tier)
1. Go to: https://vercel.com/dashboard
2. Create new Postgres database
3. Copy connection string
4. Update `.env` with the connection string

### Supabase (Free Tier)
1. Go to: https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy connection string (use "Connection pooling" for better performance)
5. Update `.env` with the connection string

### Railway (Free Trial)
1. Go to: https://railway.app
2. Create new project > Add PostgreSQL
3. Copy connection string
4. Update `.env` with the connection string

---

## After PostgreSQL is Running

Run these commands:

```bash
# Create initial migration
npx prisma migrate dev --name init

# Seed the database
npm run db:seed

# Open Prisma Studio to verify
npx prisma studio
```

---

## Verification

Test that everything works:
```bash
# Start the app
npm run dev

# Test login with seed users:
# - admin@planova.com / admin123
# - user@planova.com / user123
```

---

## Troubleshooting

### Docker not starting?
- Make sure Docker Desktop is running
- Check if port 5432 is available: `netstat -an | findstr 5432`

### Connection refused?
- Verify PostgreSQL is running
- Check the DATABASE_URL in .env
- Make sure the port matches (5432 for standard PostgreSQL)

### Migration failed?
- Reset and try again: `npx prisma migrate reset`
- Then: `npx prisma migrate dev --name init`

---

## What's Next?

Once PostgreSQL is running and migrations are complete:
1. ✅ Test all features
2. ✅ Update documentation
3. ✅ Commit changes
4. ✅ Deploy to production

---

**Need help? Check the main plan.md file for detailed steps.**
