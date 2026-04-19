# ROCK Deployment Guide

Complete guide for deploying ROCK to production on Manus hosting platform.

## Prerequisites

- Manus account with hosting enabled
- MySQL/TiDB database (provided by Manus)
- S3-compatible storage (optional but recommended)
- Custom domain (optional)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`pnpm test`)
- [ ] No TypeScript errors (`pnpm check`)
- [ ] Code formatted (`pnpm format`)
- [ ] All features tested locally
- [ ] No console errors in browser

### Configuration
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] S3 credentials set (if using media)
- [ ] OAuth app configured
- [ ] CORS origins set correctly

### Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Known limitations documented
- [ ] Roadmap defined

## Deployment Steps

### 1. Create Checkpoint

In the Manus Management UI:
1. Navigate to your project
2. Click "Dashboard" tab
3. Click "Create Checkpoint"
4. Add descriptive message
5. Wait for checkpoint to complete

### 2. Publish Application

1. Click "Publish" button (appears after checkpoint)
2. Review deployment summary
3. Confirm deployment
4. Wait for build and deployment to complete (~2-5 minutes)

### 3. Verify Deployment

```bash
# Check deployment status
curl https://your-app.manus.space/health

# Test API endpoints
curl https://your-app.manus.space/api/trpc/auth.me

# Check logs
# Available in Management UI → Dashboard → Logs
```

### 4. Configure Custom Domain (Optional)

1. In Management UI, go to Settings → Domains
2. Click "Add Custom Domain"
3. Enter your domain
4. Follow DNS configuration steps
5. Wait for SSL certificate (5-15 minutes)

## Environment Variables

Set these in the Management UI or via CLI:

```
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key-min-32-chars
VITE_APP_ID=your-manus-oauth-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Storage (if using S3)
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# App Configuration
VITE_APP_TITLE=ROCK
VITE_APP_LOGO=https://your-cdn.com/rock-logo.png
```

## Post-Deployment

### 1. Test All Features

- [ ] User registration and login
- [ ] Sending messages
- [ ] Creating feed posts
- [ ] Uploading stories
- [ ] Making friend requests
- [ ] Notifications working
- [ ] Search functionality
- [ ] Media uploads (if enabled)

### 2. Monitor Performance

```bash
# Check server health
curl https://your-app.manus.space/api/health

# View logs
# Management UI → Dashboard → Logs

# Check database connection
# Management UI → Database → Connection Status
```

### 3. Set Up Monitoring

In Management UI:
1. Go to Settings → Notifications
2. Enable error notifications
3. Set alert email
4. Configure alert thresholds

### 4. Configure Backups

1. Go to Settings → Database
2. Enable automated backups
3. Set backup frequency (daily recommended)
4. Set retention period (30 days recommended)

## Scaling Considerations

### Database
- Monitor query performance
- Add indexes for slow queries
- Consider read replicas for high traffic
- Enable connection pooling

### Storage
- Use S3 for media files (not database)
- Implement CDN for static assets
- Set up image compression
- Configure S3 lifecycle policies

### Application
- Enable caching headers
- Implement rate limiting
- Use code splitting for large bundles
- Monitor memory usage

## Troubleshooting

### Application Won't Start

1. Check logs in Management UI
2. Verify environment variables are set
3. Ensure database is accessible
4. Check Node.js version compatibility

```bash
# View recent logs
tail -f .manus-logs/devserver.log
```

### Database Connection Issues

1. Verify DATABASE_URL is correct
2. Check database is running
3. Ensure credentials are valid
4. Check network connectivity

```bash
# Test database connection
mysql -h host -u user -p -e "SELECT 1"
```

### High Memory Usage

1. Check for memory leaks in logs
2. Restart application
3. Increase server resources
4. Optimize database queries

### Slow Response Times

1. Check database query performance
2. Enable caching
3. Optimize API endpoints
4. Check server resources

## Rollback Procedure

If deployment causes issues:

1. In Management UI, go to Dashboard
2. Find previous checkpoint
3. Click "Rollback"
4. Confirm rollback
5. Wait for rollback to complete

```bash
# Verify rollback
curl https://your-app.manus.space/api/health
```

## Monitoring & Maintenance

### Daily Tasks
- Check error logs
- Monitor database size
- Verify backups completed

### Weekly Tasks
- Review performance metrics
- Check for security updates
- Test critical features

### Monthly Tasks
- Review database optimization
- Analyze user metrics
- Plan capacity upgrades
- Update dependencies

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (Drizzle ORM)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Secrets not in code
- [ ] Database credentials rotated
- [ ] S3 access keys rotated
- [ ] OAuth app secret secure

## Performance Targets

- **Page Load**: < 2 seconds
- **API Response**: < 200ms (p95)
- **Database Query**: < 100ms (p95)
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

## Support

For deployment issues:
1. Check logs in Management UI
2. Review this guide
3. Contact Manus support
4. Check status page

---

**Last Updated**: April 2026  
**Version**: 1.0.0
