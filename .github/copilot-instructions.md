# Copilot Instructions - Hardware Store Management System

This file contains instructions for developing the Hardware Store Management System with GitHub Copilot.

## Project Overview

- **Project Name:** Hardware Store Management System
- **Type:** Full-Stack Web Application
- **Framework:** Next.js 14 with TypeScript
- **Purpose:** Single-tenant inventory and sales management for one hardware store
- **Status:** Design Phase Complete
- **Architecture:** Single-tenant (ONE store only, no multi-user support)

## Key Files to Reference

- [DESIGN_SYSTEM.md](../docs/design/DESIGN_SYSTEM.md) - Color palette, typography, components
- [SYSTEM_ARCHITECTURE.md](../docs/architecture/SYSTEM_ARCHITECTURE.md) - System architecture and API design
- [DATABASE_SCHEMA.md](../docs/architecture/DATABASE_SCHEMA.md) - Database models and relationships
- [USER_FLOWS.md](../docs/design/USER_FLOWS.md) - User interface flows

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Next.js best practices
- Use React functional components with hooks
- Follow the design system for all UI components

### Color Scheme
- White (#FFFFFF) - Base backgrounds
- Green (#10B981) - Success, revenue, positive actions
- Blue (#3B82F6) - Primary actions, navigation
- Red (#EF4444) - Alerts, errors, warnings

### Component Structure
- Place reusable components in `src/components/`
- Create component subdirectories by type (ui/, forms/, layout/, etc.)
- Use Tailwind CSS for styling
- Follow design system for spacing, typography, and colors

### Database
- Use Prisma ORM for all database operations
- Keep API routes in `src/app/api/`
- Implement proper error handling
- Validate all inputs with Zod

### Authentication
- Use NextAuth.js for authentication
- Protect dashboard routes with middleware
- Single store owner login only
- Implement proper session management
- No multi-tenant separation needed

### Features Priority
1. Core authentication (owner login)
2. Inventory management (CRUD)
3. Sales recording
4. Stock tracking
5. Debt management
6. Reports and analytics

## Directory Structure

```
hardware_stocks/
├── docs/
│   ├── design/                    # Design documentation
│   │   ├── DESIGN_SYSTEM.md
│   │   └── USER_FLOWS.md
│   └── architecture/              # Architecture documentation
│       ├── SYSTEM_ARCHITECTURE.md
│       └── DATABASE_SCHEMA.md
├── src/
│   ├── app/
│   │   ├── (auth)/               # Auth pages (login, register)
│   │   ├── dashboard/            # Dashboard pages
│   │   ├── api/                  # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── forms/                # Form components
│   │   ├── layout/               # Layout components
│   │   └── charts/               # Chart components
│   ├── lib/
│   │   ├── db.ts                 # Database client
│   │   ├── auth.ts               # Auth configuration
│   │   └── utils.ts              # Utility functions
│   ├── types/
│   │   └── index.ts              # Type definitions
│   ├── styles/
│   │   └── globals.css           # Global styles
│   └── middleware.ts             # Auth middleware
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
└── .env.example
```

## Common Tasks

### Adding a New Page
1. Create page in `src/app/dashboard/[feature]/page.tsx`
2. Add navigation link in sidebar component
3. Create API route in `src/app/api/[feature]/`
4. Implement database operations in Prisma

### Creating a New Component
1. Create component file in `src/components/[category]/`
2. Use TypeScript interfaces for props
3. Apply design system colors and spacing
4. Add proper JSDoc comments

### Adding a Database Model
1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Create API routes to handle model operations
4. Add TypeScript types

### Making API Calls
1. Use `fetch` with proper error handling
2. Validate response data with Zod
3. Show user-friendly error messages
4. Implement loading states

## Design System Usage

### Colors
```tsx
// Primary actions (Green)
className="bg-green-500 hover:bg-green-600 text-white"

// Secondary actions (Blue)
className="bg-blue-500 hover:bg-blue-600 text-white"

// Alerts/Errors (Red)
className="bg-red-500 hover:bg-red-600 text-white"

// Backgrounds
className="bg-white border border-gray-200"
```

### Spacing
```tsx
// Use Tailwind spacing utilities
className="p-4"      // Padding
className="m-6"      // Margin
className="gap-4"    // Gap between flex/grid items
```

### Typography
```tsx
// Headings
className="text-2xl font-bold text-gray-900"    // H2
className="text-xl font-semibold text-gray-900" // H3

// Body text
className="text-sm text-gray-500"  // Secondary text
```

## Important Notes

- Always protect dashboard routes with authentication
- Validate all user inputs
- Show loading states during async operations
- Implement proper error handling with user feedback
- Follow the design system for consistent UI
- Keep components small and reusable
- Use React Query or SWR for data fetching (optional but recommended)

## Testing

Test the application by:
1. Creating a seller account
2. Adding inventory items
3. Recording sales
4. Creating debts
5. Viewing reports and analytics
6. Verifying data accuracy

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Tests passing
- [ ] No console errors or warnings
- [ ] Design system properly applied
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] README updated

---

**Last Updated:** June 2, 2024
