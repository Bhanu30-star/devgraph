# Deployment Guide

Complete instructions for deploying DevGraph to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment (Recommended)](#vercel-deployment)
3. [Alternative Hosting Platforms](#alternative-hosting)
4. [Custom Domain Setup](#custom-domain)
5. [Monitoring & Troubleshooting](#monitoring)
6. [Production Best Practices](#best-practices)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account (for CI/CD)
- ✅ CognoDB or Neo4j instance running
- ✅ Database credentials (URI, username, password)
- ✅ Node.js v18+ installed locally
- ✅ Application tested locally with `npm run dev`

---

## Vercel Deployment (Recommended)

Vercel is the optimal platform for Next.js applications. It's free, fast, and provides automatic optimizations.

### Step 1: Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (or log in)
2. Click **"New Project"**
3. Click **"Import Project"** and select your GitHub repository
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

In the Vercel dashboard, go to **Settings > Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `COGNODB_URI` | `bolt+s://<your-db-id>.databases.cognodb.com` |
| `COGNODB_USERNAME` | `cognodb` |
| `COGNODB_PASSWORD` | Your secure password |

⚠️ **Important**: These variables are encrypted and never exposed in client bundles.

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (typically 30-60 seconds)
3. Vercel provides a preview URL automatically
4. Set as production when ready

**Your app is now live!** 🎉

**Access your application:**
```
https://<your-project-name>.vercel.app
```

### Step 5: Configure Auto-Deployments

Every push to `main` automatically triggers a new deployment:

```bash
git commit -am "Feature update"
git push origin main
# Vercel automatically deploys!
```

For staging deployments:
- Push to a different branch (e.g., `develop`)
- Vercel creates preview URLs for testing
- Merge to `main` for production deployment

---

## Alternative Hosting Platforms

### Railway (Railway.app)

Simple and developer-friendly with generous free tier.

**Advantages:**
- $5 free credit/month (sufficient for this app)
- Git integration: Auto-deploy on push
- Built-in environment variables UI
- PostgreSQL/MongoDB included if needed

**Steps:**

1. Sign up at [railway.app](https://railway.app)
2. Click **"New Project" > "Deploy from GitHub"**
3. Connect your repository
4. Railway auto-detects Next.js
5. Add environment variables:
   - Go to **Project > Variables**
   - Add `COGNODB_*` variables
6. Deploy!

**Access your app:**
```
https://<railway-generated-url>.railway.app
```

### Render.com

Reliable with good uptime SLA.

**Advantages:**
- Free tier with automatic sleep after 15 min of inactivity
- Native Next.js support
- Environment variables easy to manage
- Disk persistence available

**Steps:**

1. Sign up at [render.com](https://render.com)
2. Click **"New >" > "Web Service"**
3. Connect GitHub repository
4. Set Build Command: `npm install && npm run build`
5. Set Start Command: `npm start`
6. Add environment variables under "Advanced"
7. Deploy!

**Access your app:**
```
https://<your-service-name>.onrender.com
```

### Fly.io

Global edge deployment with excellent performance.

**Advantages:**
- Free tier: 3 shared-cpu-1x VMs
- Global Anycast network (fast worldwide)
- Persistent storage available
- Deploy via CLI

**Steps:**

1. Install Fly CLI: `curl https://fly.io/install.sh | sh`
2. Sign up: `flyctl auth signup`
3. Create app: `flyctl launch` (in project root)
4. Follow prompts (select a region near your database)
5. Set secrets:
   ```bash
   flyctl secrets set COGNODB_URI=bolt+s://...
   flyctl secrets set COGNODB_USERNAME=cognodb
   flyctl secrets set COGNODB_PASSWORD=...
   ```
6. Deploy: `flyctl deploy`

**Access your app:**
```
https://<app-name>.fly.dev
```

---

## Custom Domain Setup

### Vercel with Custom Domain

1. In Vercel dashboard, go to **Settings > Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `devgraph.com`)
4. Vercel shows DNS configuration needed

**Option A: Change Domain Nameservers** (Recommended)
- Go to your domain registrar (GoDaddy, Namecheap, etc.)
- Update nameservers to Vercel's:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
- Wait 12-24 hours for propagation
- Vercel auto-provisions SSL certificate

**Option B: Add CNAME Record** (Faster)
- Keep current nameservers
- Add CNAME record:
  - Name: `www`
  - Value: `cname.vercel-dns.com`
- SSL certificate auto-provisioned in ~5 minutes

### Railway with Custom Domain

1. In Railway dashboard, go to **Project > Settings > Domains**
2. Click **"Add Domain"**
3. Enter your domain
4. Railway shows CNAME record to add:
   - `Name`: Your domain (or `www` subdomain)
   - `Value`: `<railway-domain>.railway.app`
5. Add to your domain registrar's DNS
6. Wait for propagation (typically 5-30 minutes)

---

## Monitoring & Troubleshooting

### Vercel Monitoring

**Built-in Dashboard:**
- Go to Vercel project dashboard
- **Deployments** tab: See all deploys and build logs
- **Analytics** tab: Real-time traffic and performance
- **Functions** tab: API route execution metrics

**View Logs:**
```bash
vercel logs <your-project-name>
```

### Common Issues & Solutions

#### Issue: "Neo4j credentials are not set"

**Solution:**
1. Verify environment variables in dashboard:
   - Vercel: Settings > Environment Variables
   - Railway: Project > Variables
   - Render: Environment
2. Redeploy after adding variables:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

#### Issue: Database connection timeout

**Solution:**
1. Check database is accessible from deployment region
2. Verify firewall allows connections from hosting provider's IP range
3. Check credentials are correct
4. Increase connection timeout in `lib/neo4j.ts`:
   ```typescript
   driver = neo4j.driver(uri, auth, {
     connectionTimeout: 10000, // 10 seconds
     maxConnectionLifetime: 3600000, // 1 hour
   });
   ```

#### Issue: Slow page loads (> 3 seconds)

**Solutions:**
1. **Add database query caching** (Redis):
   ```typescript
   const cacheKey = `dev-${id}`;
   const cached = await redis.get(cacheKey);
   if (cached) return cached;
   // ... fetch from database
   await redis.set(cacheKey, result, 'EX', 3600); // 1 hour TTL
   ```

2. **Pre-fetch dashboard statistics**:
   ```typescript
   // Run every 5 minutes via cron job
   export const revalidate = 300; // ISR: 5 minutes
   ```

3. **Limit graph data**:
   ```cypher
   MATCH (n) LIMIT 100  -- Reduce from 150 if still slow
   ```

#### Issue: Seed script fails in production

**Solution:**
1. Seed only during initial deployment, not on every build
2. Create separate seeding endpoint:
   ```bash
   curl https://your-app.vercel.app/api/admin/seed \
     -H "Authorization: Bearer SECRET_TOKEN"
   ```

---

## Production Best Practices

### 1. Security

**Never commit secrets:**
```bash
# Ensure .env.local is in .gitignore
echo ".env.local" >> .gitignore
```

**Use strong passwords:**
- Database password: 20+ characters, random
- API keys: Rotate every 30 days

**Enable HTTPS:**
- All platforms provide free SSL certificates
- Always use HTTPS (never HTTP in production)

**Rate limiting:**
```typescript
// pages/api/developers/route.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export const GET = limiter(async (req) => {
  // ... your handler
});
```

### 2. Performance Optimization

**Enable Response Caching:**
```typescript
// pages/api/stats/route.ts
export const revalidate = 60; // ISR: Revalidate every 60 seconds
```

**Compress responses:**
```typescript
// next.config.ts
module.exports = {
  compress: true, // Default: true
};
```

**Image optimization:**
- Use Next.js Image component
- Avatars already use external URLs

### 3. Monitoring & Logging

**Set up error tracking (Sentry):**
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Database connection monitoring:**
```typescript
// lib/neo4j.ts
driver.onNotification((notification) => {
  console.log('Neo4j notification:', notification);
  // Send to monitoring service
});
```

### 4. Backup Strategy

**Database backups:**
- CognoDB: Automatic backups (check console settings)
- Neo4j Aura: Built-in automated backups
- Local Neo4j: Export data regularly:
  ```bash
  cypher-shell -u neo4j -p password \
    "MATCH (n) RETURN n" > backup.json
  ```

**Application backups:**
- GitHub stores all code history
- Vercel stores all deployments
- No action needed for static files

### 5. Scaling Considerations

For when your app grows:

**Database scaling:**
- Upgrade CognoDB instance type
- Add read replicas for heavy read workloads
- Implement query result caching (Redis)

**Application scaling:**
- Vercel auto-scales: No action needed
- Railway: Increase CPU/RAM in dashboard
- Fly.io: Scale with `flyctl scale`

**Search optimization:**
- Add full-text search indexes:
  ```cypher
  CREATE FULLTEXT INDEX dev_search FOR (d:Developer) ON EACH [d.name, d.bio]
  ```

### 6. Maintenance Tasks

**Weekly:**
- Monitor error rates in Vercel dashboard
- Check database connection health
- Review access logs for suspicious activity

**Monthly:**
- Update dependencies: `npm update`
- Rotate API keys/passwords
- Review performance metrics
- Test disaster recovery procedures

**Quarterly:**
- Major dependency updates: `npm upgrade`
- Security audit: `npm audit`
- Database optimization: Run `ANALYZE` in Neo4j
- Capacity planning review

---

## Deployment Checklist

Before going live:

- [ ] Code tested locally with `npm run dev`
- [ ] All environment variables configured
- [ ] Database credentials verified working
- [ ] Seed script has run successfully (if needed)
- [ ] Error handling in place (404, 500 pages)
- [ ] Loading states implemented on all pages
- [ ] Mobile responsive design verified
- [ ] SEO metadata added
- [ ] SSL/HTTPS enabled
- [ ] Monitoring and alerting configured
- [ ] Rollback plan documented
- [ ] Team has access to deployment dashboard
- [ ] Automated backups enabled
- [ ] Custom domain configured (if applicable)

---

## Rollback Procedures

### Vercel Rollback

1. Go to Vercel dashboard > Deployments
2. Find the previous stable deployment
3. Click "..." menu and select "Promote to Production"
4. Click "Confirm" to revert

### Railway Rollback

1. Go to Railway dashboard > Deployments
2. Find previous deployment
3. Click "..." and select "Rollback to this deployment"

### Manual Rollback

```bash
# Go back to previous commit
git revert HEAD
git push origin main
# Deployment automatically triggers
```

---

## Monitoring URLs & Resources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Fly.io Dashboard**: https://fly.io/dashboard

---

## Getting Help

- **Vercel Support**: https://vercel.com/support
- **Neo4j Forum**: https://community.neo4j.com
- **Next.js Discord**: https://discord.gg/nextjs
- **Railway Community**: https://railway.app/community
