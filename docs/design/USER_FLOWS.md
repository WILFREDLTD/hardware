# User Flows & Wireframes

## 1. AUTHENTICATION FLOW

```
┌─────────────┐
│   Landing   │
└──────┬──────┘
       │
       ├─→ [Register] → Fill Form → Create Account → Dashboard
       │
       └─→ [Login] → Enter Credentials → Dashboard
```

### Login Screen
- Email input
- Password input
- "Remember Me" checkbox
- Login button (Green)
- Register link
- Logo/Branding

---

## 2. DASHBOARD MAIN FLOW

```
┌────────────────────────────────────────┐
│ DASHBOARD (Home)                       │
├────────────────────────────────────────┤
│                                        │
│  Today's Summary Cards:               │
│  ┌──────────┐  ┌──────────┐           │
│  │ Revenue  │  │ Debts    │           │
│  │ Today    │  │ Pending  │           │
│  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐           │
│  │ Items    │  │ Low      │           │
│  │ Sold     │  │ Stock    │           │
│  └──────────┘  └──────────┘           │
│                                        │
│  Quick Actions:                        │
│  [+ New Sale] [+ Add Item] [+ Record Debt] │
│                                        │
│  Today's Sales (Recent)                │
│  ┌─────────────────────────────────┐   │
│  │ Item  | Qty | Amount | Type    │   │
│  │─────────────────────────────────│   │
│  │ Nails | 50  | $500   | Cash    │   │
│  │ Drill | 2   | $400   | Debt    │   │
│  └─────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

---

## 3. INVENTORY MANAGEMENT FLOW

```
Inventory Page
├─ View All Items (Table)
│  ├─ Name | Category | Stock | Price | Status | Actions
│  ├─ [Edit] [Delete] [View History]
│  └─ Low Stock (Red Badge)
│
├─ [+ Add New Item]
│  ├─ Product Name
│  ├─ Category (Dropdown)
│  ├─ SKU (Auto-generate)
│  ├─ Unit Price
│  ├─ Purchase Price
│  ├─ Min Stock Level
│  └─ [Save] [Cancel]
│
└─ [Record Stock]
   ├─ Select Item
   ├─ Type: [Stock In] [Stock Out]
   ├─ Quantity
   ├─ Notes (Optional)
   └─ [Save]
```

### Inventory List View
- Search bar (Filter by name/SKU)
- Category filter
- Sort options
- Table with columns:
  - Product Name
  - Category
  - Current Stock (Green if in stock, Red if low)
  - Unit Price
  - Actions (Edit, Delete, View)
- Add button (+ New Item)

---

## 4. SALES RECORDING FLOW

```
[New Sale] Button
    ↓
─────────────────────────────────────
│ Sale Entry Form                   │
├─────────────────────────────────────
│                                   │
│ Sale Date: [Today Auto-filled]   │
│                                   │
│ Add Items:                        │
│ ┌─────────────────────────────┐   │
│ │ Item  | Qty | Price | Total │   │
│ │─────────────────────────────│   │
│ │ Nails | 50  | $10   | $500  │   │
│ │ [x]                        │   │
│ └─────────────────────────────┘   │
│ [+ Add Item]                      │
│                                   │
│ Discount: [_____]%               │
│                                   │
│ Subtotal: $500                    │
│ Discount: $0                      │
│ ─────────────────                 │
│ TOTAL: $500                       │
│                                   │
│ Payment Type:                     │
│ ◉ Cash                            │
│ ○ Debt                            │
│                                   │
│ [If Debt Selected]                │
│ Debtor Name: ________________     │
│ Due Date: __/__/____             │
│                                   │
│ [Save Sale] [Cancel]              │
│ ↓ On Save ↓                       │
│ ✓ Receipt Generated               │
│ [Download Receipt] [Print]        │
│                                   │
└─────────────────────────────────────
```

---

## 5. DEBT MANAGEMENT FLOW

```
Debts Page
├─ Summary Cards
│  ├─ Total Pending Debt
│  ├─ Due Soon (This Week)
│  └─ Overdue
│
├─ Debts Table (Sortable)
│  ├─ Debtor Name
│  ├─ Amount
│  ├─ Amount Paid
│  ├─ Remaining
│  ├─ Due Date
│  ├─ Status (Pending/Partial/Paid)
│  └─ Actions
│
├─ [Record Payment]
│  ├─ Select Debt
│  ├─ Amount Paid: [_____]
│  ├─ Payment Date: [_____]
│  ├─ Notes
│  └─ [Confirm]
│
└─ [+ Add Manual Debt]
   ├─ Debtor Name
   ├─ Amount
   ├─ Date
   ├─ Due Date
   └─ [Save]
```

### Debt Status Indicators
- **Pending (Red)**: Not paid
- **Partial (Orange)**: Partially paid
- **Paid (Green)**: Fully paid

---

## 6. REPORTS & ANALYTICS FLOW

```
Reports Page
├─ Report Type Selection
│  ├─ [Daily]
│  ├─ [Weekly]
│  └─ [Monthly]
│
├─ Date Range Picker
│  ├─ From: __/__/____
│  └─ To: __/__/____
│
├─ Summary Metrics
│  ┌──────────┐ ┌──────────┐
│  │ Revenue  │ │ Items    │
│  │ $5,000   │ │ Sold 100 │
│  └──────────┘ └──────────┘
│
│  ┌──────────┐ ┌──────────┐
│  │ Profit   │ │ Debts    │
│  │ $1,200   │ │ $800     │
│  └──────────┘ └──────────┘
│
├─ Revenue Chart (Line Graph)
│  │     ╱╲
│  │    ╱  ╲╱╲
│  │   ╱      ╲
│  │──────────────→ Days
│
├─ Top Sellers (Bar Chart)
│  │ Nails    ████████ 50
│  │ Bolts    ██████ 30
│  │ Screws   ███ 20
│
├─ Debt Status (Pie Chart)
│  │ Paid: 60%
│  │ Partial: 25%
│  │ Pending: 15%
│
└─ [Export as PDF] [Export as CSV]
```

---

## 7. STOCK ALERTS FLOW

### On Dashboard
```
┌─────────────────────────────────┐
│ ⚠ LOW STOCK ALERTS              │
├─────────────────────────────────┤
│ • Nails - 3 units (min: 5)      │
│ • Drill Bits - 2 units (min: 10)│
│ • Paint - 0 units (EMPTY)       │
│                                 │
│ [View Inventory]               │
└─────────────────────────────────┘
```

### On Inventory
```
Product Status Badge
├─ Green    - Normal stock
├─ Yellow   - Low stock (approaching min)
└─ Red      - Out of stock (critical)
```

---

## 8. SETTINGS PAGE FLOW

```
Settings Page
├─ Store Profile
│  ├─ Store Name: _______________
│  ├─ Owner Name: _______________
│  ├─ Email: ___________________
│  ├─ Phone: ___________________
│  └─ [Update]
│
├─ Password & Security
│  ├─ [Change Password]
│  ├─ [Enable Two-Factor Auth]
│  └─ [View Login History]
│
├─ Preferences
│  ├─ Currency: [USD ▼]
│  ├─ Date Format: [MM/DD/YYYY ▼]
│  ├─ Time Zone: [UTC-5 ▼]
│  └─ [Save]
│
└─ Danger Zone
   ├─ [Export Data]
   ├─ [Delete Account]
   └─ [Logout All Devices]
```

---

## 9. MOBILE RESPONSIVE FLOW

### Mobile Dashboard
```
┌──────────────────────┐
│ ☰ Logo      Profile  │ Header
├──────────────────────┤
│ Today: $500 Revenue  │
│ 10 Items Sold        │
│                      │
│ [+ New Sale]         │
│ [+ Add Item]         │
│ [+ Record Debt]      │
│ [Reports]            │
│                      │
│ Low Stock:           │
│ • Nails (3)          │
│ • Drill (2)          │
│                      │
│ Recent Sales         │
│ ─────────────────    │
│ Nails $500 Cash      │
│ Drill $400 Debt      │
│                      │
└──────────────────────┘
```

---

## 10. COLOR CODING SUMMARY

| Status/Element | Color | Meaning |
|---|---|---|
| Revenue/Success | Green (#10B981) | Positive, profit, in stock |
| Actions/Links | Blue (#3B82F6) | Primary action, clickable |
| Alerts/Out of Stock | Red (#EF4444) | Warning, critical, error |
| Debt Status | Orange (#F97316) | Pending, needs attention |
| Background | White (#FFFFFF) | Clean, professional |

---

## 11. NAVIGATION STRUCTURE

### Desktop Sidebar
```
┌─────────────────┐
│ [Logo]          │
├─────────────────┤
│ 📊 Dashboard    │ (Green underline if active)
│ 📦 Inventory    │
│ 💰 Sales        │
│ 💳 Debts        │
│ 📈 Reports      │
│ ⚙️  Settings    │
├─────────────────┤
│ 👤 Profile      │
│ 🚪 Logout      │
└─────────────────┘
```

### Mobile Top Navigation
```
┌─────────────────────────────┐
│ ☰  Hardware Store  👤       │
└─────────────────────────────┘
(Hamburger menu expands to show options)
```

