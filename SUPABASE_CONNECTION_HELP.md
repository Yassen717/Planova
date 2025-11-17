# 🔗 How to Get Supabase Connection String

## Method 1: From Database Settings (Recommended)

1. **Go to your Supabase project dashboard**
2. **Click the gear icon ⚙️** (Settings) at the bottom of left sidebar
3. **Click "Database"** in the settings menu
4. **Scroll down** to find "Connection string" section
5. **You'll see tabs like:**
   - **Postgres** ← Use this one!
   - Session mode
   - Transaction mode

6. **Copy the connection string** - it will look like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
   ```

7. **Replace `[YOUR-PASSWORD]`** with your actual database password

---

## Method 2: Build It Manually (If you can't find it)

If you only see Project URL and API keys, you can build the connection string manually:

### What You Need:
1. **Project Reference ID** (from Project Settings → General)
2. **Database Password** (the one you created when setting up the project)
3. **Region** (where your project is hosted)

### Connection String Format:

**For Direct Connection (Port 5432):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**For Connection Pooling (Port 6543) - Recommended:**
```
postgresql://postgres:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Example:
If your:
- Project Reference: `abcdefghijklmnop`
- Password: `mySecurePassword123`
- Region: `eu-central-1`

**Direct connection:**
```
postgresql://postgres:mySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**Pooled connection (better for serverless):**
```
postgresql://postgres:mySecurePassword123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Method 3: From Project Settings

1. **Go to:** Project Settings (⚙️) → General
2. **Find:** "Project Reference ID" (something like `abcdefghijklmnop`)
3. **Use this format:**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Example:
```
postgresql://postgres:YourPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## 🎯 Quick Steps for You

### Step 1: Get Your Project Reference ID

1. Go to: **Settings ⚙️ → General**
2. Look for: **"Reference ID"** or **"Project Reference"**
3. Copy it (example: `xyzabc123456`)

### Step 2: Remember Your Password

- This is the password you set when creating the project
- If you forgot it, you can reset it in Database Settings

### Step 3: Build Your Connection String

Replace these values:
```
postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

**Example:**
```
postgresql://postgres:MyPass123@db.xyzabc123456.supabase.co:5432/postgres
```

---

## 📸 Visual Guide

### Where to Find Settings:
```
Supabase Dashboard
├── Your Project
│   ├── Table Editor
│   ├── SQL Editor
│   ├── Database
│   └── ⚙️ Settings (Click here!)
│       ├── General (Project Reference ID is here)
│       └── Database (Connection string is here)
```

---

## ✅ Test Your Connection

After you update `.env` with your connection string, test it:

```bash
# This will try to connect to your database
npx prisma db pull
```

If it works, you'll see:
```
✔ Introspected 0 models and wrote them into prisma/schema.prisma
```

If it fails, you'll see an error about connection.

---

## 🆘 Still Can't Find It?

### Option A: Tell me what you see
Tell me what information you can see in your Supabase dashboard, and I'll help you build the connection string.

### Option B: Use Supabase Direct Connection
Try this format (most common):
```
postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

### Option C: Check Supabase Docs
Go to: https://supabase.com/docs/guides/database/connecting-to-postgres

---

## 💡 What Information Do You Have?

Please share (without the actual password):
1. ✅ Project URL? (like: https://xyz.supabase.co)
2. ✅ Project Reference ID? (like: xyzabc123456)
3. ✅ Region? (like: eu-central-1)

I can help you build the correct connection string!
