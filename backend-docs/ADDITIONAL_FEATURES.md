# Additional Features - Backend Documentation

This document describes the backend requirements for the additional features requested for the NGS Inventory System.

## Table of Contents
1. [Warehouse Management](#warehouse-management)
2. [Stock Transfer](#stock-transfer)
3. [Stock Adjustment](#stock-adjustment)
4. [Stock Opname](#stock-opname)
5. [Expired Items Tracking](#expired-items-tracking)
6. [User Management with Roles](#user-management-with-roles)
7. [Enhanced Reports](#enhanced-reports)
8. [Dashboard Enhancements](#dashboard-enhancements)

---

## 1. Warehouse Management

### Database Schema

```prisma
model Warehouse {
  id           String   @id @default(uuid())
  code         String   @unique
  name         String
  location     String
  address      String?
  capacity     Int      @default(0)
  currentStock Int      @default(0)
  status       WarehouseStatus @default(ACTIVE)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  items            ItemWarehouse[]
  stockTransfers   StockTransfer[]
  stockAdjustments StockAdjustment[]
  stockOpnames     StockOpname[]

  @@map("warehouses")
}

enum WarehouseStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
}

// Junction table for Items and Warehouses (many-to-many)
model ItemWarehouse {
  id          String   @id @default(uuid())
  itemId      String
  warehouseId String
  stock       Int      @default(0)
  minStock    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  item      Item      @relation(fields: [itemId], references: [id], onDelete: Cascade)
  warehouse Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade)

  @@unique([itemId, warehouseId])
  @@index([itemId])
  @@index([warehouseId])
  @@map("item_warehouses")
}
```

### API Endpoints

#### GET /api/warehouses
- **Description**: Get all warehouses with pagination
- **Query Params**: 
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `status` (optional: ACTIVE, INACTIVE, MAINTENANCE)
  - `search` (optional: search by name, code, location)
- **Response**: List of warehouses with pagination meta

#### POST /api/warehouses
- **Description**: Create new warehouse
- **Body**:
```json
{
  "code": "WH-001",
  "name": "Main Warehouse",
  "location": "Jakarta Pusat",
  "address": "Jl. Sudirman No. 123",
  "capacity": 10000,
  "status": "ACTIVE"
}
```

#### GET /api/warehouses/:id
- **Description**: Get warehouse by ID with stock details

#### PUT /api/warehouses/:id
- **Description**: Update warehouse

#### DELETE /api/warehouses/:id
- **Description**: Delete warehouse (only if no stock)

---

## 2. Stock Transfer

### Database Schema

```prisma
model StockTransfer {
  id              String              @id @default(uuid())
  itemId          String
  fromWarehouseId String
  toWarehouseId   String
  quantity        Int
  date            DateTime
  status          StockTransferStatus @default(IN_TRANSIT)
  notes           String?
  createdBy       String
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  // Relations
  item          Item      @relation(fields: [itemId], references: [id], onDelete: Restrict)
  fromWarehouse Warehouse @relation("from_warehouse", fields: [fromWarehouseId], references: [id])
  toWarehouse   Warehouse @relation("to_warehouse", fields: [toWarehouseId], references: [id])
  user          User      @relation(fields: [createdBy], references: [id])

  @@index([itemId])
  @@index([fromWarehouseId])
  @@index([toWarehouseId])
  @@index([date])
  @@map("stock_transfers")
}

enum StockTransferStatus {
  PENDING
  IN_TRANSIT
  COMPLETED
  CANCELLED
}
```

### API Endpoints

#### GET /api/stock/transfers
- **Query Params**: 
  - `page`, `limit`
  - `status` (optional)
  - `warehouseId` (optional: filter by warehouse)
  - `itemId` (optional)
  - `dateFrom`, `dateTo` (optional)

#### POST /api/stock/transfers
- **Body**:
```json
{
  "itemId": "uuid",
  "fromWarehouseId": "uuid",
  "toWarehouseId": "uuid",
  "quantity": 10,
  "date": "2025-01-12T00:00:00.000Z",
  "notes": "Regular distribution"
}
```
- **Logic**:
  1. Validate stock availability in source warehouse
  2. Create transfer record
  3. Update ItemWarehouse stock (decrease from source)
  4. Create ActivityLog

#### PUT /api/stock/transfers/:id/complete
- **Description**: Complete the transfer
- **Logic**:
  1. Update status to COMPLETED
  2. Update ItemWarehouse stock (increase in destination)
  3. Create ActivityLog

#### PUT /api/stock/transfers/:id/cancel
- **Description**: Cancel the transfer
- **Logic**:
  1. Update status to CANCELLED
  2. Restore stock in source warehouse if already deducted
  3. Create ActivityLog

---

## 3. Stock Adjustment

### Database Schema

```prisma
model StockAdjustment {
  id          String                 @id @default(uuid())
  itemId      String
  warehouseId String
  type        StockAdjustmentType
  quantity    Int                    // Can be negative for decreases
  date        DateTime
  reason      String
  notes       String?
  createdBy   String
  createdAt   DateTime               @default(now())

  // Relations
  item      Item      @relation(fields: [itemId], references: [id], onDelete: Restrict)
  warehouse Warehouse @relation(fields: [warehouseId], references: [id])
  user      User      @relation(fields: [createdBy], references: [id])

  @@index([itemId])
  @@index([warehouseId])
  @@index([date])
  @@map("stock_adjustments")
}

enum StockAdjustmentType {
  DAMAGED      // Item rusak
  LOST         // Item hilang
  FOUND        // Item ditemukan
  CORRECTION   // Koreksi kesalahan sistem
}
```

### API Endpoints

#### GET /api/stock/adjustments
- **Query Params**: Similar to transfers with additional `type` filter

#### POST /api/stock/adjustments
- **Body**:
```json
{
  "itemId": "uuid",
  "warehouseId": "uuid",
  "type": "DAMAGED",
  "quantity": -3,
  "date": "2025-01-12T00:00:00.000Z",
  "reason": "Water damage during transport",
  "notes": "Optional additional notes"
}
```
- **Logic**:
  1. Create adjustment record
  2. Update ItemWarehouse stock
  3. Create ActivityLog

---

## 4. Stock Opname

### Database Schema

```prisma
model StockOpname {
  id            String           @id @default(uuid())
  opnameNumber  String           @unique
  warehouseId   String
  date          DateTime
  status        StockOpnameStatus @default(IN_PROGRESS)
  totalItems    Int              @default(0)
  matchedItems  Int              @default(0)
  discrepancy   Int              @default(0)
  notes         String?
  createdBy     String
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  // Relations
  warehouse Warehouse          @relation(fields: [warehouseId], references: [id])
  user      User               @relation(fields: [createdBy], references: [id])
  details   StockOpnameDetail[]

  @@index([warehouseId])
  @@index([date])
  @@map("stock_opnames")
}

model StockOpnameDetail {
  id            String         @id @default(uuid())
  opnameId      String
  itemId        String
  systemStock   Int
  physicalStock Int
  difference    Int            // physicalStock - systemStock
  status        OpnameStatus
  notes         String?
  createdAt     DateTime       @default(now())

  // Relations
  opname StockOpname @relation(fields: [opnameId], references: [id], onDelete: Cascade)
  item   Item        @relation(fields: [itemId], references: [id])

  @@index([opnameId])
  @@index([itemId])
  @@map("stock_opname_details")
}

enum StockOpnameStatus {
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum OpnameStatus {
  MATCH       // Physical = System
  SHORTAGE    // Physical < System
  EXCESS      // Physical > System
}
```

### API Endpoints

#### GET /api/stock/opnames
- **Description**: Get all stock opnames

#### POST /api/stock/opnames
- **Body**:
```json
{
  "warehouseId": "uuid",
  "date": "2025-01-12T00:00:00.000Z",
  "notes": "Monthly stock check"
}
```
- **Logic**:
  1. Generate opname number (e.g., OP-2025-001)
  2. Create opname record with IN_PROGRESS status
  3. Auto-populate items from warehouse

#### GET /api/stock/opnames/:id
- **Description**: Get opname details with all items

#### POST /api/stock/opnames/:id/details
- **Description**: Add or update physical stock count
- **Body**:
```json
{
  "itemId": "uuid",
  "physicalStock": 45
}
```

#### PUT /api/stock/opnames/:id/complete
- **Description**: Complete opname and create adjustments
- **Logic**:
  1. Calculate discrepancies
  2. Create StockAdjustment records for differences
  3. Update ItemWarehouse stocks
  4. Update opname status to COMPLETED
  5. Create ActivityLog

---

## 5. Expired Items Tracking

### Database Schema Enhancement

```prisma
// Add to existing Item model
model Item {
  // ... existing fields
  hasExpiry     Boolean?  @default(false)
  expiryDate    DateTime?
  // ... rest of fields
}

// New table for batch tracking (optional, for better tracking)
model ItemBatch {
  id          String   @id @default(uuid())
  itemId      String
  warehouseId String
  batchNumber String
  quantity    Int
  expiryDate  DateTime
  status      BatchStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  item      Item      @relation(fields: [itemId], references: [id], onDelete: Cascade)
  warehouse Warehouse @relation(fields: [warehouseId], references: [id])

  @@index([itemId])
  @@index([warehouseId])
  @@index([expiryDate])
  @@map("item_batches")
}

enum BatchStatus {
  ACTIVE
  EXPIRED
  DISPOSED
}
```

### API Endpoints

#### GET /api/items/expired
- **Query Params**:
  - `status`: expired, critical (< 7 days), warning (< 30 days), all
  - `warehouseId` (optional)
  - `page`, `limit`
- **Response**: Items with expiry information and days until expiry

#### GET /api/items/expired/summary
- **Response**: Count by status (expired, critical, warning)

---

## 6. User Management with Roles

### Database Schema

```prisma
// Update User model
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  status    UserStatus @default(ACTIVE)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  roles            UserRole[]
  stockMovements   StockMovement[]
  stockTransfers   StockTransfer[]
  stockAdjustments StockAdjustment[]
  stockOpnames     StockOpname[]
  activityLogs     ActivityLog[]

  @@map("users")
}

// New user_roles table (separate for security)
model UserRole {
  id        String   @id @default(uuid())
  userId    String
  role      AppRole
  createdAt DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
  @@index([userId])
  @@map("user_roles")
}

enum AppRole {
  ADMIN            // Full access
  WAREHOUSE_STAFF  // Limited access
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### API Endpoints

#### GET /api/users
- **Description**: Get all users (Admin only)
- **Query Params**: `page`, `limit`, `role`, `status`

#### POST /api/users
- **Description**: Create new user (Admin only)
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@ngs.com",
  "password": "securepassword",
  "role": "WAREHOUSE_STAFF"
}
```

#### PUT /api/users/:id
- **Description**: Update user (Admin only)

#### PUT /api/users/:id/role
- **Description**: Update user role (Admin only)
- **Body**:
```json
{
  "role": "ADMIN"
}
```

#### PUT /api/users/:id/status
- **Description**: Activate/Deactivate user (Admin only)
- **Body**:
```json
{
  "status": "INACTIVE"
}
```

#### DELETE /api/users/:id
- **Description**: Delete user (Admin only, cannot delete admins)

### Row Level Security (RLS) for Supabase

If using Supabase, implement RLS policies:

```sql
-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Example RLS policy for warehouses
CREATE POLICY "Admins can manage warehouses"
ON public.warehouses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view warehouses"
ON public.warehouses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'warehouse_staff'));
```

### Middleware for Role-Based Access Control

```typescript
// Example middleware
export const requireRole = (roles: AppRole[]) => {
  return async (req, res, next) => {
    const userId = req.user.id; // from auth middleware
    
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      select: { role: true }
    });
    
    const hasRequiredRole = userRoles.some(ur => 
      roles.includes(ur.role)
    );
    
    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Usage in routes
router.post('/users', requireRole(['ADMIN']), createUser);
router.get('/warehouses', requireRole(['ADMIN', 'WAREHOUSE_STAFF']), getWarehouses);
```

---

## 7. Enhanced Reports

### Additional Report Endpoints

#### GET /api/reports/stock-by-warehouse
- **Description**: Current stock grouped by warehouse
- **Query Params**: `warehouseId` (optional)

#### GET /api/reports/stock-movements
- **Description**: Stock movement history with filters
- **Query Params**: 
  - `type`: IN, OUT, TRANSFER, ADJUSTMENT
  - `warehouseId`
  - `dateFrom`, `dateTo`
  - `format`: json, pdf, csv

#### GET /api/reports/low-stock
- **Description**: Items below minimum stock per warehouse
- **Query Params**: `warehouseId` (optional)

#### GET /api/reports/expired-items
- **Description**: Expired and expiring items report
- **Query Params**: `status`, `warehouseId`

#### GET /api/reports/stock-value
- **Description**: Total stock value by category/warehouse
- **Note**: Requires adding `price` field to Item model

---

## 8. Dashboard Enhancements

### New Dashboard Endpoints

#### GET /api/dashboard/stats
- **Response**:
```json
{
  "totalItems": 450,
  "totalWarehouses": 3,
  "lowStockItems": 12,
  "expiredItems": 5,
  "criticalExpiryItems": 8,
  "todayStockIn": 24,
  "todayStockOut": 18,
  "todayTransfers": 3,
  "pendingOpnames": 2
}
```

#### GET /api/dashboard/alerts
- **Description**: Get critical alerts for dashboard
- **Response**:
```json
{
  "lowStock": [
    { "itemCode": "ELC-001", "itemName": "...", "warehouse": "...", "stock": 5, "minStock": 10 }
  ],
  "expired": [...],
  "criticalExpiry": [...],
  "pendingTransfers": [...]
}
```

#### GET /api/dashboard/stock-trends
- **Description**: Stock IN/OUT trends for charts
- **Query Params**: `period`: daily, weekly, monthly

---

## Implementation Notes

### 1. Database Migrations
All schema changes should be done via Prisma migrations:
```bash
npx prisma migrate dev --name add_warehouse_features
```

### 2. Validation
Use Zod or similar for all request validation:
```typescript
const warehouseSchema = z.object({
  code: z.string().min(3).max(20),
  name: z.string().min(3).max(100),
  location: z.string().min(3),
  address: z.string().optional(),
  capacity: z.number().min(0),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'])
});
```

### 3. Activity Logging
All critical operations must be logged in ActivityLog:
- Stock movements
- Transfers
- Adjustments
- Opname completions
- User role changes

### 4. Notifications
Consider implementing real-time notifications for:
- Low stock alerts
- Expired items
- Pending opnames
- Transfer status updates

### 5. Performance Considerations
- Add database indexes on frequently queried fields
- Implement caching for dashboard stats
- Use pagination for all list endpoints
- Consider implementing background jobs for heavy reports

---

## Testing Requirements

1. Unit tests for all business logic
2. Integration tests for API endpoints
3. Role-based access control tests
4. Stock consistency tests (ensure stock never goes negative)
5. Concurrent operation tests (stock transfers, adjustments)

---

## Security Checklist

- ✅ Implement role-based access control
- ✅ Use separate user_roles table (not on user/profile table)
- ✅ Validate all inputs
- ✅ Implement RLS policies in Supabase
- ✅ Hash passwords properly
- ✅ Implement rate limiting
- ✅ Log all sensitive operations
- ✅ Use prepared statements/ORM (no raw SQL)
- ✅ Implement CSRF protection
- ✅ Use HTTPS only
