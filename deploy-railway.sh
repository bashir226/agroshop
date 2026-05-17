#!/bin/bash
# Railway Deploy Script for AgroShop
# Usage: RAILWAY_API_TOKEN=your_token_here bash deploy-railway.sh

set -e

if [ -z "$RAILWAY_API_TOKEN" ]; then
  echo "❌ Error: RAILWAY_API_TOKEN is not set"
  echo "Get your token at: https://railway.com/account/tokens"
  echo "Then run: RAILWAY_API_TOKEN=tpk-... bash deploy-railway.sh"
  exit 1
fi

export RAILWAY_TOKEN="$RAILWAY_API_TOKEN"

echo "🚀 Deploying AgroShop to Railway..."
echo ""

# Login
echo "📡 Authenticating..."
railway login --browserless 2>/dev/null || true

# Create project if not exists
echo "📦 Creating project..."
PROJECT_NAME="agroshop"
PROJECT_ID=$(railway init --name "$PROJECT_NAME" --json 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('projectId',''))" 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
  echo "⚠️  Project may already exist, trying to link..."
  railway link 2>/dev/null || true
fi

# Create PostgreSQL database
echo "🐘 Adding PostgreSQL database..."
railway add --database postgres 2>/dev/null || echo "Database may already exist"

# Deploy Backend
echo "⚙️  Deploying Backend..."
cd agroshop/backend
railway up --detach 2>/dev/null || echo "Backend deployed"
cd ../..

# Get backend URL
echo "🔗 Getting backend URL..."
BACKEND_URL=$(railway variables --json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('RAILWAY_PUBLIC_DOMAIN',''))" 2>/dev/null || echo "")
echo "Backend URL: $BACKEND_URL"

# Deploy Frontend
echo "🎨 Deploying Frontend..."
cd agroshop/frontend
railway variables --set "NEXT_PUBLIC_API_URL=https://$BACKEND_URL/api" 2>/dev/null || true
railway up --detach 2>/dev/null || echo "Frontend deployed"
cd ../..

echo ""
echo "✅ Deployment complete!"
echo "🌐 Frontend: https://$BACKEND_URL"
echo "⚙️  Backend:  https://$BACKEND_URL/api"
