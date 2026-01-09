# Projexa Production - E-Commerce Platform

**Projexa** is a fully-featured, production-ready e-commerce platform built with React, Express, and MySQL. It includes visitor tracking, order management, local payment methods (Vodafone Cash & InstaPay), automated email notifications, and a comprehensive admin dashboard.

## Features

### 🛍️ Customer Features

- **Product Catalog**: Browse and view product details
- **Shopping Cart**: Add items to cart and manage quantities
- **Checkout Process**: Multi-step checkout with order confirmation
- **Local Payment Methods**: 
  - Vodafone Cash with payment instructions
  - InstaPay with account details
  - Manual payment option
- **Order Tracking**: View order status and history
- **Email Notifications**: Automatic confirmation and status update emails
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 📊 Analytics & Tracking

- **Visitor Tracking**: Track page visits and visitor statistics
- **Real-Time Analytics**: Dashboard showing visitor metrics
- **Order Analytics**: Track orders, revenue, and trends
- **Performance Monitoring**: Monitor system health and performance

### 🔐 Security Features

- **Security Headers**: X-Frame-Options, X-Content-Type-Options, HSTS
- **HTTPS Enforcement**: Automatic HTTPS redirect
- **Protected Sensitive Files**: `.env`, SQL files, and config files protected
- **SQL Injection Prevention**: Using parameterized queries with Drizzle ORM
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Token-based protection for state-changing operations

### 👨‍💼 Admin Dashboard

- **Order Management**: View, filter, and update order status
- **Product Management**: Add, edit, and delete products
- **User Management**: Manage customer accounts and roles
- **Analytics Dashboard**: View key metrics and statistics
- **Email Notifications**: Monitor email delivery status
- **System Settings**: Configure payment methods and email settings

### 📧 Email Notifications

- **Registration Confirmation**: Welcome email for new users
- **Order Confirmation**: Detailed order confirmation with items
- **Order Status Updates**: Notifications for order status changes
- **Admin Alerts**: New order notifications for administrators
- **Customizable Templates**: HTML email templates with branding

## Tech Stack

### Frontend
- **React 19**: Modern UI library
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **tRPC**: End-to-end type-safe APIs
- **Wouter**: Lightweight routing

### Backend
- **Express 4**: Lightweight web framework
- **Node.js 18+**: JavaScript runtime
- **tRPC 11**: Type-safe RPC framework
- **Drizzle ORM**: Type-safe database ORM

### Database
- **MySQL**: Relational database
- **Drizzle Kit**: Database migration tool

### Email
- **Nodemailer**: Email sending library
- **SMTP**: Email protocol

## Project Structure

```
projexa_production/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   │   ├── _headers          # Security headers for Netlify
│   │   └── index.html        # HTML template
│   └── src/
│       ├── pages/            # Page components
│       ├── components/       # Reusable components
│       ├── lib/              # Utilities and helpers
│       ├── App.tsx           # Main app component
│       └── main.tsx          # Entry point
├── server/                    # Backend Express application
│   ├── db.ts                 # Database helpers
│   ├── email.ts              # Email service
│   ├── routers.ts            # tRPC procedures
│   └── _core/                # Core framework files
├── drizzle/                   # Database schema and migrations
│   ├── schema.ts             # Database schema
│   └── migrations/           # SQL migrations
├── shared/                    # Shared types and constants
├── .htaccess                 # Apache configuration for Hostinger
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
├── README_PROJEXA.md         # This file
└── package.json              # Project dependencies
```

## Database Schema

### Users Table
Stores user account information with OAuth integration.

### Visitors Table
Tracks website visitors with page, IP address, and timestamp.

### Products Table
Stores product information including name, price, description, and stock.

### Orders Table
Manages customer orders with status tracking and payment information.

### Order Items Table
Stores individual items within each order.

### Payments Table
Tracks payment transactions with method and status.

### Email Notifications Table
Logs all email notifications sent to users and admins.

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 5.7+
- pnpm or npm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Development

```bash
# Start development server
pnpm dev

# Run TypeScript check
pnpm check

# Format code
pnpm format

# Run tests
pnpm test
```

### Production Build

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```
# Database
DATABASE_URL=mysql://user:password@localhost:3306/projexa

# Authentication
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=Projexa Store

# Payment Methods
VODAFONE_CASH_NUMBER=+20xxxxxxxxx
INSTAPAY_ACCOUNT=your-account

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

### Security Headers

Security headers are configured in:
- `client/public/_headers` (for Netlify)
- `.htaccess` (for Apache/Hostinger)

Headers include:
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `Strict-Transport-Security` - Force HTTPS
- `Content-Security-Policy` - Control resource loading

## API Documentation

### Visitor Tracking

```typescript
// Track visitor
POST /api/trpc/visitors.track
{
  page: string;
  userAgent?: string;
  referrer?: string;
}

// Get visitor statistics
GET /api/trpc/visitors.stats
```

### Products

```typescript
// Get all products
GET /api/trpc/products.list

// Get product by ID
GET /api/trpc/products.getById?input=1
```

### Orders

```typescript
// Create order
POST /api/trpc/orders.create
{
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: "vodafone_cash" | "instapay" | "manual";
  shippingAddress: string;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}

// Get order by ID
GET /api/trpc/orders.getById?input=1

// List all orders (admin only)
GET /api/trpc/orders.list

// Update order status (admin only)
POST /api/trpc/orders.updateStatus
{
  orderId: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}
```

## Payment Methods

### Vodafone Cash
- Customers enter their Vodafone number
- Payment instructions displayed with merchant number
- Manual verification by admin

### InstaPay
- Customers see InstaPay account details
- Payment reference provided for tracking
- Manual verification by admin

### Manual Payment
- Generic payment instructions
- Customer can choose preferred method
- Admin reviews and confirms

## Email Templates

### Registration Email
Sent when user creates account with welcome message.

### Order Confirmation
Sent after order creation with order details and payment method.

### Order Status Update
Sent when order status changes (confirmed, shipped, delivered).

### Admin Alert
Sent to admin when new order is received.

## Deployment

### Hostinger Deployment

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

Quick steps:
1. Build project: `pnpm build`
2. Upload to Hostinger via cPanel or SSH
3. Configure Node.js application in cPanel
4. Set environment variables
5. Run database migrations
6. Test all features

### Netlify Deployment

1. Connect GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify UI
5. Deploy

## Security Audit

The project has been tested with Nikto security scanner. Key findings:

- ✅ Security headers properly configured
- ✅ HTTPS enforced
- ✅ Sensitive files protected
- ✅ Directory listing disabled
- ✅ SSL certificate valid
- ✅ No known vulnerabilities

## Performance Optimization

- **Gzip Compression**: Enabled for text assets
- **Cache Headers**: Static assets cached for 1 year
- **Database Indexes**: Optimized for common queries
- **Code Splitting**: Frontend code split by route
- **Lazy Loading**: Components loaded on demand

## Monitoring & Maintenance

### Logs
- Check application logs in cPanel
- Monitor error logs for issues
- Review email delivery logs

### Backups
- Automatic daily database backups
- Regular file backups recommended
- Test restore procedures

### Updates
- Keep Node.js updated
- Update npm packages regularly
- Monitor security advisories

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check MySQL user permissions
- Ensure database exists

### Email Not Sending
- Verify SMTP credentials
- Check firewall allows port 587
- Review email logs

### API Endpoints Not Responding
- Check Node.js application is running
- Verify environment variables
- Check application logs

## Support & Resources

- **Documentation**: See `DEPLOYMENT_GUIDE.md`
- **Issues**: Check error logs and application logs
- **Email**: Contact admin@yourdomain.com

## License

This project is proprietary software. All rights reserved.

## Version

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready

---

**Built with ❤️ for e-commerce success**
