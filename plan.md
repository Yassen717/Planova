# 🗓️ Database Migration Plan: SQLite → PostgreSQL

## 🎯 Goal
Migrate Planova from SQLite to PostgreSQL for production readiness.

## ⏱️ Estimated Time: 2-3 hours

---

## 📊 Migration Progress

### ✅ Completed Steps (60%)
1. ✅ **Backup SQLite database** - `prisma/dev.db.backup` created
2. ✅ **Update Prisma schema** - Changed to PostgreSQL provider
3. ✅ **Generate Prisma Client** - Client regenerated for PostgreSQL
4. ✅ **Delete old migrations** - Cleaned up SQLite migrations
5. ✅ **Create docker-compose.yml** - PostgreSQL container configuration
6. ✅ **Update .env.example** - PostgreSQL connection strings
7. ✅ **Update .env** - Local PostgreSQL URL configured
8. ✅ **Update .gitignore** - Added SQLite file patterns
9. ✅ **Update README.md** - PostgreSQL setup instructions
10. ✅ **Create POSTGRES_SETUP.md** - Detailed setup guide

### ⏳ Next Steps (40%)
1. ⏳ **Start PostgreSQL** - Choose one option:
   - **Option A:** Start Docker Desktop → `docker-compose up -d`
   - **Option B:** Use cloud database (Vercel/Supabase/Railway)
   - **Option C:** Install PostgreSQL locally
   
2. ⏳ **Run migrations** - `npx prisma migrate dev --name init`
3. ⏳ **Seed database** - `npm run db:seed`
4. ⏳ **Test application** - Verify all features work
5. ⏳ **Commit changes** - Git commit and push

### 📝 Quick Start
See [POSTGRES_SETUP.md](POSTGRES_SETUP.md) for detailed instructions on starting PostgreSQL.

---

## 📋 Current Status

**Current Database:** SQLite (`file:./dev.db`) - Backed up ✅
**Target Database:** PostgreSQL
**Reason:** Production readiness, scalability, concurrent connections
**Schema Status:** ✅ Updated to PostgreSQL
**Migration Status:** ⏳ Waiting for PostgreSQL to start

### Why PostgreSQL?
- ✅ Better for production environments
- ✅ Supports multiple concurrent connections
- ✅ Better performance for complex queries
- ✅ Required by most hosting platforms (Vercel, Railway, etc.)
- ✅ Better data integrity and ACID compliance
- ✅ Advanced features (full-text search, JSON support, etc.)

**Current:** SQLite (`file:./dev.db`)
**Target:** PostgreSQL
**Status:** Ready to migrate

---

## 📝 Migration Steps

### Step 1: Backup Current Data (5 minutes)
- [x] Export current SQLite data
- [x] Save backup of `prisma/dev.db`
- [x] Document current data state
- **Command:**
  ```bash
  cp prisma/dev.db prisma/dev.db.backup
  ```
- **Commit:** `chore: backup SQLite database before migration`
- **Status:** ✅ COMPLETED - Backup created at `prisma/dev.db.backup`

---

### Step 2: Setup PostgreSQL (15 minutes)

#### Option A: Local PostgreSQL
- [ ] Install PostgreSQL on your machine
- [ ] Create database: `planova_dev`
- [ ] Create user with password
- [ ] Test connection

#### Option B: Docker (Recommended)
- [x] Create `docker-compose.yml` for PostgreSQL
- [ ] Start PostgreSQL container (need Docker Desktop running)
- [ ] Verify container is running
- **Command:**
  ```bash
  docker-compose up -d
  ```
- **Status:** ⏳ docker-compose.yml created, waiting for Docker Desktop

#### Option C: Cloud Database (Easiest)
- [ ] Sign up for Vercel Postgres / Supabase / Railway
- [ ] Create new database
- [ ] Copy connection string
- [ ] Test connection

- **Commit:** `chore: setup PostgreSQL database`

---

### Step 3: Update Prisma Schema (10 minutes)
- [x] Open `prisma/schema.prisma`
- [x] Change provider from `"sqlite"` to `"postgresql"`
- [x] Update DATABASE_URL in `.env`
- [x] Review schema for PostgreSQL compatibility
- [x] Generate Prisma Client: `npx prisma generate`
- **Changes:**
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```
- **Commit:** `feat: migrate database from SQLite to PostgreSQL`
- **Status:** ✅ COMPLETED - Schema updated and Prisma Client generated

---

### Step 4: Reset Migrations (10 minutes)
- [x] Delete `prisma/migrations/` folder
- [x] Delete `prisma/dev.db` and `prisma/dev.db-journal`
- [ ] Create fresh migration: `npx prisma migrate dev --name init`
- [ ] Verify migration files created
- **Command:**
  ```bash
  rm -rf prisma/migrations
  rm prisma/dev.db*
  npx prisma migrate dev --name init
  ```
- **Commit:** `feat: create initial PostgreSQL migration`
- **Status:** ⏳ WAITING - Need PostgreSQL running first (see POSTGRES_SETUP.md)

---

### Step 5: Seed Database (5 minutes)
- [ ] Run seed script: `npm run db:seed`
- [ ] Verify users created
- [ ] Check data in Prisma Studio: `npx prisma studio`
- [ ] Test login with seed users
- **Command:**
  ```bash
  npm run db:seed
  npx prisma studio
  ```
- **Commit:** `chore: seed PostgreSQL database`

---

### Step 6: Test Application (30 minutes)
- [ ] Start development server: `npm run dev`
- [ ] Test authentication (login, register, guest)
- [ ] Test project CRUD operations
- [ ] Test task CRUD operations
- [ ] Test comments and notifications
- [ ] Test all API endpoints
- [ ] Verify data persistence
- [ ] Check for any errors in console
- **Commit:** `test: verify PostgreSQL migration success`

---

### Step 7: Update Documentation (15 minutes)
- [x] Update README.md with PostgreSQL setup
- [x] Update .env.example with PostgreSQL URL
- [x] Create POSTGRES_SETUP.md with detailed instructions
- [x] Add migration notes
- **Commit:** `docs: update documentation for PostgreSQL`
- **Status:** ✅ COMPLETED - All documentation updated

---

### Step 8: Update .gitignore (5 minutes)
- [x] Ensure `prisma/dev.db*` is in .gitignore
- [x] Add PostgreSQL-specific ignores if needed
- [x] Verify no sensitive data in git
- **Commit:** `chore: update gitignore for PostgreSQL`
- **Status:** ✅ COMPLETED - .gitignore updated with all SQLite patterns

---

### Step 9: Final Verification (20 minutes)
- [ ] Run full application test
- [ ] Check all features work
- [ ] Verify performance
- [ ] Test on different browsers
- [ ] Check mobile responsiveness
- [ ] Review console for errors
- **Commit:** `chore: final verification of PostgreSQL migration`

---

## 🔧 PostgreSQL Connection Strings

### Local PostgreSQL
```env
DATABASE_URL="postgresql://username:password@localhost:5432/planova_dev"
```

### Docker PostgreSQL
```env
DATABASE_URL="postgresql://planova:planova123@localhost:5432/planova_dev"
```

### Vercel Postgres
```env
DATABASE_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
```

### Supabase
```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

### Railway
```env
DATABASE_URL="postgresql://postgres:xxx@containers-us-west-xxx.railway.app:7431/railway"
```

---

## 🐳 Docker Setup (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: planova-postgres
    environment:
      POSTGRES_USER: planova
      POSTGRES_PASSWORD: planova123
      POSTGRES_DB: planova_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Commands:**
```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f postgres
```

---

## ⚠️ Important Notes

### Before Migration
1. ✅ Backup your SQLite database
2. ✅ Commit all changes to git
3. ✅ Test current application works
4. ✅ Document any custom configurations

### During Migration
1. ⚠️ Don't delete SQLite files until PostgreSQL is verified
2. ⚠️ Test thoroughly before deploying
3. ⚠️ Keep both .env configurations temporarily

### After Migration
1. ✅ Verify all features work
2. ✅ Check data integrity
3. ✅ Update all documentation
4. ✅ Deploy to staging first
5. ✅ Then deploy to production

---

## 🆘 Troubleshooting

### Issue: Connection refused
**Solution:** Ensure PostgreSQL is running
```bash
# Check if PostgreSQL is running
docker ps  # for Docker
sudo service postgresql status  # for local install
```

### Issue: Authentication failed
**Solution:** Check username and password in DATABASE_URL

### Issue: Database does not exist
**Solution:** Create database first
```bash
createdb planova_dev
```

### Issue: Migration failed
**Solution:** Reset and try again
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

---

## ✅ Success Criteria

Migration is successful when:
- ✅ Application starts without errors
- ✅ All authentication flows work
- ✅ All CRUD operations work
- ✅ Data persists correctly
- ✅ No console errors
- ✅ Performance is good
- ✅ All tests pass

---

## 📊 Migration Checklist Summary

- [ ] Step 1: Backup SQLite data (5 min)
- [ ] Step 2: Setup PostgreSQL (15 min)
- [ ] Step 3: Update Prisma schema (10 min)
- [ ] Step 4: Reset migrations (10 min)
- [ ] Step 5: Seed database (5 min)
- [ ] Step 6: Test application (30 min)
- [ ] Step 7: Update documentation (15 min)
- [ ] Step 8: Update .gitignore (5 min)
- [ ] Step 9: Final verification (20 min)

**Total Time:** ~2 hours

---

**Ready to start? Let's migrate to PostgreSQL! 🚀**
