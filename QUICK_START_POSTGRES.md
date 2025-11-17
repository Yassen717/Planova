# ⚡ Quick Start: PostgreSQL Setup (5 minutes)

## 🚨 Current Issue
```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Reason:** PostgreSQL is not running locally.

---

## ✅ Solution: Use Free Cloud Database

### Option 1: Supabase (Recommended - Easiest) 🚀

#### Steps:
1. **Go to:** https://supabase.com
2. **Sign up** with GitHub (free)
3. **Create new project:**
   - Project name: `planova`
   - Database password: (choose a strong password)
   - Region: Choose closest to you
   - Wait 2 minutes for setup

4. **Get connection string:**
   - Go to: Project Settings → Database
   - Scroll to "Connection string"
   - Select "URI" tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your password

5. **Update `.env` file:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   ```

6. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

**Done! ✅**

---

### Option 2: Vercel Postgres 🔷

#### Steps:
1. **Go to:** https://vercel.com/dashboard
2. **Sign in** with GitHub
3. **Create Storage:**
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Name: `planova-db`
   - Region: Choose closest

4. **Get connection string:**
   - Click on your database
   - Go to ".env.local" tab
   - Copy `POSTGRES_URL`

5. **Update `.env` file:**
   ```env
   DATABASE_URL="your-postgres-url-here"
   ```

6. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

**Done! ✅**

---

### Option 3: Railway 🚂

#### Steps:
1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **New Project:**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Wait for deployment

4. **Get connection string:**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

5. **Update `.env` file:**
   ```env
   DATABASE_URL="your-railway-url-here"
   ```

6. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

**Done! ✅**

---

## 🐳 Option 4: Docker (If you prefer local)

### Prerequisites:
- Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Steps:
1. **Start Docker Desktop** (wait until it's fully running)

2. **Run PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

3. **Verify it's running:**
   ```bash
   docker ps
   ```
   You should see `planova-postgres` container

4. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

---

## 🎯 Recommended Choice

**For beginners:** Use **Supabase** (easiest, free, no installation)

**For production:** Use **Vercel Postgres** (if deploying to Vercel)

**For local development:** Use **Docker** (if you have Docker Desktop)

---

## ⏱️ Time Estimate

- **Supabase/Vercel/Railway:** 5 minutes
- **Docker:** 10 minutes (if Docker Desktop already installed)

---

## 🆘 Still Having Issues?

### Check your .env file:
```bash
# Make sure DATABASE_URL is set correctly
type .env
```

### Test connection:
```bash
npx prisma db pull
```

### Reset if needed:
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

---

## ✅ Success Checklist

After setup, verify:
- [ ] `npx prisma migrate dev --name init` runs successfully
- [ ] `npm run db:seed` creates test users
- [ ] `npm run dev` starts without errors
- [ ] Can login at http://localhost:3000

---

**Choose your option above and let's get PostgreSQL running! 🚀**
