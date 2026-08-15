# CineDesk Pro: Film Production Management Platform

An enterprise-grade, RBAC-driven Film Production Management Platform engineered with TypeScript, Node.js, Express, InversifyJS (Dependency Injection), MongoDB / Mongoose, React, TailwindCSS, Zustand, Ant Design, and Cloudinary.

---

## 🌟 Executive Summary & Task Parity

CineDesk Pro is built from the ground up to solve internal film production logistics across productions, cast & crew, onboarding workflows, locations, fund approvals, costume inventory, and granular authorization.

### Key Architectural Pillars:
1. **Followed repository pattern architecture with SOLID Principles and inversifyJS**
2. **Clear Separation of Contractor Type vs System Role vs Permissions**:
   - **Contractor Type** (Freelancer, Cast, Supplier, Cast-Crew Agent, TCS Team, Intern) defines who the applicant is during the 6-step onboarding process.
   - **System Role** (Super Admin, Production Admin, Production Manager, Finance Manager, Location Manager, Costume Manager, Cast, Crew) defines the assigned role.
   - **Granular Permissions** (30+ atomic permission keys like `productions.view`, `funds.approve`, `locations.book`) dynamically govern API routes and UI widgets.
3. **Dynamic Live RBAC & Immediate Revocation**:
   - Permissions are queried live from the database per authenticated request (`authenticate.ts` re-populates role + permissions).
   - Removing a permission from a role in the DB restricts active users instantly without re-login.
4. **Resource-Level Authorization (Bonus & Core)**:
   - Production Managers can only modify productions they manage.
   - Self-approval prohibition on fund requests (`requesterId !== approverId`).
   - Location date-conflict prevention (`(existingStart <= newEnd) && (existingEnd >= newStart)`).
   - Costume availability state checks before assignment.
5. **Cloudinary File Upload & Storage**:
   - Direct streaming uploads of IDs, tax documents.
6. **6-Step Contractor Onboarding & Admin Approval**:
   - Public Signup -> Welcome -> Personal Information -> Financial -> Documents -> Sign -> Done (`pending_review`) -> Admin Review -> Approval & Role Assignment.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ and `npm`
- MongoDB running locally or MongoDB Atlas connection string
- env Implemented in both backend and frontend  check .env.example file if you want to run with your own credentials .set backend env at /src/config/.env and frontend env ar src/.env.

or check : https://docs.google.com/document/d/1SfOalkVF3YwukmvDfNBcLJzkL8jiD4cT9xd16aJr6gQ/edit?usp=sharing



### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Wipes & seeds 30 permissions, 8 roles, 11 users, productions, locations, funds, costumes, and logs
npm run dev      # Starts backend API server on http://localhost:3000
```
- **API Base URL**: `http://localhost:3000/api`
- **Interactive Swagger 3.0 API Docs**: `http://localhost:3000/apidocs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```
- Open browser at `http://localhost:5173`

---

## 🔑 Test Credentials (All 8 Roles + Test Accounts)

All seeded test accounts use the password: **`Password123!`**

| Email | System Role | Contractor Type | Purpose & Dashboard Scope |
| :--- | :--- | :--- | :--- |
| `superadmin@tendagon.test` | Super Admin | TCS Team | Full system access (`*` permission), RBAC role/permission management, system metrics |
| `prodadmin@tendagon.test` | Production Admin | TCS Team | Production administration, onboarding reviews, user role assignments |
| `pm@tendagon.test` | Production Manager | Freelancer | Manages assigned productions (*Dune*, *Cyberpunk*), cast/crew roster, location booking, fund requests |
| `finance@tendagon.test` | Finance Manager | TCS Team | Fund request reviews, approvals, rejection reasons & disbursements |
| `location@tendagon.test` | Location Manager | Freelancer | Filming location directory, permit management, shooting approvals |
| `costume@tendagon.test` | Costume Manager | Freelancer | Costume inventory, character wardrobe assignments & return tracking |
| `cast@tendagon.test` | Cast Member | Cast | Actor view: Assigned characters (*Paul Atreides*, *V*), call times, assigned costumes |
| `crew@tendagon.test` | Crew Member | Freelancer | Crew view: Assigned production rosters, call sheets & profile |
| `applicant@tendagon.test` | Pending Review | Cast | Test account with completed 6-step application in `pending_review` |
| `changes@tendagon.test` | Changes Requested | Freelancer | Test account with application in `changes_requested` (allows applicant resubmission) |
| `deactivated@tendagon.test` | Deactivated Account | Cast | **Security edge case**: Login returns `HTTP 403 Forbidden` |

