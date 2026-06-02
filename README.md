# Hardware Store Management System

A professional, full-featured inventory and sales management application designed specifically for a single hardware store owner. Track inventory, record sales, manage debts, and generate comprehensive business reports with an intuitive, modern interface.

## Features

- **📦 Inventory Management** - Track items in/out, stock levels, and low stock alerts
- **💰 Sales Recording** - Quick sales entry with cash or debt options
- **💳 Debt Management** - Track outstanding debts and record payments
- **📈 Analytics & Reports** - Revenue tracking, sales trends, and profit analysis
- **🔔 Stock Alerts** - Real-time notifications for low/out of stock items
- **📊 Dashboard** - At-a-glance business metrics and summary
- **🔐 Secure Authentication** - Password protected seller accounts
- **📱 Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Professional, utility-first styling
- **React Hook Form** - Efficient form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Backend API
- **Prisma ORM** - Database management
- **NextAuth.js** - Authentication
- **PostgreSQL** - Database

### DevOps
- **Docker** - Containerization
- **Vercel** - Deployment (optional)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard and main features
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript definitions
└── styles/                # Global styles

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations

docs/
├── design/                # Design system documentation
└── architecture/          # System architecture
```

## Design System

The application uses a professional color scheme with:
- **White** - Base backgrounds and surfaces
- **Green** - Success, revenue, positive actions
- **Blue** - Primary actions, navigation, information
- **Red** - Alerts, errors, out of stock warnings

See [DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md) for complete design specifications.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- PostgreSQL (local or remote)

### Installation

1. Clone the repository
```bash
cd hardware_stocks
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hardware_stocks"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database
```bash
npm run prisma:migrate
```

5. Start the development server
```bash
npm run dev
```

Visit http://localhost:3000 to access the application.

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database browser)
npm run prisma:seed      # Seed database with sample data
```

## Database Migrations

When you modify the Prisma schema:

```bash
# Create and apply a new migration
npm run prisma:migrate

# Reset database (development only)
npm run prisma:reset
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new seller
- `POST /api/auth/login` - Seller login
- `GET /api/auth/session` - Get current session

### Inventory
- `GET /api/inventory` - List all products
- `POST /api/inventory` - Add new product
- `PUT /api/inventory/:id` - Update product
- `DELETE /api/inventory/:id` - Delete product

### Sales
- `GET /api/sales` - List all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get sale details

### Debts
- `GET /api/debts` - List all debts
- `POST /api/debts` - Record new debt
- `POST /api/debts/:id/payment` - Record payment

### Reports
- `GET /api/reports/revenue` - Revenue data
- `GET /api/reports/sales` - Sales statistics
- `GET /api/reports/debts` - Debt summary

See [SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md) for complete API documentation.

## Deployment

### Docker Deployment

```bash
docker build -t hardware-store .
docker run -p 3000:3000 --env-file .env.local hardware-store
```

### Vercel Deployment

```bash
npm install -g vercel
vercel
```

## Security

- Passwords are hashed with bcrypt
- JWT tokens for authentication
- CORS protection
- Input validation with Zod
- HTTPS in production
- Session expiry after 24 hours

## Documentation

- [DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md) - Complete design specifications
- [SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md) - System design and architecture
- [DATABASE_SCHEMA.md](docs/architecture/DATABASE_SCHEMA.md) - Database schema details
- [USER_FLOWS.md](docs/design/USER_FLOWS.md) - User interface flows and wireframes

## Contributing

1. Create a feature branch
2. Make changes following the design system
3. Test thoroughly
4. Submit a pull request

## License

All rights reserved. © 2024 Hardware Store Management System

## Support

For issues and questions, please contact the development team.

---

**Last Updated:** June 2, 2024
**Status:** Design Phase Complete - Ready for Development
# hardware
