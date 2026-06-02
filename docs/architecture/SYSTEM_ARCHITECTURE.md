# Hardware Store Management System - Architecture

## 1. SYSTEM OVERVIEW

A professional inventory and sales management system for a single hardware store to:
- Manage inventory (items in/out)
- Record sales and revenue
- Track debt transactions
- Monitor stock levels
- Generate business reports

**Single-Tenant Architecture:** This system is designed for ONE hardware store only. All data belongs to a single business owner.

---

## 2. TECH STACK

### Frontend
- **Framework:** Next.js 14+ (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context + Zustand
- **Forms:** React Hook Form + Zod validation
- **Charts:** Chart.js or Recharts
- **Database Client:** Prisma ORM

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **Authentication:** NextAuth.js (JWT)
- **Validation:** Zod

### Database
- **Primary:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis (optional, for reports)

### DevOps & Deployment
- **Containerization:** Docker
- **Deployment:** Vercel / Self-hosted
- **Version Control:** Git
- **Package Manager:** npm/yarn/pnpm

---

## 3. PROJECT STRUCTURE

```
hardware_stocks/
├── docs/
│   ├── design/              # Design system documentation
│   ├── architecture/        # Architecture documentation
│   └── database/           # Database schemas & migrations
├── .github/
│   └── copilot-instructions.md
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home/Dashboard
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx    # Dashboard home
│   │   │   ├── inventory/  # Inventory management
│   │   │   ├── sales/      # Sales recording
│   │   │   ├── debts/      # Debt tracking
│   │   │   ├── reports/    # Analytics & reports
│   │   │   └── settings/   # User settings
│   │   └── api/
│   │       ├── auth/
│   │       ├── inventory/
│   │       ├── sales/
│   │       ├── debts/
│   │       └── reports/
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   ├── forms/         # Form components
│   │   └── charts/        # Chart components
│   ├── lib/
│   │   ├── db.ts          # Database client
│   │   ├── auth.ts        # Auth config
│   │   └── utils.ts       # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── styles/
│   │   └── globals.css    # Global styles & design tokens
│   └── middleware.ts      # Authentication middleware
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── public/
│   ├── images/
│   └── icons/
├── .env.example
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 4. DATABASE SCHEMA (Core Entities)

```
Products/Items
├── ID
├── Product Name
├── Category
├── SKU (unique)
├── Current Stock
├── Min Stock Level
├── Unit Price
├── Purchase Price
├── Created At
└── Updated At

Inventory Transactions
├── ID
├── Product ID (FK)
├── Type (IN/OUT)
├── Quantity
├── Notes
├── Date
└── Timestamp

Sales
├── ID
├── Sale Date
├── Total Amount
├── Payment Status (PAID/DEBT)
├── Notes
├── Created At
└── Updated At

Sale Items
├── ID
├── Sale ID (FK)
├── Product ID (FK)
├── Quantity Sold
├── Unit Price
├── Total (Quantity × Price)
└── Discount

Debts/Credit
├── ID
├── Sale ID (FK) [Optional - if from sale]
├── Debtor Name
├── Amount
├── Amount Paid
├── Date
├── Due Date
├── Status (PENDING/PARTIAL/PAID)
├── Notes
├── Created At
└── Updated At

Debt Payments
├── ID
├── Debt ID (FK)
├── Amount Paid
├── Payment Date
├── Notes
└── Timestamp

Reports
├── ID
├── Report Type (DAILY/WEEKLY/MONTHLY)
├── Period
├── Total Revenue
├── Total Items Sold
├── Total Debts
├── Debts Collected
├── Generated At
└── Data (JSON)
```

---

## 5. KEY FEATURES & FLOWS

### Feature 1: Inventory Management
- **Add Items:** New products with price, category, stock level
- **Update Stock:** Record items in/out
- **View Inventory:** List all items with current stock
- **Low Stock Alerts:** Flag items below minimum level
- **Categories:** Organize items by type

**User Flow:**
1. Seller navigates to Inventory
2. Add/Edit/Delete products
3. Record incoming/outgoing stock
4. System auto-updates stock levels
5. View alerts for low stock

### Feature 2: Sales Recording
- **Quick Sale:** Record items sold instantly
- **Debt Sales:** Record items sold on debt with debtor info
- **Cash Sales:** Record paid sales
- **Receipt:** Generate receipt for each sale
- **Sale History:** View all past sales

**User Flow:**
1. Click "New Sale"
2. Add items to sale
3. Select payment type (Cash/Debt)
4. Enter debtor info (if debt)
5. Confirm and generate receipt
6. Stock updates automatically

### Feature 3: Debt Management
- **Record Debt:** When items sold on credit
- **Track Payments:** Record partial/full payments
- **Debt Status:** Overview of all pending debts
- **Payment Schedule:** Due date tracking
- **Debt Reports:** Total outstanding debt

**User Flow:**
1. View Debts dashboard
2. See all pending debts with due dates
3. Record payment received
4. Mark as paid/partial/overdue
5. Generate debt summary report

### Feature 4: Revenue & Analytics
- **Daily Revenue:** Total sales for the day
- **Monthly Revenue:** Revenue trends
- **Profit Margin:** Revenue vs purchase price
- **Best Sellers:** Top-selling products
- **Revenue Chart:** Visual representation
- **Period Reports:** Daily/Weekly/Monthly

**User Flow:**
1. Navigate to Reports
2. Select report type and period
3. View charts and statistics
4. Export report (PDF/CSV)
5. Track trends over time

### Feature 5: Stock Management
- **Stock In:** Record new items received
- **Stock Out:** Record items sold (auto-updated from sales)
- **Stock Alerts:** Low stock notifications
- **Category View:** Group items by type
- **Stock History:** Track all stock changes

**User Flow:**
1. Inventory view shows all items
2. Green = In stock
3. Red = Low/Out of stock
4. Click to view stock history
5. Record new stock when items arrive

---

## 6. API ENDPOINTS (REST)

### Authentication
```
POST   /api/auth/register      - Register seller
POST   /api/auth/login         - Login seller
POST   /api/auth/logout        - Logout
GET    /api/auth/session       - Get current session
```

### Inventory
```
GET    /api/inventory          - List all items
POST   /api/inventory          - Add new item
PUT    /api/inventory/:id      - Update item
DELETE /api/inventory/:id      - Delete item
GET    /api/inventory/:id      - Get item details
POST   /api/inventory/:id/stock - Record stock transaction
```

### Sales
```
GET    /api/sales              - List all sales
POST   /api/sales              - Create new sale
GET    /api/sales/:id          - Get sale details
GET    /api/sales/:id/receipt  - Download receipt
```

### Debts
```
GET    /api/debts              - List all debts
POST   /api/debts              - Record new debt
PUT    /api/debts/:id          - Update debt status
POST   /api/debts/:id/payment  - Record payment
```

### Reports
```
GET    /api/reports/revenue    - Revenue data
GET    /api/reports/sales      - Sales data
GET    /api/reports/debts      - Debt summary
GET    /api/reports/inventory  - Stock report
GET    /api/reports/export     - Export reports
```

---

## 7. AUTHENTICATION & SECURITY

- **JWT tokens** for session management
- **NextAuth.js** for OAuth (optional social login)
- **Password hashing** with bcrypt
- **HTTPS only** in production
- **CORS** properly configured
- **Input validation** with Zod
- **Rate limiting** on auth endpoints
- **Session expiry** after 24 hours inactivity

---

## 8. USER ROLES

### Store Owner (Main User)
- Full access to all features
- Single login for the hardware store
- Complete data ownership
- Can access all inventory, sales, and debt records

---

## 9. ERROR HANDLING

- **401:** Unauthorized (not logged in)
- **403:** Forbidden (no access)
- **404:** Not found
- **400:** Bad request (validation error)
- **500:** Server error
- User-friendly error messages in UI

---

## 10. PERFORMANCE CONSIDERATIONS

- **Pagination:** 50 items per page for lists
- **Lazy loading:** Charts and reports
- **Caching:** Product list cached client-side
- **Debouncing:** Search inputs
- **Image optimization:** Lazy load images
- **Database indexes:** On frequently queried fields

---

## 11. DEPLOYMENT STRATEGY

### Development
```bash
npm run dev          # Local development
```

### Production
```bash
npm run build        # Build production
npm start            # Start server
```

### Docker
```bash
docker build -t hardware-store .
docker run -p 3000:3000 hardware-store
```

---

## 12. MONITORING & LOGGING

- Server logs in `/logs` directory
- Error tracking (Sentry optional)
- Performance monitoring
- Database query monitoring

---

## Files to Reference
- `DATABASE_SCHEMA.md` - Detailed database design
- `API_SPECIFICATION.md` - Full API docs
- `SECURITY.md` - Security best practices
