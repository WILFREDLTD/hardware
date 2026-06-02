# Database Schema - Hardware Store Management

## Architecture Note
This is a **single-tenant system** designed for ONE hardware store. No user/seller IDs are needed since all data belongs to a single store owner.

## Prisma Schema (schema.prisma)

```prisma
// Product/Item model
model Product {
  id              String    @id @default(cuid())
  
  name            String
  category        String
  sku             String    @unique
  currentStock    Int       @default(0)
  minStockLevel   Int       @default(5)
  unitPrice       Float
  purchasePrice   Float
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  saleItems       SaleItem[]
  transactions    InventoryTransaction[]

  @@index([category])
  @@map("products")
}

// Inventory Transaction model
model InventoryTransaction {
  id        String    @id @default(cuid())
  
  productId String
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  type      TransactionType  // IN or OUT
  quantity  Int
  notes     String?
  date      DateTime
  
  createdAt DateTime  @default(now())

  @@index([productId])
  @@index([date])
  @@map("inventory_transactions")
}

enum TransactionType {
  IN
  OUT
}

// Sale model
model Sale {
  id              String    @id @default(cuid())
  
  saleDate        DateTime  @default(now())
  totalAmount     Float
  paymentStatus   PaymentStatus  // PAID or DEBT
  notes           String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  saleItems       SaleItem[]
  debt            Debt?     // If payment status is DEBT

  @@index([saleDate])
  @@index([paymentStatus])
  @@map("sales")
}

enum PaymentStatus {
  PAID
  DEBT
}

// Sale Items (Line Items)
model SaleItem {
  id          String    @id @default(cuid())
  saleId      String
  sale        Sale      @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
  
  quantity    Int
  unitPrice   Float
  total       Float     // quantity × unitPrice
  discount    Float?    @default(0)

  @@index([saleId])
  @@index([productId])
  @@map("sale_items")
}

// Debt model
model Debt {
  id          String    @id @default(cuid())
  
  saleId      String?   @unique
  sale        Sale?     @relation(fields: [saleId], references: [id], onDelete: SetNull)
  
  debtorName  String
  amount      Float
  amountPaid  Float     @default(0)
  
  date        DateTime  @default(now())
  dueDate     DateTime?
  status      DebtStatus // PENDING, PARTIAL, PAID
  
  notes       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  payments    DebtPayment[]

  @@index([status])
  @@index([date])
  @@map("debts")
}

enum DebtStatus {
  PENDING
  PARTIAL
  PAID
}

// Debt Payment model
model DebtPayment {
  id        String    @id @default(cuid())
  debtId    String
  debt      Debt      @relation(fields: [debtId], references: [id], onDelete: Cascade)
  
  amount    Float
  date      DateTime  @default(now())
  notes     String?
  
  createdAt DateTime  @default(now())

  @@index([debtId])
  @@map("debt_payments")
}

// Report model (for storing generated reports)
model Report {
  id            String    @id @default(cuid())
  
  type          ReportType
  period        String    // "2024-01", "2024-01-15", etc.
  
  totalRevenue  Float
  totalSales    Int
  totalDebts    Float
  debtsCollected Float
  
  data          Json?     // Detailed report data
  
  generatedAt   DateTime  @default(now())

  @@index([type])
  @@index([period])
  @@map("reports")
}

enum ReportType {
  DAILY
  WEEKLY
  MONTHLY
}
```

## Key Relationships

```
Product (1) ──→ (∞) SaleItem
Product (1) ──→ (∞) InventoryTransaction

Sale (1) ──→ (∞) SaleItem
Sale (1) ──→ (0-1) Debt

Debt (1) ──→ (∞) DebtPayment
```

## Indexes

- **products**: `sku` unique, `category` index
- **inventory_transactions**: `productId`, `date` indexes
- **sales**: `saleDate`, `paymentStatus` indexes
- **sale_items**: `saleId`, `productId` indexes
- **debts**: `status`, `date` indexes
- **debt_payments**: `debtId` index
- **reports**: `type`, `period` indexes

## Migration Steps

1. Create Product table
2. Create InventoryTransaction table
3. Create Sale table
4. Create SaleItem table
5. Create Debt table
6. Create DebtPayment table
7. Create Report table

## Sample Queries

### Total Revenue for Period
```sql
SELECT SUM(totalAmount) 
FROM sales 
WHERE saleDate BETWEEN $1 AND $2 AND paymentStatus = 'PAID'
```

### Outstanding Debts
```sql
SELECT * FROM debts 
WHERE status != 'PAID'
```

### Low Stock Items
```sql
SELECT * FROM products 
WHERE currentStock <= minStockLevel
```

### Best Selling Products
```sql
SELECT p.name, SUM(si.quantity) as total_sold
FROM sale_items si
JOIN products p ON si.productId = p.id
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10
```
