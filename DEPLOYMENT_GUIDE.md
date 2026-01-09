# Projexa Production - Deployment Guide for Hostinger

## Prerequisites

Before deploying to Hostinger, ensure you have:

- Hostinger account with cPanel access
- MySQL database created
- Node.js 18+ support (check with Hostinger)
- SSH access to your server
- Domain name configured

## Step 1: Prepare Your Environment

### 1.1 Create Environment File

Create a `.env` file in your project root with the following variables:

```
# Database
DATABASE_URL=mysql://username:password@localhost:3306/projexa_production

# JWT & Auth
JWT_SECRET=your-secure-random-string-here
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# Owner Info
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# Forge API
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=Projexa Store

# Admin Settings
ADMIN_EMAIL=admin@yourdomain.com
VODAFONE_CASH_NUMBER=+20xxxxxxxxx
INSTAPAY_ACCOUNT=your-instapay-account

# Application
NODE_ENV=production
APP_URL=https://yourdomain.com
```

### 1.2 Build the Project

```bash
# Install dependencies
pnpm install

# Build frontend
pnpm build

# This creates dist/ folder with optimized production build
```

## Step 2: Prepare Database

### 2.1 Create MySQL Database

1. Log in to cPanel
2. Go to MySQL Databases
3. Create a new database (e.g., `projexa_production`)
4. Create a new MySQL user with strong password
5. Assign user to database with all privileges

### 2.2 Run Migrations

```bash
# Generate and run migrations
pnpm db:push

# This creates all tables in your Hostinger database
```

## Step 3: Upload to Hostinger

### 3.1 Using cPanel File Manager

1. Log in to cPanel
2. Go to File Manager
3. Navigate to `public_html` directory
4. Upload the following:
   - `dist/` folder contents (frontend build)
   - `server/` folder (backend code)
   - `.htaccess` file (security rules)
   - `package.json` and `pnpm-lock.yaml`

### 3.2 Using SSH (Recommended)

```bash
# Connect to your server
ssh username@yourdomain.com

# Navigate to public_html
cd public_html

# Upload files using rsync or SCP
rsync -avz ./dist/ username@yourdomain.com:~/public_html/
rsync -avz ./server/ username@yourdomain.com:~/public_html/server/
rsync -avz ./.htaccess username@yourdomain.com:~/public_html/

# Install dependencies on server
pnpm install --production
```

## Step 4: Configure Hostinger

### 4.1 Node.js Application Setup

1. In cPanel, go to Node.js Selector
2. Create a new application:
   - **Node.js version**: 18+ (or latest available)
   - **Application root**: `/public_html`
   - **Application URL**: `yourdomain.com`
   - **Application startup file**: `dist/index.js`
   - **Environment variables**: Add all from `.env` file

### 4.2 SSL Certificate

1. In cPanel, go to AutoSSL
2. Install free SSL certificate for your domain
3. Verify HTTPS is working

### 4.3 Proxy Configuration

1. In cPanel, go to Addon Domains or Parked Domains
2. Configure reverse proxy to Node.js application
3. Ensure all traffic routes to your Node.js app

## Step 5: Database Configuration

### 5.1 Update DATABASE_URL

In cPanel Node.js environment variables, set:

```
DATABASE_URL=mysql://username:password@localhost:3306/projexa_production
```

Replace with your actual MySQL credentials from Step 2.1

### 5.2 Test Database Connection

```bash
# SSH into server
ssh username@yourdomain.com

# Test connection
node -e "require('mysql2/promise').createConnection({host:'localhost',user:'dbuser',password:'dbpass',database:'projexa_production'}).then(conn => console.log('Connected!')).catch(err => console.error('Error:', err.message))"
```

## Step 6: Email Configuration

### 6.1 Gmail SMTP Setup

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account Settings
   - Security → App Passwords
   - Select Mail and Windows Computer
   - Copy generated password

3. Update `.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

### 6.2 Alternative: Hostinger Email

If using Hostinger email:

```
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-email-password
```

## Step 7: Security Hardening

### 7.1 Verify Security Headers

Test your deployment with Nikto:

```bash
nikto -h https://yourdomain.com
```

### 7.2 Check .htaccess

Ensure `.htaccess` file is in place with security rules:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- HSTS enabled
- Directory listing disabled

### 7.3 Protect Sensitive Files

Ensure these files are NOT accessible:
- `.env` file
- `database.sql`
- `.git` folder
- `node_modules` folder

## Step 8: Testing

### 8.1 Test Frontend

1. Visit `https://yourdomain.com`
2. Verify all pages load correctly
3. Test responsive design on mobile

### 8.2 Test Backend APIs

```bash
# Test visitor tracking
curl -X POST https://yourdomain.com/api/trpc/visitors.track \
  -H "Content-Type: application/json" \
  -d '{"page":"/","userAgent":"test"}'

# Test products list
curl https://yourdomain.com/api/trpc/products.list

# Test orders creation
curl -X POST https://yourdomain.com/api/trpc/orders.create \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### 8.3 Test Email Notifications

1. Create a test order
2. Verify confirmation email is received
3. Check admin alert email

### 8.4 Test Payment Flow

1. Test Vodafone Cash payment display
2. Test InstaPay payment display
3. Verify payment reference generation

## Step 9: Monitoring & Maintenance

### 9.1 Monitor Logs

In cPanel:
1. Go to Error Log
2. Check for any errors
3. Monitor application performance

### 9.2 Database Backups

1. In cPanel, go to MySQL Backups
2. Configure automatic daily backups
3. Download backups regularly

### 9.3 SSL Certificate Renewal

- AutoSSL automatically renews certificates
- Monitor renewal status in cPanel

## Troubleshooting

### Issue: Database Connection Error

**Solution:**
- Verify DATABASE_URL is correct
- Check MySQL user has proper permissions
- Ensure database exists

### Issue: Email Not Sending

**Solution:**
- Verify SMTP credentials
- Check firewall allows port 587
- Test with Gmail first, then switch providers
- Check email logs in cPanel

### Issue: Static Files Not Loading

**Solution:**
- Verify `.htaccess` file is present
- Check file permissions (644 for files, 755 for directories)
- Ensure `dist/` folder is uploaded completely

### Issue: API Endpoints Not Working

**Solution:**
- Check Node.js application is running in cPanel
- Verify environment variables are set
- Check application logs in cPanel
- Ensure reverse proxy is configured

## Performance Optimization

### 1. Enable Gzip Compression

Already configured in `.htaccess`:
```
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 2. Set Cache Headers

Already configured in `.htaccess` for static assets

### 3. Database Optimization

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customerEmail);
CREATE INDEX idx_visitors_page ON visitors(page);
CREATE INDEX idx_payments_reference ON payments(reference);
```

### 4. Monitor Performance

- Use Hostinger's performance monitoring
- Check server CPU and memory usage
- Monitor database query performance

## Support & Resources

- **Hostinger Documentation**: https://support.hostinger.com
- **Node.js on Hostinger**: https://support.hostinger.com/en/articles/4291348-how-to-deploy-a-node-js-application
- **MySQL Documentation**: https://dev.mysql.com/doc
- **Security Best Practices**: https://owasp.org/www-project-top-ten

## Post-Deployment Checklist

- [ ] Database created and migrations run
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Node.js application running
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Email notifications working
- [ ] Payment methods displaying
- [ ] Admin dashboard accessible
- [ ] Security headers verified
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Domain DNS configured
- [ ] HTTPS redirects working
- [ ] Performance optimized

## Rollback Plan

If deployment fails:

1. Revert to previous version in cPanel
2. Restore database from backup
3. Check error logs for issues
4. Contact Hostinger support if needed

## Next Steps

After successful deployment:

1. Monitor application for 24 hours
2. Test all features thoroughly
3. Gather user feedback
4. Plan for scaling if needed
5. Set up automated backups and monitoring
