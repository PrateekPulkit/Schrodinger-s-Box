# 🚀 Production Deployment Guide

## Schrödinger's Box - Deploy to Render or Vercel

This guide covers deploying the encrypted communication platform to production using Render and Vercel.

---

## 📋 Pre-Deployment Checklist

### Backend & Frontend Code
- ✅ All dependencies installed
- ✅ ML models trained and saved
- ✅ Environment variables configured
- ✅ Database initialized
- ✅ API endpoints tested

### Security Preparation
- [ ] Update `.env` with production secrets
- [ ] Configure database for production (PostgreSQL recommended)
- [ ] Enable HTTPS for all domains
- [ ] Configure CORS for production domains
- [ ] Set secure cookies if applicable

---

## 🔥 Deploy Backend to Render

### Step 1: Prepare Backend for Production

**1a. Create `render.yaml` in project root:**
```yaml
services:
  - type: web
    name: schrodinger-box-api
    env: python
    plan: standard
    buildCommand: "pip install -r backend/requirements.txt && cd backend && python -m ml.train"
    startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000"
    envVars:
      - key: DATABASE_URL
        scope: build,runtime
      - key: SECRET_KEY
        scope: build,runtime
      - key: VITE_API_URL
        value: "https://your-app-name-api.onrender.com"
      - key: VITE_WS_URL
        value: "wss://your-app-name-api.onrender.com"
```

**1b. Update `backend/requirements.txt` for production:**
```
# Add production database driver
psycopg2-binary>=2.9.0  # For PostgreSQL
```

**1c. Create `backend/config.py.prod` environment:**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@db:5432/schrodinger_prod"
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "your-secure-key-here"
    VITE_API_URL: str = "https://your-app.onrender.com"
    VITE_WS_URL: str = "wss://your-app.onrender.com"
    
    class Config:
        env_file = ".env.production"
```

### Step 2: Push to Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Schrödinger's Box secure chat platform"
git push origin main
```

### Step 3: Deploy on Render.com

1. **Sign up**: https://render.com
2. **Connect GitHub**: Dashboard → New Web Service → Connect GitHub
3. **Select Repository**: Choose `schrodingers-box`
4. **Configure Service**:
   - Name: `schrodinger-box-api`
   - Root Directory: `backend/`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt && python -m ml.train`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
5. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=<generate-with-secrets.token_urlsafe(32)>
   VITE_API_URL=https://schrodinger-box-api.onrender.com
   VITE_WS_URL=wss://schrodinger-box-api.onrender.com
   ```
6. **Deploy**: Click "Create Web Service"
7. **Note the API URL**: `https://schrodinger-box-api.onrender.com`

---

## ⚡ Deploy Frontend to Vercel

### Step 1: Prepare Frontend for Production

**1a. Update `frontend/.env.production`:**
```
VITE_API_URL=https://schrodinger-box-api.onrender.com
VITE_WS_URL=wss://schrodinger-box-api.onrender.com
```

**1b. Update `frontend/vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false, // Disable in production for security
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'crypto': ['framer-motion'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  }
})
```

### Step 2: Deploy on Vercel

1. **Sign up**: https://vercel.com
2. **Import Project**: Dashboard → Add New → Project → Import Git Repository
3. **Select Repository**: Choose `schrodingers-box`
4. **Configure**:
   - Framework Preset: `Vite`
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables**:
   ```
   VITE_API_URL=https://schrodinger-box-api.onrender.com
   VITE_WS_URL=wss://schrodinger-box-api.onrender.com
   ```
6. **Deploy**: Click "Deploy"
7. **Note the Frontend URL**: `https://your-project.vercel.app`

---

## 🔗 Connect Backend & Frontend

After both are deployed:

### Update Backend CORS

Edit `backend/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",  # Frontend
        "localhost:5174",  # Development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Update Frontend API URLs

Both `.env.production` should point to your deployed backend:
```
VITE_API_URL=https://schrodinger-box-api.onrender.com
VITE_WS_URL=wss://schrodinger-box-api.onrender.com
```

---

## 🗄️ Production Database Setup

### Option 1: PostgreSQL on Render

1. Create PostgreSQL database on Render
2. Get connection string
3. Add to backend environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/schrodinger_prod
   ```

### Option 2: External Database (Amazon RDS, Heroku Postgres, etc.)

```bash
# Install PostgreSQL client
pip install psycopg2-binary

# Create database
psql postgresql://user:password@host:5432/schrodinger_prod < init.sql

# Run migrations (if using Alembic)
alembic upgrade head
```

---

## 🔒 Production Security Checklist

### HTTPS & TLS
- ✅ Render: Auto-configured with SSL
- ✅ Vercel: Auto-configured with SSL
- ✅ WebSocket: Use `wss://` (secure WebSocket)

### Secrets Management
```python
# Use environment variables, never hardcode secrets
import os
SECRET_KEY = os.getenv('SECRET_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')
```

### CORS Configuration
```python
# Only allow production domains
allowed_origins = [
    "https://your-frontend.vercel.app",
    "https://your-custom-domain.com"
]
```

### Rate Limiting
```python
# Add slowapi for rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

### Input Validation
```python
# All requests validated by Pydantic
from pydantic import BaseModel

class ChatMessageRequest(BaseModel):
    content: str  # Validated & sanitized
    combo_id: str  # Must be valid combo
```

---

## 📊 Monitoring & Logging

### Render Logs
- Dashboard → Service → Logs tab
- Real-time access to stderr/stdout
- Historical logs available

### Vercel Logs
- Dashboard → Project → Deployments → Function Log
- Monitor build and runtime issues

### Application Logging

Add structured logging:
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"Handshake complete: {session_id}")
logger.error(f"Decryption failed: {error}")
```

---

## 🚀 Monitoring Health Checks

### Render Health Check
```bash
curl https://schrodinger-box-api.onrender.com/health
# Should return: {"status": "operational", "crypto": "PQC Hybrid Active"}
```

### Vercel Analytics
- Monitor Core Web Vitals automatically
- Check performance metrics in Dashboard

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend to Render
        run: |
          curl https://api.render.com/deploy/srv-xxxxx?key=${{ secrets.RENDER_DEPLOY_KEY }}
      - name: Deploy Frontend to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 📈 Performance Optimization

### Frontend (Vercel)
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Edge function caching
- ✅ CDN distribution globally

### Backend (Render)
- ✅ Database connection pooling
- ✅ Response caching with Redis
- ✅ Gzip compression
- ✅ Load balancing available

---

## 🔧 Troubleshooting

### Backend Deployment Issues

**Error: `ModuleNotFoundError`**
```bash
# Ensure all dependencies in requirements.txt
pip freeze > backend/requirements.txt
```

**Error: `Database connection failed`**
```bash
# Check DATABASE_URL environment variable
# Format: postgresql://user:password@host:port/dbname
```

### Frontend Deployment Issues

**Error: `Cannot find module`**
```bash
# Run in frontend directory
npm install
npm run build
```

**Error: `API undefined`**
```bash
# Verify VITE_API_URL in .env.production
# Must match actual backend URL
```

---

## 📞 Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com/deployment
- **Vite Docs**: https://vitejs.dev/guide/build.html

---

## ✅ Final Checklist Before Going Live

- [ ] Backend deployed and health check working
- [ ] Frontend deployed and loading correctly
- [ ] Both services have correct environment variables
- [ ] CORS configured for production domains
- [ ] HTTPS/WSS working (green lock in browser)
- [ ] Chat functionality tested end-to-end
- [ ] Multiple users can communicate securely
- [ ] Error messages are user-friendly
- [ ] Monitoring and logging configured
- [ ] Backup strategy in place
- [ ] Security audit completed

---

## 🎉 Deployment Complete!

Your application is now live and securely deployed!

- **Frontend**: https://your-project.vercel.app
- **Backend API**: https://schrodinger-box-api.onrender.com
- **Documentation**: https://schrodinger-box-api.onrender.com/docs

Share the frontend URL with users to start encrypted conversations!
