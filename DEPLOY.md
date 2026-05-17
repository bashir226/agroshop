# 🚀 Railway Deploy Instructions

## Prerequisites
1. Railway account (sign up at https://railway.com with GitHub)
2. Railway API token (get at https://railway.com/account/tokens)

## Quick Deploy via CLI

```bash
# Set your token
export RAILWAY_TOKEN="tpk-your-token-here"

# Login
railway login --browserless

# Create project
railway init --name agroshop

# Add PostgreSQL
railway add --database postgres

# Deploy backend
cd agroshop/backend
railway up

# Get backend URL from Railway dashboard, then deploy frontend
cd ../frontend
railway variables --set "NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app/api"
railway up
```

## Alternative: Deploy via Railway Dashboard (Easiest)

1. Go to https://railway.com/new
2. Select "Deploy from GitHub repo"
3. Choose `bashir226/agroshop`
4. Add PostgreSQL database
5. Configure two services:

### Service 1: Backend
- Source: `agroshop/backend`
- Start command: `node server.js`
- Health check: `/api/health`
- Env vars:
  - `DATABASE_URL` (auto-set by Railway PostgreSQL)
  - `JWT_SECRET` (generate a random string)
  - `CORS_ORIGIN` (your frontend URL)

### Service 2: Frontend
- Source: `agroshop/frontend`
- Start command: `npm start`
- Build command: `npm run build`
- Env vars:
  - `NEXT_PUBLIC_API_URL` (your backend URL + `/api`)
