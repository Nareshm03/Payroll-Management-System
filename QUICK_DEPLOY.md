# Quick Deployment Guide

## 🚀 Deploy in 10 Minutes

### Step 1: Deploy Backend on Railway (5 min)

1. **Go to Railway**: https://railway.app
2. **Sign in with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `Nareshm03/Payroll-Management-System`
5. **Settings**:
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. **Add PostgreSQL**: New → Database → PostgreSQL
7. **Add Variables**:
   ```
   SECRET_KEY=payroll-secret-key-change-in-production-2025
   FRONTEND_URL=*
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```
8. **Copy Backend URL**: e.g., `https://payroll-backend.up.railway.app`

### Step 2: Deploy Frontend on Vercel (5 min)

1. **Go to Vercel**: https://vercel.com
2. **Import Project** → Select GitHub repo
3. **Configure**:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.up.railway.app
   ```
   (Replace with your Railway backend URL)
5. **Deploy**
6. **Copy Frontend URL**: e.g., `https://payroll-system.vercel.app`

### Step 3: Update CORS (2 min)

1. **Update** `backend/app/main.py`:
   ```python
   allow_origins=[
       "http://localhost:3000",
       "https://your-frontend.vercel.app"  # Add your Vercel URL
   ]
   ```
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update CORS"
   git push origin main
   ```
3. **Railway auto-redeploys**

### Step 4: Initialize Database (1 min)

**Option A - Railway Dashboard**:
1. Go to Railway project
2. Click backend service
3. Variables tab → Add:
   ```
   RUN_SEED=true
   ```
4. Redeploy

**Option B - Railway CLI**:
```bash
npm i -g @railway/cli
railway login
railway link
railway run python seed_data.py
```

### Step 5: Test (1 min)

1. **Visit Frontend**: `https://your-frontend.vercel.app`
2. **Login**:
   - Email: `hire-me@anshumat.org`
   - Password: `HireMe@2025!`
3. **Verify**: Dashboard loads with data

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Railway
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Frontend deployed on Vercel
- [ ] REACT_APP_API_URL configured
- [ ] CORS updated with frontend URL
- [ ] Database seeded
- [ ] Login tested
- [ ] All features working

---

## 🔗 Your Deployment URLs

**Frontend**: https://_________________.vercel.app  
**Backend**: https://_________________.up.railway.app  
**API Docs**: https://_________________.up.railway.app/docs

---

## 🐛 Quick Fixes

**Can't login?**
- Check backend logs in Railway
- Verify DATABASE_URL exists
- Run seed_data.py

**CORS error?**
- Update allow_origins in main.py
- Add your Vercel URL
- Redeploy backend

**Frontend blank?**
- Check REACT_APP_API_URL in Vercel
- Verify backend is running
- Check browser console

---

## 📞 Need Help?

1. Check Railway logs
2. Check Vercel deployment logs
3. Test backend: `https://your-backend.railway.app/health`
4. Test API docs: `https://your-backend.railway.app/docs`

---

**Total Time**: ~10 minutes  
**Cost**: Free (Railway $5 credit + Vercel free tier)
