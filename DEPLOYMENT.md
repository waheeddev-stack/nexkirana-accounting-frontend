# NexKirana Accounting Frontend - Deployment Guide

## 🚀 Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository
- Backend API deployed and running

### Step 1: Configure Environment

Create `.env.production`:
```env
VITE_API_URL=https://your-backend-api.vercel.app/api
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set Framework Preset to "Vite"
5. Configure environment variables
6. Deploy

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod

# Set environment variables
vercel env add VITE_API_URL
```

### Step 3: Configure Build Settings

Vercel should auto-detect Vite, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Test Deployment

1. Access your deployed frontend
2. Test login functionality
3. Verify API connectivity
4. Test all features

## 🔧 Environment Variables

Set in Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.vercel.app/api` |

## 📊 Post-Deployment

1. **Test Authentication**
2. **Verify API Calls**
3. **Test All Features**
4. **Check Responsive Design**

## 🐛 Troubleshooting

- Check browser console for errors
- Verify API URL is correct
- Test API connectivity
- Check CORS settings on backend