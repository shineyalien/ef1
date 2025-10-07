# 🚀 Easy Filer v3 - Coolify Deployment Guide

## 📋 Prerequisites

1. **Coolify Account**: Sign up at [coolify.io](https://coolify.io)
2. **GitHub Repository**: Your code is already uploaded to `https://github.com/shineyalien/ef1.git`
3. **Database**: PostgreSQL database (recommended: Supabase, Railway, or Coolify's built-in PostgreSQL)

## 🔧 Step 1: Coolify Setup

### 1.1 Connect GitHub to Coolify
1. Login to your Coolify dashboard
2. Go to **Settings** → **Git Providers**
3. Click **Connect GitHub** and authorize access
4. Select your `ef1` repository

### 1.2 Create New Application
1. Click **New Application** → **From Git**
2. Select your `ef1` repository
3. Choose **Next.js** as the framework preset

## 🔧 Step 2: Application Configuration

### 2.1 Basic Settings
```yaml
Name: easy-filer-v3
Branch: main
Build Path: apps/web
Build Command: npm run build
Start Command: npm start
```

### 2.2 Environment Variables
Set these in Coolify dashboard:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://your-domain.coolify.app
NEXTAUTH_SECRET=your-secret-key-here

# FBR Integration (Optional)
FBR_SANDBOX_USERNAME=your-fbr-sandbox-username
FBR_SANDBOX_PASSWORD=your-fbr-sandbox-password
FBR_PRODUCTION_USERNAME=your-fbr-production-username
FBR_PRODUCTION_PASSWORD=your-fbr-production-password

# File Upload
UPLOAD_DIR=/tmp/uploads
```

### 2.3 Generate NEXTAUTH_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔧 Step 3: Database Setup

### 3.1 PostgreSQL Database
Create a PostgreSQL database and get the connection string.

### 3.2 Run Migrations
After deployment, run database migrations:

```bash
# In Coolify console or SSH
cd /app
npx prisma migrate deploy
npx prisma generate
```

## 🔧 Step 4: Deploy

### 4.1 Automatic Deployment
1. Push changes to GitHub main branch
2. Coolify will automatically build and deploy

### 4.2 Manual Deployment
1. Go to your application in Coolify
2. Click **Deploy** → **Deploy Now**

## 🔧 Step 5: Post-Deployment

### 5.1 Verify Deployment
- Check that the application loads
- Test authentication flow
- Verify database connectivity

### 5.2 Seed Initial Data (Optional)
```bash
# In Coolify console
npx prisma db seed
```

## 🐳 Docker Alternative

If you prefer Docker deployment, use the provided `docker-compose.yml`:

```bash
# Build and run with Docker
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

## 🔍 Troubleshooting

### Common Issues

**Build Fails**:
- Check `package.json` scripts
- Verify Node.js version (18+ recommended)
- Check environment variables

**Database Connection**:
- Verify `DATABASE_URL` format
- Check database accessibility
- Run `npx prisma migrate deploy`

**Authentication Issues**:
- Ensure `NEXTAUTH_URL` matches deployed URL
- Verify `NEXTAUTH_SECRET` is set
- Check callback URLs in OAuth providers

### Logs and Debugging
- Check Coolify application logs
- Use `npx prisma studio` for database inspection
- Monitor build process in Coolify dashboard

## 📱 PWA Features

Your deployed application includes:
- Offline support
- Installable PWA
- Responsive design
- Service worker for caching

## 🔒 Security Notes

- Change default passwords
- Use HTTPS (automatic with Coolify)
- Regularly update dependencies
- Monitor FBR API credentials

## 📞 Support

For issues:
1. Check Coolify documentation
2. Review application logs
3. Verify environment variables
4. Test database connectivity

---

**Your Easy Filer v3 is now ready for production! 🎉**