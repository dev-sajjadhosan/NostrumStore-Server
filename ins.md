# Role-Based Dashboard Guide for NostrumStore-Server

## 1. Current Role Structure in This Project

The project currently uses Prisma enum roles defined in `prisma/schema/auth.prisma`:
- `CUSTOMER`
- `SELLER`
- `ADMIN`
- `SUPER_ADMIN`

These roles are used by the middleware in `src/middleware/restrictRoles.ts` and `src/middleware/protect.ts`.

## 2. Recommended Roles for a Multi-Role Dashboard

### 2.1 Core roles you need
1. `CUSTOMER`
   - General app user who places orders, reads reviews, and manages their own profile.
   - Dashboard: order history, profile, reviews, wishlist/search.

2. `SELLER` (or `VENDOR`)
   - A merchant or vendor who lists medicines/products, views seller orders, and manages inventory.
   - Dashboard: product listing, orders from customers, sales data, stock management.

3. `ADMIN`
   - Marketplace administrator with access to moderate categories, users, orders, and high-level reports.
   - Dashboard: user management, order management, category management, statistics, content moderation.

4. `SUPER_ADMIN`
   - Highest privilege user. Can manage admins and system-level configuration.
   - Dashboard: all admin screens plus system settings, migrations, billing, master user controls.

### 2.2 Optional additional roles
These are useful if you want finer separation inside the admin ecosystem:
- `MANAGER`
  - A limited admin who can manage specific business operations without full system control.
  - Good for delegated teams who should not change super-admin or admin settings.

- `VENDOR`
  - If you want separate naming from `SELLER` for marketplace concepts.
  - Use it when you want a distinct dashboard and permissions from sellers.

- `ORGANIZER`
  - Good for event, campaign, or promotions management.
  - Use this role if the business adds organized campaigns, exhibitions, or vendor events.

- `SUPPORT` / `CUSTOMER_SERVICE`
  - For support staff who can view and manage customer requests and orders but not edit products.

## 3. Permission Matrix for Each Role

### CUSTOMER
Permissions:
- View and update own profile
- Create, view, edit, cancel own orders
- Add reviews
- Browse categories and medicines
- Use authentication features: logout, refresh token, password change/reset

### SELLER / VENDOR
Permissions:
- Create/update/delete medicine listings
- View seller-specific orders
- Update order status for seller shipments
- View seller dashboard metadata
- Read own profile and limited user data connected to own products

### ADMIN
Permissions:
- Manage categories
- Manage users (view, edit, change role, disable)
- View all orders
- View admin dashboard metadata
- Approve or reject seller requests if implemented
- Moderate reviews or reports

### SUPER_ADMIN
Permissions:
- All `ADMIN` permissions
- Manage admin accounts and super admin settings
- Perform system-level tasks: schema/seed changes, global configuration, general access control
- Highest-level audit and override capability

### MANAGER (optional)
Permissions:
- View dashboards and reports
- Manage orders and customer data within assigned scope
- Limited user management
- No category schema or super-admin changes

### ORGANIZER (optional)
Permissions:
- Manage campaign/event-related data
- Coordinate vendor schedules or promotions
- Access event-specific dashboards and order summaries

## 4. What You Need to Change in the Code to Add a New Role

### Step 1: Update Prisma role enum
- Add the new role to `prisma/schema/auth.prisma`.
- Example:
  ```prisma
  enum Role {
    CUSTOMER
    SELLER
    ADMIN
    SUPER_ADMIN
    MANAGER
    VENDOR
    ORGANIZER
  }
  ```

### Step 2: Run Prisma migration
- Generate a migration so the database knows about the new enum values.
- Use `npx prisma migrate dev --name add-new-roles` or the project’s normal migration command.

### Step 3: Update server-side seeding / user creation
- Update `src/script/seedAdmin.ts` or any signup logic if you automatically create admin/vendor accounts.
- Ensure the new role is accepted by user creation endpoints.

### Step 4: Update type-safe role checks
- Change route guards like `restrictRole(...)` in `src/modules/**/*.routes.ts` to include the new role where appropriate.
- Example: `restrictRole("MANAGER", "ADMIN")`.

### Step 5: Update frontend/dashboard UI
- Build or update dashboards for new roles.
- Add navigation and screens specific to each role.
- Add role-based redirect logic after login.

### Step 6: Update documentation and tests
- Document the new role in README or role docs.
- Add tests or manual checks for routes that should accept or deny access to the new role.

## 5. How Much Time to Add a New Role?

### If you only need a new role in the backend access control:
- Small change: 30 minutes to 1 hour.
- This includes updating the Prisma enum, migration, backend route guards, and maybe seed data.

### If you also need a new dashboard + UI flows:
- Medium change: 1 to 2 days.
- This includes UI screens, menus, routing, and role-based navigation.

### If you need a complete new business flow (new data model, new permissions, new reports):
- Larger change: 2 to 5 days or more.
- Because you will likely update models, services, controllers, validation, and frontend pages.

## 6. Practical Role Recommendation for This Project

Based on the current code, the minimal useful roles are:
- `CUSTOMER` = buyer/user
- `SELLER` = product/vendor account
- `ADMIN` = marketplace admin
- `SUPER_ADMIN` = full system super admin

If you want a cleaner multi-role dashboard system, add one or two of these:
- `MANAGER` for delegated admin tasks
- `VENDOR` if you want a separate merchant identity from `SELLER`
- `ORGANIZER` if you plan campaign or event-related admin features

## 7. Route Authorization Summary in the Project

Currently the project already uses role guards in these modules:
- `src/modules/auth/auth.routes.ts`
- `src/modules/user/user.routes.ts`
- `src/modules/categories/categories.routes.ts`
- `src/modules/orders/orders.routes.ts`
- `src/modules/review/review.routes.ts`

So the core RBAC pattern is already implemented: protect the route with `protect`, then run `restrictRole(...)`.

## 8. A-to-Z Implementation Advice

A. Decide exact roles and permissions first.
B. Keep `CUSTOMER`, `SELLER`, `ADMIN`, `SUPER_ADMIN` as the base.
C. Add optional roles only if they map to real business needs.
D. Update Prisma enum and run migration.
E. Update all role checks in backend routes and services.
F. Add any new role UI elements in dashboard navigation.
G. Secure every protected route with `protect` + `restrictRole`.
H. Test each route with each role to avoid unauthorized access.
I. Keep permission logic simple: start broad, then narrow by need.
J. Document roles clearly for future developers.

## 9. Example Permission Grouping

Use permission groups if you later want to move beyond simple role lists:
- `product_management` = create/update/delete products
- `order_management` = view/update orders
- `user_management` = view/edit users
- `reporting` = access dashboards and metrics
- `system_management` = admin settings and super-admin actions

This project currently uses a role-first approach; if the product grows, you can extend it into role+permission-based RBAC later.

---

### Final note
For this codebase, the fastest safe path is:
1. Keep existing roles.
2. Add `MANAGER` or `VENDOR` only when the business needs them.
3. Use `restrictRole(...)` consistently for all secured routes.
4. Allow `SUPER_ADMIN` to remain the ultimate override role.

Your new role file is now created in `ins.md` with the full A-to-Z plan.