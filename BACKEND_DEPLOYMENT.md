# Backend Deployment Guide

## ⚠️ Important: Vercel Limitations for FastAPI

Vercel is **NOT recommended** for FastAPI backend because:
- Serverless functions have 10-second timeout
- No persistent database connections
- Cold starts affect performance
- SQLite not supported in serverless

## ✅ Recommended: Railway (Best for FastAPI)

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy Backend

1. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `Nareshm03/Payroll-Management-System`

2. **Configure Service**:
   - Click on the service
   - Go to Settings
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**:
   - Go to Variables tab
   - Add these variables:
   ```
   SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   FRONTEND_URL=https://your-frontend.vercel.app
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```

4. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will auto-create DATABASE_URL variable
   - Copy the DATABASE_URL value

5. **Update Backend Code for PostgreSQL**:
   - Railway automatically provides DATABASE_URL
   - No code changes needed if using SQLAlchemy

6. **Deploy**:
   - Railway auto-deploys on push to main branch
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://payroll-backend.up.railway.app`)

### Step 3: Update Frontend

1. **Update Frontend Environment Variable**:
   - Go to Vercel dashboard
   - Select your frontend project
   - Go to Settings → Environment Variables
   - Add/Update:
     ```
     REACT_APP_API_URL=https://your-backend.up.railway.app
     ```

2. **Redeploy Frontend**:
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment

### Step 4: Initialize Database

1. **Run seed script** (one-time):
   - Go to Railway project
   - Click on backend service
   - Go to "Deploy" tab
   - Click "Deploy" to trigger
   - Or use Railway CLI:
   ```bash
   railway run python seed_data.py
   ```

---

## Alternative: Render.com

### Step 1: Create Web Service

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   ```
   Name: payroll-backend
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Step 2: Add PostgreSQL

1. Click "New +" → "PostgreSQL"
2. Create database
3. Copy "Internal Database URL"

### Step 3: Environment Variables

Add in Web Service settings:
```
SECRET_KEY=your-secret-key
DATABASE_URL=<internal-database-url>
FRONTEND_URL=https://your-frontend.vercel.app
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Step 4: Deploy

- Render auto-deploys on git push
- Copy your backend URL

---

## Update Backend CORS

After deploying frontend, update backend CORS:

**File**: `backend/app/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://your-frontend.vercel.app"  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Database Migration (SQLite to PostgreSQL)

### Update requirements.txt

Add PostgreSQL driver:
```
psycopg2-binary==2.9.9
```

### Update database.py

Already configured to use DATABASE_URL from environment.

### Run Migrations

```bash
# Railway CLI
railway run python seed_data.py

# Or connect to Railway shell
railway shell
python seed_data.py
```

---

## Testing Backend

1. **Check Health**:
   ```
   https://your-backend.railway.app/health
   ```

2. **Check API Docs**:
   ```
   https://your-backend.railway.app/docs
   ```

3. **Test Login**:
   ```bash
   curl -X POST https://your-backend.railway.app/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"hire-me@anshumat.org","password":"HireMe@2025!"}'
   ```

---

## Complete Deployment Flow

### 1. Deploy Backend (Railway)
```bash
# Push to GitHub
git add .
git commit -m "Deploy backend"
git push origin main

# Railway auto-deploys
# Get backend URL: https://payroll-backend.up.railway.app
```

### 2. Deploy Frontend (Vercel)
```bash
# Update frontend/.env.production
echo "REACT_APP_API_URL=https://payroll-backend.up.railway.app" > frontend/.env.production

# Push to GitHub
git add .
git commit -m "Update API URL"
git push origin main

# Vercel auto-deploys
```

### 3. Test Integration
- Visit frontend URL
- Try logging in with demo credentials
- Verify all features work

---

## Environment Variables Summary

### Backend (Railway)
```env
SECRET_KEY=<generate-strong-random-string>
DATABASE_URL=<auto-provided-by-railway-postgres>
FRONTEND_URL=https://your-frontend.vercel.app
ACCESS_TOKEN_EXPIRE_MINUTES=60
PORT=<auto-provided-by-railway>
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.up.railway.app
```

---

## Troubleshooting

### Backend not responding
- Check Railway logs
- Verify environment variables
- Check database connection

### CORS errors
- Update CORS origins in main.py
- Redeploy backend

### Database errors
- Verify DATABASE_URL
- Check PostgreSQL is running
- Run seed_data.py

### Frontend can't connect
- Verify REACT_APP_API_URL
- Check backend is running
- Test backend health endpoint

---

## Cost (Free Tier)

**Railway**:
- $5 free credit/month
- ~500 hours runtime
- Enough for demo/portfolio

**Render**:
- 750 hours/month free
- Sleeps after 15 min inactivity
- Good for demos

**Vercel** (Frontend only):
- 100 GB bandwidth/month
- Unlimited deployments
- Free forever

---

## Quick Commands

### Railway CLI
```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run commands
railway run python seed_data.py
```

### Check Deployment
```bash
# Backend health
curl https://your-backend.railway.app/health

# Frontend
curl https://your-frontend.vercel.app
```

---

**Recommended Setup**: Railway (Backend) + Vercel (Frontend)  
**Deployment Time**: ~20 minutes  
**Cost**: Free tier sufficient for portfolio
