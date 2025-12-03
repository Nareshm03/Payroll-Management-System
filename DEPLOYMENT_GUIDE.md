# Deployment Guide - Vercel

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Project pushed to GitHub

### Step 1: Prepare Frontend for Deployment

1. **Update API URL for production**:

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

2. **Test build locally**:
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import your GitHub repository: `Nareshm03/Payroll-Management-System`
4. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variables:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend API URL
6. Click **"Deploy"**

#### Option B: Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from frontend directory**:
```bash
cd frontend
vercel
```

4. **Follow prompts**:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `payroll-management-system`
   - Directory? `./`
   - Override settings? `N`

5. **Set environment variables**:
```bash
vercel env add REACT_APP_API_URL production
```
Enter your backend URL when prompted.

6. **Deploy to production**:
```bash
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Backend Deployment Options

### Option 1: Railway (Recommended for FastAPI)

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `SECRET_KEY`: Generate strong random string
   - `DATABASE_URL`: Use Railway PostgreSQL addon
   - `FRONTEND_URL`: Your Vercel frontend URL
6. Deploy

### Option 2: Render

1. Go to https://render.com
2. Click **"New"** → **"Web Service"**
3. Connect GitHub repository
4. Configure:
   - **Name**: payroll-backend
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables (same as Railway)
6. Create Service

### Option 3: Heroku

1. Install Heroku CLI
2. Create `backend/Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
3. Deploy:
```bash
cd backend
heroku login
heroku create payroll-backend
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DATABASE_URL=your-database-url
heroku config:set FRONTEND_URL=your-vercel-url
git subtree push --prefix backend heroku main
```

---

## Database Setup (Production)

### PostgreSQL on Railway

1. In Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Copy `DATABASE_URL` from Variables tab
3. Update backend environment variable

### PostgreSQL on Render

1. Create new PostgreSQL database
2. Copy Internal Database URL
3. Update backend environment variable

---

## Post-Deployment Checklist

### Frontend
- [ ] Verify build completes successfully
- [ ] Check REACT_APP_API_URL points to backend
- [ ] Test login functionality
- [ ] Verify all routes work
- [ ] Check responsive design on mobile

### Backend
- [ ] Database migrations run successfully
- [ ] Seed data loaded (if needed)
- [ ] API endpoints respond correctly
- [ ] CORS configured for frontend URL
- [ ] Environment variables set correctly

### Integration
- [ ] Frontend can connect to backend
- [ ] Authentication works end-to-end
- [ ] File uploads work (if applicable)
- [ ] All API calls succeed

---

## Quick Deploy Commands

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
# Railway auto-deploys on git push
git push origin main
```

---

## Troubleshooting

### Frontend Issues

**Build fails**:
- Check Node.js version (16.x required)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for missing dependencies

**API calls fail**:
- Verify REACT_APP_API_URL is set correctly
- Check CORS configuration on backend
- Inspect browser console for errors

### Backend Issues

**Database connection fails**:
- Verify DATABASE_URL format
- Check database is running
- Ensure IP whitelist includes Railway/Render IPs

**Import errors**:
- Verify all dependencies in requirements.txt
- Check Python version (3.10+ required)

---

## Environment Variables Reference

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.railway.app
```

### Backend
```env
SECRET_KEY=your-super-secret-key-min-32-chars
DATABASE_URL=postgresql://user:pass@host:5432/dbname
FRONTEND_URL=https://your-app.vercel.app
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Monitoring & Maintenance

### Vercel
- View deployment logs in dashboard
- Monitor build times and errors
- Set up deployment notifications

### Railway/Render
- Check application logs
- Monitor resource usage
- Set up health checks

---

## Cost Estimates

### Free Tier Limits

**Vercel**:
- 100 GB bandwidth/month
- Unlimited deployments
- Custom domains included

**Railway**:
- $5 free credit/month
- ~500 hours runtime

**Render**:
- 750 hours/month free
- Sleeps after 15 min inactivity

---

## Production URLs

After deployment, update these in your documentation:

- **Frontend**: https://payroll-management-system.vercel.app
- **Backend**: https://payroll-backend.railway.app
- **API Docs**: https://payroll-backend.railway.app/docs

---

**Deployment Time**: ~15 minutes  
**Last Updated**: January 2025
