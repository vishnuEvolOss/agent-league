# 🚀 GitHub Setup & Deployment Guide

## 📋 **Pre-Push Checklist**

### ✅ **Security Cleaned**
- [x] Removed all `.env` files with real secrets
- [x] Removed deployment JSON files
- [x] Removed monitoring and audit files
- [x] Removed build artifacts
- [x] Private keys replaced with placeholders

### ✅ **Files Ready for GitHub**
- [x] Source code (contracts, backend, frontend)
- [x] Configuration templates (`.env.example`, `.env.template`)
- [x] Documentation (README, guides)
- [x] Build scripts and deployment configs
- [x] Package.json files with proper dependencies

---

## 🔧 **Step 1: Initialize Git Repository**

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Agent League ready for deployment"
```

---

## 🌐 **Step 2: Create GitHub Repository**

1. **Go to**: https://github.com/new
2. **Repository name**: `agent-league`
3. **Description**: `On-chain AI Agent Performance League for Mantle L2`
4. **Visibility**: Public (or Private if preferred)
5. **Don't initialize with README** (we already have one)
6. **Click "Create repository"**

---

## 📤 **Step 3: Push to GitHub**

```bash
# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/agent-league.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔒 **Step 4: Configure GitHub Secrets**

For Render deployment, you can store sensitive values in GitHub Secrets:

### **Repository Settings → Secrets and variables → Actions**

Add these secrets:
```bash
# Backend Secrets
PRIVATE_KEY=your_actual_private_key
RPC_URL=your_actual_rpc_url
ETHERSCAN_API_KEY=your_etherscan_api_key

# Contract Addresses
AGENT_REGISTRY_ADDRESS=your_deployed_address
AGENT_DELEGATION_ADDRESS=your_deployed_address
DISPUTE_RESOLVER_ADDRESS=your_deployed_address
AGENT_PROFILE_NFT_ADDRESS=your_deployed_address
STABLECOIN_ADDRESS=your_deployed_address
```

---

## 🚀 **Step 5: Deploy to Render**

### **Backend Deployment**
1. Go to https://dashboard.render.com/
2. **New Web Service** → Connect GitHub
3. **Settings**:
   ```
   Name: agent-league-backend
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

### **Frontend Deployment**
1. **New Static Site** → Connect GitHub
2. **Settings**:
   ```
   Name: agent-league-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   Instance Type: Free
   ```

---

## 📋 **Environment Variables for Render**

### **Backend Variables**
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

### **Frontend Variables**
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

---

## ✅ **Post-Push Verification**

### **Check Your Repository**
- [ ] All source code is visible
- [ ] No sensitive files in repository
- [ ] README.md displays correctly
- [ ] Documentation is accessible

### **Test Local Setup**
After pushing, test locally:
```bash
# Create .env.local from template
cp .env.example .env.local

# Fill in your actual values
# Start backend
npm run backend:start

# Start frontend
npm run frontend
```

---

## 🌟 **Your GitHub Repository Will Contain**

### **✅ Safe to Commit**
- Source code (contracts, backend, frontend)
- Configuration templates
- Documentation and guides
- Build scripts and deployment configs
- Package.json files
- README and documentation

### **❌ Never Committed**
- `.env` files with real secrets
- Private keys
- Deployment JSON files
- Monitoring reports
- Build artifacts
- Security audit files

---

## 🎯 **Quick Commands**

```bash
# After initial setup, for future updates:
git add .
git commit -m "Your commit message"
git push origin main

# To check status:
git status
git log --oneline

# To pull changes:
git pull origin main
```

---

## 🎉 **Ready to Deploy!**

Your repository is now clean, secure, and ready for deployment to Render!

### **Next Steps:**
1. **Push to GitHub** using the commands above
2. **Deploy to Render** following the Render guide
3. **Test your live application**
4. **Share your amazing Agent League!**

**🚀 Your Agent League is ready for the world!**
