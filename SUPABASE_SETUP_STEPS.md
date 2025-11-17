# 🚀 Supabase Setup - Step by Step

## ✅ Current Status
You chose Supabase - Great choice! Let's set it up.

---

## 📋 Step-by-Step Instructions

### Step 1: Create Supabase Account (2 minutes)

1. **Go to:** https://supabase.com
2. **Click:** "Start your project"
3. **Sign in with GitHub** (easiest option)
4. **Authorize Supabase** to access your GitHub account

---

### Step 2: Create New Project (3 minutes)

1. **Click:** "New Project" (green button)

2. **Fill in the details:**
   - **Organization:** Select or create one
   - **Name:** `planova`
   - **Database Password:** 
     - Click "Generate a password" OR
     - Create your own strong password
     - **⚠️ IMPORTANT: Copy and save this password!**
   - **Region:** Choose closest to you:
     - Middle East/Europe → `Europe West (Ireland)`
     - USA → `East US (North Virginia)`
     - Asia → `Southeast Asia (Singapore)`
   - **Pricing Plan:** Free (default)

3. **Click:** "Create new project"

4. **Wait 2-3 minutes** for the project to be created
   - You'll see a progress indicator
   - Don't close the page!

---

### Step 3: Get Connection String (1 minute)

1. **After project is created**, you'll see the dashboard

2. **Click on the Settings icon** (⚙️) in the left sidebar

3. **Click:** "Database" in the settings menu

4. **Scroll down** to "Connection string" section

5. **Select the "URI" tab** (not "Session mode" or "Transaction mode")

6. **Copy the connection string** - it looks like:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

7. **Replace `[YOUR-PASSWORD]`** with the password you saved in Step 2

---

### Step 4: Update .env File (30 seconds)

1. **Open `.env` file** in your project

2. **Find the line:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   ```

3. **Replace it with your Supabase connection string:**
   ```env
   DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:YOUR_ACTUAL_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
   ```

4. **Save the file** (Ctrl+S or Cmd+S)

---

### Step 5: Run Migrations (1 minute)

Open your terminal and run:

```bash
# Create database schema
npx prisma migrate dev --name init
```

**Expected output:**
```
✔ Generated Prisma Client
✔ Applied migration: 20231117000000_init
```

---

### Step 6: Seed Database (30 seconds)

```bash
# Add test users
npm run db:seed
```

**Expected output:**
```
✅ Database seeded successfully!
Created users:
- admin@planova.com (ADMIN)
- user@planova.com (USER)
- guest@planova.com (GUEST)
```

---

### Step 7: Start Application (30 seconds)

```bash
# Start development server
npm run dev
```

**Expected output:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

---

### Step 8: Test Everything (2 minutes)

1. **Open browser:** http://localhost:3000

2. **Try logging in:**
   - Email: `admin@planova.com`
   - Password: `admin123`

3. **Test features:**
   - Create a new project
   - Add a task
   - Everything should work!

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] `.env` file updated
- [ ] Migrations ran successfully
- [ ] Database seeded
- [ ] App running on localhost:3000
- [ ] Can login with test users

---

## 🎉 You're Done!

Your Planova app is now running with Supabase PostgreSQL!

### What You Get:
- ✅ Free PostgreSQL database (500MB)
- ✅ Automatic backups
- ✅ Built-in database browser
- ✅ Real-time capabilities
- ✅ No credit card required

---

## 🔍 View Your Database

You can view your data in Supabase:

1. Go to your Supabase project dashboard
2. Click "Table Editor" in the left sidebar
3. You'll see all your tables (User, Project, Task, etc.)

Or use Prisma Studio:
```bash
npx prisma studio
```

---

## 🆘 Troubleshooting

### "Can't reach database server"
- Check your connection string in `.env`
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Verify no extra spaces in the connection string

### "Authentication failed"
- Double-check your database password
- Copy the connection string again from Supabase

### Migration errors
- Try: `npx prisma migrate reset`
- Then: `npx prisma migrate dev --name init`

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

**Estimated Total Time:** ~10 minutes

**Current Step:** Update your `.env` file with Supabase connection string, then run migrations!
