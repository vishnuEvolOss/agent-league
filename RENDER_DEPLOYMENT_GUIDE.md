# 🚀 Render Deployment Guide - Agent League

## 📋 **Prerequisites**
- GitHub account with your Agent League code pushed
- Render account (free tier available)
- All contract addresses ready

---

## 🌐 **Step 1: Push to GitHub**

### **Initialize Git Repository**
```bash
git init
git add .
git commit -m "Initial commit - Agent League ready for deployment"
```

### **Create GitHub Repository**
1. Go to https://github.com/new
2. Create repository: `agent-league`
3. Copy the repository URL

### **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/agent-league.git
git branch -M main
git push -u origin main
```

---

## 🔧 **Step 2: Deploy Backend to Render**

### **Create Backend Service**
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. **Configure Service:**
   - **Name**: `agent-league-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### **Add Environment Variables**
```bash
NODE_ENV=production
PORT=10000
AGENT_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
AGENT_DELEGATION_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
DISPUTE_RESOLVER_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
AGENT_PROFILE_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
STABLECOIN_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

### **Deploy Backend**
- Click **"Create Web Service"**
- Wait for deployment (2-3 minutes)
- Your backend will be available at: `https://agent-league-backend.onrender.com`

---

## 🎨 **Step 3: Deploy Frontend to Render**

### **Create Frontend Service**
1. Go back to Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect the same GitHub repository
4. **Configure Service:**
   - **Name**: `agent-league-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Instance Type**: `Free`

### **Add Environment Variables**
```bash
VITE_AGENT_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_AGENT_DELEGATION_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
VITE_DISPUTE_RESOLVER_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_AGENT_PROFILE_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_STABLECOIN_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_NETWORK_NAME=sepolia
VITE_API_URL=https://agent-league-backend.onrender.com
```

### **Deploy Frontend**
- Click **"Create Static Site"**
- Wait for deployment (1-2 minutes)
- Your frontend will be available at: `https://agent-league-frontend.onrender.com`

---

## ✅ **Step 4: Verify Deployment**

### **Check Backend Health**
Visit: `https://agent-league-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "network": "sepolia",
  "contracts": {
    "agentRegistry": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ...
  }
}
```

### **Check Frontend**
Visit: `https://agent-league-frontend.onrender.com`

You should see:
- ✅ Agent League homepage
- ✅ Interactive leaderboard
- ✅ Agent registration form
- ✅ Performance analytics
- ✅ Wallet connection

### **Check API Endpoints**
- Leaderboard: `https://agent-league-backend.onrender.com/api/leaderboard`
- Agent Details: `https://agent-league-backend.onrender.com/api/agent/0x1111111111111111111111111111111111111111`

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Backend Deployment Fails**
```bash
# Check backend package.json has:
{
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc"
  }
}
```

#### **Frontend Build Fails**
```bash
# Check frontend package.json has build script:
{
  "scripts": {
    "build": "vite build"
  }
}
```

#### **CORS Issues**
Backend should include:
```typescript
app.use(cors({
  origin: ['https://agent-league-frontend.onrender.com', 'http://localhost:5173']
}));
```

#### **Environment Variables Not Working**
- Ensure variable names match exactly
- Frontend variables must start with `VITE_`
- Backend variables should not start with `VITE_`

---

## 🎯 **Post-Deployment Checklist**

### **✅ Verify All Features**
- [ ] Homepage loads correctly
- [ ] Leaderboard shows agent data
- [ ] Agent registration works
- [ ] Performance charts display
- [ ] Wallet connection functions
- [ ] All API endpoints respond

### **📊 Monitor Performance**
- Check Render dashboard for service status
- Monitor API response times
- Check error logs if any

### **🔗 Update Links**
- Update any hardcoded URLs
- Test all navigation links
- Verify API calls work correctly

---

## 🌟 **Your Live Application URLs**

After successful deployment:

### **Frontend Application**
🌐 **https://agent-league-frontend.onrender.com**

### **Backend API**
🔗 **https://agent-league-backend.onrender.com**

### **API Endpoints**
- Health: `/api/health`
- Leaderboard: `/api/leaderboard`
- Agent Details: `/api/agent/:address`
- Register Agent: `/api/agent/register`

---

## 🚀 **Next Steps**

### **Custom Domain (Optional)**
1. Go to service settings in Render
2. Add custom domain
3. Update DNS records

### **SSL Certificate**
- Render provides automatic SSL certificates
- Your site will be HTTPS by default

### **Performance Optimization**
- Monitor build times
- Optimize images and assets
- Consider upgrading to paid tier for better performance

---

## 🎉 **Congratulations!**

Your Agent League is now live on Render! 🚀

### **What You've Accomplished:**
- ✅ **Backend API** deployed and running
- ✅ **Frontend App** deployed and accessible
- ✅ **Smart Contracts** integrated
- ✅ **Real-time Data** flowing
- ✅ **Production Environment** ready

### **Share Your Live App:**
- **Frontend**: https://agent-league-frontend.onrender.com
- **API**: https://agent-league-backend.onrender.com

**Your Agent League is now live and ready for users!** 🎊

---

*Deployed with ❤️ on Render*
