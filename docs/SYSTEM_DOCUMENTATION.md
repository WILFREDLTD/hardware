# Hardware Store Management System Documentation

## Overview

The Hardware Store Management System is a single-tenant web application built for one hardware store owner. It helps the business manage inventory, record sales, track debtor balances, monitor stock levels, and review performance through a dashboard and reports.

This system is designed to be practical and operational rather than purely theoretical. It supports the daily workflow of a small store where products move in and out quickly, sales may be paid in cash or on credit, and the owner needs a clear view of performance at any moment.

---

## What the System Does

The application covers the main business functions of a hardware store:

- Manage products and stock levels
- Organize items by category and unit
- Record incoming and outgoing inventory movements
- Create and track sales
- Handle debt and credit sales
- Record payments received against debts
- View business statistics and reports
- Manage store profile and security settings
- Track separate hardware item lists when needed

---

## Core Purpose

The system is built to help the owner:

1. Know what products are available
2. See how much stock remains
3. Record sales quickly and accurately
4. Follow up on unpaid debts
5. Understand revenue, profit, and sales trends
6. Make better purchasing and stocking decisions

---

## Main Features

### 1. Authentication and Access Control

The system provides secure login for the store owner through NextAuth credentials-based authentication.

How it works:
- The owner logs in with an email and password
- Credentials are verified against the database
- A session is created for the current user
- Protected dashboard routes are only accessible after authentication

This ensures that store data remains private and only available to the authorized owner.

### 2. Product and Inventory Management

Products are the central records of the inventory system.

Each product can contain:
- Name
- Category
- Nickname
- Current stock quantity
- Minimum stock level
- Base unit
- Package unit details
- Supplier name and phone number
- Unit price
- Purchase price

The system stores these values so the owner can track the inventory in a structured way.

### 3. Category and Unit Organization

Items can be grouped using categories, which helps the store stay organized.

The system also supports base units such as pieces, boxes, or other measurement units, making it easier to manage stock in a way that fits the store’s operations.

### 4. Stock Movement Tracking

Every time stock changes, the system records an inventory transaction.

Stock can be tracked as:
- Stock in
- Stock out

This creates a history of inventory movement instead of only storing the current quantity. In this way, the system understands not just what is available now, but also how inventory changed over time.

### 5. Sales Recording

Sales are the backbone of the system.

When a sale is created, the system:
- Accepts one or more products
- Calculates subtotal and discount
- Calculates total amount
- Stores the sale as a record
- Updates stock according to the quantity sold
- Marks the sale as either paid or debt-based

Sales can be recorded for two main payment types:
- Paid sales
- Debt sales

Paid sales contribute directly to revenue. Debt sales are linked to a debtor and remain outstanding until payment is received.

### 6. Debt Management

The debt feature is important for stores that allow customers to buy on credit.

When a sale is marked as a debt sale, the system creates a debt record containing:
- Debtor name
- Debtor phone
- Total amount
- Amount already paid
- Due date
- Status
- Notes

The system also allows the owner to record payments against debts. Once payments are made, the remaining balance is reduced and the debt status is updated to reflect the current state.

Debt statuses typically include:
- Pending
- Partial
- Paid

This gives the owner an organized way to follow up with customers.

### 7. Dashboard and Statistics

The dashboard gives the owner a quick summary of the business.

It can show values such as:
- Total revenue
- Number of items sold
- Total debts
- Amount collected from debts
- Pending debts
- Profit estimate
- Low stock count
- Hardware inventory count
- Hardware inventory value

These statistics are calculated from sales, debts, products, and related records, giving the owner a clear picture of current business performance.

### 8. Reports

The system includes reporting functionality for daily, weekly, and monthly data.

Reports can summarize:
- Revenue
- Sales volume
- Debts owed
- Amount collected
- Best-selling products
- Financial performance over a period

Reports are stored in a structured format so the owner can review historical data and compare performance over time.

### 9. Store Profile and Settings

The system allows the owner to configure store details such as:
- Store name
- Location
- Description
- Auto-lock timeout

The auto-lock setting helps protect the app when the owner is inactive for a period of time.

### 10. Hardware Lists and Hardware Items

In addition to standard products, the system supports a separate hardware module.

This feature allows the store to manage specialized hardware items grouped in lists, with details like:
- Name
- SKU
- Quantity
- Unit price
- Purchase price
- Description

This is useful for handling inventory that is slightly different from ordinary products or needs a more flexible organization structure.

---

## How the System Handles Daily Workflows

### A. Adding a New Product

When a new product is added:
1. The owner enters product details
2. The system validates the information
3. The product is linked to the current user account
4. It becomes available in the inventory list
5. Stock and pricing values are stored for future sales and reports

### B. Recording Stock In

When stock arrives:
1. The owner records the quantity received
2. The system creates an inventory transaction of type IN
3. The product’s current stock is increased
4. The movement is kept in history for later review

### C. Recording Stock Out

When products are sold:
1. The owner enters the sale
2. The system reduces stock for the sold products
3. An inventory transaction of type OUT is created
4. The sale record is saved
5. Revenue and profit-related data are updated

### D. Creating a Sale

When a sale is made:
1. The owner selects the products sold
2. The quantity and price are recorded
3. The system calculates the total
4. The sale is marked as paid or debt-based
5. The inventory is adjusted accordingly
6. The dashboard statistics are updated

### E. Managing Debt Sales

When a customer buys on credit:
1. The sale is recorded as a debt-based transaction
2. A debt record is created
3. The customer’s balance remains outstanding
4. Payments can be added later
5. The debt status changes as payments are received

### F. Reviewing Reports

When the owner checks reports:
1. The system gathers sales, debt, and stock data
2. It calculates totals and trends
3. It builds the report for the selected period
4. The results are shown on the dashboard or reports page

---

## Data Handling Approach

The system is built around a clear data structure:

- Each user owns their own records
- Products, sales, debts, and reports are linked to the store owner account
- Inventory changes are stored as transactions
- Sales are connected to sale items and can be linked to debts
- Financial and stock values are calculated using the stored records

This design makes the system easier to maintain and ensures data stays organized for a single-store operation.

---

## Technical Stack

The application is built with:

- Next.js for the web application
- React and TypeScript for the user interface
- Tailwind CSS for styling
- NextAuth for authentication
- Prisma ORM for database access
- PostgreSQL as the database
- Docker support for containerized deployment

---

## Summary

The Hardware Store Management System is a practical business tool for managing a hardware store from one place. It combines inventory control, sales processing, debt tracking, reporting, and store configuration into a single workflow-focused application.

Its main strength is that it handles the day-to-day operations of a small business in a simple, structured, and understandable way.
