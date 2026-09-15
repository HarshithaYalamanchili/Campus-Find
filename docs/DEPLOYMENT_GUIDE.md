# 🚀 Complete Deployment Guide: Render (Backend) + Vercel (Frontend)

Follow this step-by-step guide to deploy **CampusFind** permanently to **Render** and **Vercel** with free hosting.

---

## 📌 Step 1: Push Your Code to GitHub

1. Open your browser and go to [github.com/new](https://github.com/new).
2. Create a repository named `CampusFind` (leave it Public or Private).
3. Open your terminal in the project directory:
   ```bash
   cd "C:\Users\Yalamanchili\.gemini\antigravity\scratch\CampusFind"
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/CampusFind.git
   git branch -M main
   git push -u origin main
   ```

---

## 🖥️ Step 2: Deploy Backend to Render (Free Web Service)

1. Go to **[render.com](https://render.com)** and log in with GitHub.
2. Click **New +** → Select **Web Service**.
3. Choose your repository: **`CampusFind`**.
4. Configure the settings:
   - **Name**: `campusfind-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: `Free`
5. Click **Advanced** / **Environment Variables** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `JWT_SECRET` | `your_secret_random_key_123` | Any secure random string |
   | `MONGODB_URI` | `mongodb+srv://...` | Free cluster URI from [MongoDB Atlas](https://www.mongodb.com/atlas) (or leave blank for auto in-memory dev) |
   | `CLOUDINARY_CLOUD_NAME` | *(Optional)* | Cloudinary cloud name for images |
   | `CLOUDINARY_API_KEY` | *(Optional)* | Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | *(Optional)* | Cloudinary API secret |
6. Click **Create Web Service**.
7. Once deployed, copy your Render backend URL (e.g. `https://campusfind-api.onrender.com`).

---

## 🌐 Step 3: Deploy Frontend to Vercel (Free)

1. Go to **[vercel.com](https://vercel.com)** and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your **`CampusFind`** repository.
4. Under **Project Configuration**:
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Framework Preset**: `Vite` (auto-detected).
   - **Build Command**: `npm run build` (auto-detected).
   - **Output Directory**: `dist` (auto-detected).
5. Open **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://campusfind-api.onrender.com` *(Your Render backend URL from Step 2)* |
6. Click **Deploy**.
7. Vercel will build and assign you a fast, global production URL (e.g., `https://campusfind.vercel.app`)!

---

## ⚡ Optional: 1-Click All-in-One Deployment on Render

If you prefer deploying the entire app (Frontend + Backend) onto a single free Render Web Service:
1. In Render, select the root `CampusFind` repository.
2. **Root Directory**: *(leave blank)*
3. **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
4. **Start Command**: `cd backend && node src/server.js`
5. The unified Express server will serve both the React frontend and the REST API at the same domain!
