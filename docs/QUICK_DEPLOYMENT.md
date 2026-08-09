# Quick Start Deployment Guide

Get DevGraph online in 5 minutes!

## 🚀 Fastest Path: Vercel Deployment

### Step 1: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Initial commit: DevGraph ready for production"
git push origin main
```

### Step 2: Connect Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 3: Add Environment Variables (1 minute)

In Vercel dashboard:

1. Go to **Settings > Environment Variables**
2. Add these three variables:

| Key | Value |
|-----|-------|
| `COGNODB_URI` | `bolt+s://<your-db-id>.databases.cognodb.com` |
| `COGNODB_USERNAME` | `cognodb` |
| `COGNODB_PASSWORD` | Your database password |

3. Click **"Save"**

### Step 4: Deploy (1 minute)

1. Click **"Deploy"** button
2. Wait for build (30-60 seconds)
3. Your app is live! 🎉

**Your deployment URL:**
```
https://<project-name>.vercel.app
```

---

## 🌍 Database Setup (CognoDB)

### If you don't have CognoDB yet:

1. **Sign Up**: https://console.cognodb.com
2. **Create Database**:
   - Click "New Database"
   - Select your region
   - Name: `cognodb-demo` (or your choice)
3. **Copy Credentials**:
   - Connection String: `bolt+s://<id>.databases.cognodb.com`
   - Username: `cognodb`
   - Generate/set password
4. **Seed Database**:
   ```bash
   npm run seed
   ```

---

## 🎯 Alternative Hosting (Pick One)

### Railway.app (Easiest Alternative)
```bash
# 1. Sign up: https://railway.app
# 2. Create new project
# 3. Connect GitHub repo
# 4. Add env vars in dashboard
# 5. Deploy!
# Your URL: https://<service-name>.railway.app
```

### Render.com (Good Free Tier)
```bash
# 1. Sign up: https://render.com
# 2. New > Web Service
# 3. Connect GitHub
# 4. Build: npm install && npm run build
# 5. Start: npm start
# 6. Add environment variables
# Your URL: https://<service-name>.onrender.com
```

### Fly.io (Global Performance)
```bash
# 1. Install CLI: curl https://fly.io/install.sh | sh
# 2. Sign up: flyctl auth signup
# 3. Launch: flyctl launch
# 4. Set secrets: flyctl secrets set COGNODB_URI=...
# 5. Deploy: flyctl deploy
# Your URL: https://<app-name>.fly.dev
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] App loads at deployment URL
- [ ] Dashboard shows statistics
- [ ] Can search for developers
- [ ] Can view developer profiles
- [ ] Graph visualization loads
- [ ] No errors in browser console
- [ ] Mobile responsive

**If something fails:**
1. Check browser console (F12) for errors
2. Check deployment logs in dashboard
3. Verify environment variables are set
4. Try redeploying (push to main)

---

## 📹 Demo Video (Optional)

Create a 3-5 minute screen recording:

1. **Plan**: Follow guide in `docs/SCREEN_RECORDING_GUIDE.md`
2. **Record**: Use OBS or CapCut
3. **Upload**: To YouTube (unlisted) or Loom
4. **Share**: Add link to README

---

## 📊 Live Demo Links

After deployment, your links are:

```
Main App: https://<your-app-url>
GitHub: https://github.com/yourusername/cognodb-app
Database: https://console.cognodb.com
```

---

## 🔑 Key Files for Reference

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `docs/CYPHER_QUERIES.md` | Query explanations |
| `docs/DEPLOYMENT_GUIDE.md` | Full deployment guide |
| `docs/SCREEN_RECORDING_GUIDE.md` | Video recording help |
| `docs/SOURCE_CODE_REFERENCE.md` | Complete code reference |
| `.env.example` | Environment template |

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Verify `COGNODB_URI`, `COGNODB_USERNAME`, `COGNODB_PASSWORD`
- Check CognoDB dashboard - is database running?
- Redeploy after fixing variables

### "Dashboard shows 0 statistics"
- Run: `npm run seed` locally
- Or access `/api/stats` in browser to see errors

### "Build fails on Vercel"
- Check build logs in Vercel dashboard
- Ensure Node.js version >= 18
- Try: `npm ci && npm run build` locally

### "Graph page is slow"
- First load takes longer (initial connection)
- Check browser DevTools Network tab
- Reduce LIMIT in `lib/queries/graph.ts` if needed

---

## 📈 Next Steps (After Deployment)

1. **Get feedback**: Share URL with team
2. **Monitor**: Check deployment dashboard weekly
3. **Add custom domain**: Follow DEPLOYMENT_GUIDE.md
4. **Enhance UI**: Take screenshots for README
5. **Record demo**: Create 5-minute video
6. **Document findings**: Add to organization wiki

---

## 💡 Pro Tips

✅ **Auto-deploy on commit**: Every push to main = instant deployment  
✅ **Preview URLs**: Create feature branches for testing  
✅ **Database backup**: CognoDB has automatic backups  
✅ **SSL/HTTPS**: Free, automatic on Vercel/Railway/Render  
✅ **Monitoring**: Check deployment logs weekly  

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Neo4j Docs**: https://neo4j.com/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **CognoDB Docs**: https://docs.cognodb.com

---

**That's it! Your DevGraph is now live! 🚀**

Share the URL and invite your team to explore!

For detailed setup instructions, see the main [README.md](../README.md).
