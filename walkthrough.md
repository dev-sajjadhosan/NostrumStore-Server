# Walkthrough: Adding MANAGER and SUPER_ADMIN Roles to NostrumStore-Server

## Overview
This walkthrough documents all the changes made to fully implement the MANAGER and SUPER_ADMIN roles in the project. The MANAGER role was added to the Prisma schema (already present), and SUPER_ADMIN permissions were expanded across all admin routes.

## Changes Made

### 1. Prisma Schema Update
- **File**: `prisma/schema/auth.prisma`
- **Change**: The `MANAGER` role was already added to the `Role` enum. No changes needed here.
- **Status**: Confirmed enum includes: CUSTOMER, SELLER, ADMIN, SUPER_ADMIN, MANAGER

### 2. Route Guards Updates
Updated `restrictRole` middleware calls in route files to include SUPER_ADMIN and MANAGER where appropriate.

#### a. User Routes (`src/modules/user/user.routes.ts`)
- **/profile/role/:id** (PATCH): Added `restrictRole("ADMIN", "SUPER_ADMIN")` to prevent unauthorized role changes.
- **/admin/users** (GET): Added "SUPER_ADMIN", "MANAGER" to allow managers to view users.
- **/admin/metadata** (GET): Added "SUPER_ADMIN", "MANAGER" to allow managers access to admin metadata.
- **/admin/users/:id** (PATCH - updateUserStatus): Added "SUPER_ADMIN" (managers cannot change user status).
- **/admin/users/:id** (DELETE): Added "SUPER_ADMIN" (managers cannot delete users).

#### b. Categories Routes (`src/modules/categories/categories.routes.ts`)
- **/** (POST): Added "SUPER_ADMIN" to category creation.
- **/:id** (PUT): Added "SUPER_ADMIN" to category update.
- **/:id** (DELETE): Added "SUPER_ADMIN" to category deletion.
- **Note**: MANAGER does not have category management permissions.

#### c. Orders Routes (`src/modules/orders/orders.routes.ts`)
- **/admin/orders** (GET): Added "SUPER_ADMIN", "MANAGER" to allow managers to view all orders.
- **/seller/orders/:id** (PATCH): Added "SUPER_ADMIN", "MANAGER" to allow managers to update order status.

### 3. Seeding Updates
- **File**: `src/script/seedAdmin.ts`
- **Change**: No changes made. The existing seed creates an ADMIN user. For MANAGER, you can manually create a user with MANAGER role or extend the seed script.
- **Recommendation**: Add a similar seedManager function if needed for development.

### 4. Generated Types
- **Action**: Run `npx prisma generate` to update TypeScript types with the new MANAGER role.
- **Status**: Not executed in this session (as per user request to avoid long commands). Run this manually.

### 5. Migration
- **Action**: Run `npx prisma migrate dev --name add-manager-role` to apply schema changes to the database.
- **Status**: Not executed in this session. Run this manually after confirming schema.

## Permission Summary After Changes

### MANAGER Permissions
- View all users (`/admin/users`)
- View admin metadata (`/admin/metadata`)
- View all orders (`/admin/orders`)
- Update order status (`/seller/orders/:id`)
- **Cannot**: Change user roles, update user status, delete users, manage categories

### SUPER_ADMIN Permissions
- All ADMIN permissions
- Change user roles (`/profile/role/:id`)
- Update user status (`/admin/users/:id`)
- Delete users (`/admin/users/:id`)
- Manage categories (create, update, delete)
- All order management
- All other admin functions

## Next Steps
1. Run `npx prisma migrate dev` to update the database.
2. Run `npx prisma generate` to update TypeScript types.
3. Test all updated routes with different roles.
4. Create a MANAGER user in the database for testing.
5. Update frontend dashboards to handle MANAGER and SUPER_ADMIN roles.
6. Add role-based UI elements (e.g., hide/show menu items based on role).

## Files Modified
- `src/modules/user/user.routes.ts`
- `src/modules/categories/categories.routes.ts`
- `src/modules/orders/orders.routes.ts`

## Files Referenced (No Changes)
- `prisma/schema/auth.prisma` (MANAGER already present)
- `src/script/seedAdmin.ts`
- `src/middleware/restrictRoles.ts`
- `src/middleware/protect.ts`

## Testing Checklist
- [ ] Login as ADMIN: Can access all admin routes
- [ ] Login as SUPER_ADMIN: Can access all routes including role changes
- [ ] Login as MANAGER: Can view users, orders, metadata but not modify users or categories
- [ ] Login as CUSTOMER/SELLER: No access to admin routes
- [ ] Verify 403 errors for unauthorized access

This completes the backend implementation for MANAGER and SUPER_ADMIN roles.