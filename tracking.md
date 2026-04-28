# CCMS Task Tracking Board

> Last updated: 2026-04-27
>
> Legend: ⬜ Backlog &nbsp; 🔲 To Do &nbsp; 🔄 In Progress &nbsp; ✅ Done &nbsp; ❌ Blocked

---

## Phase 0 — Project Setup

| ID   | Task                                      | Status | Owner | Notes |
| ---- | ----------------------------------------- | ------ | ----- | ----- |
| P0-1 | Initialise project scaffold               |   ⬜    |       |       |
| P0-2 | Configure TypeScript, ESLint, Prettier    |   ⬜    |       |       |
| P0-3 | Setup PostgreSQL & Prisma schema          |   ⬜    |       |       |
| P0-4 | Seed database (categories, priorities)    |   ⬜    |       |       |
| P0-5 | Setup CI/CD pipeline (GitHub Actions)     |   ⬜    |       |       |
| P0-6 | Configure dev, staging, prod environments |   ⬜    |       |       |

---

## Phase 1 — Authentication  (US-01, US-02, US-03)

| ID   | Task                         | Status | Owner | Maps To |
| ---- | ---------------------------- | ------ | ----- | ------- |
| P1-1 | User model & Prisma migration |   ⬜    |       | —       |
| P1-2 | Register API endpoint         |   ⬜    |       | US-01   |
| P1-3 | Email verification flow       |   ⬜    |       | US-02   |
| P1-4 | Login API endpoint (JWT)      |   ⬜    |       | US-03   |
| P1-5 | Forgot / Reset password flow  |   ⬜    |       | US-01   |
| P1-6 | Auth middleware & role guard   |   ⬜    |       | —       |
| P1-7 | Frontend — Auth pages          |   ⬜    |       | US-01/02/03 |

---

## Phase 2 — Complaint CRUD, Customer  (US-04 → US-07)

| ID   | Task                              | Status | Owner | Maps To |
| ---- | --------------------------------- | ------ | ----- | ------- |
| P2-1 | Complaint model & Prisma migration |   ⬜    |       | —       |
| P2-2 | Create complaint API               |   ⬜    |       | US-04   |
| P2-3 | List my complaints API             |   ⬜    |       | US-05   |
| P2-4 | Get complaint detail API           |   ⬜    |       | US-05   |
| P2-5 | Update complaint API               |   ⬜    |       | US-06   |
| P2-6 | Delete complaint API               |   ⬜    |       | US-07   |
| P2-7 | Frontend — Complaint pages         |   ⬜    |       | US-04/05/06/07 |

---

## Phase 3 — Admin Features  (US-08 → US-11)

| ID   | Task                               | Status | Owner | Maps To |
| ---- | ---------------------------------- | ------ | ----- | ------- |
| P3-1 | List all complaints API (paginated)|   ⬜    |       | US-08   |
| P3-2 | Filter & search complaints API     |   ⬜    |       | US-08   |
| P3-3 | Assign complaint API               |   ⬜    |       | US-09   |
| P3-4 | Update status API (workflow)       |   ⬜    |       | US-10   |
| P3-5 | Dashboard stats API                |   ⬜    |       | US-11   |
| P3-6 | Frontend — Admin pages             |   ⬜    |       | US-08/09/10/11 |

---

## Phase 4 — Email Notifications

| ID   | Task                                | Status | Owner | Notes |
| ---- | ----------------------------------- | ------ | ----- | ----- |
| P4-1 | Email service setup                 |   ⬜    |       |       |
| P4-2 | Complaint created notification      |   ⬜    |       | Trigger on POST /complaints |
| P4-3 | Status change notification          |   ⬜    |       | Trigger on PATCH status |
| P4-4 | Assignment notification             |   ⬜    |       | Trigger on PATCH assign |

---

## Phase 5 — Polish & QA

| ID   | Task                         | Status | Owner | Notes |
| ---- | ---------------------------- | ------ | ----- | ----- |
| P5-1 | Input validation & error UX  |   ⬜    |       |       |
| P5-2 | Responsive design pass       |   ⬜    |       | Mobile + tablet |
| P5-3 | API integration tests        |   ⬜    |       |       |
| P5-4 | End-to-end tests             |   ⬜    |       |       |
| P5-5 | Performance audit & fixes    |   ⬜    |       | Lighthouse target ≥ 90 |
| P5-6 | Security audit               |   ⬜    |       | OWASP top 10 |

---

## Phase 6 — Deploy & Handover

| ID   | Task                              | Status | Owner | Notes |
| ---- | --------------------------------- | ------ | ----- | ----- |
| P6-1 | Production deployment             |   ⬜    |       |       |
| P6-2 | DNS / domain configuration        |   ⬜    |       |       |
| P6-3 | User acceptance testing (UAT)     |   ⬜    |       |       |
| P6-4 | Documentation & handover          |   ⬜    |       |       |

---

## Summary

| Metric              | Count |
| ------------------- | ----- |
| Total tasks         | 37    |
| Backlog             | 37    |
| To Do               | 0     |
| In Progress         | 0     |
| Done                | 0     |
| Blocked             | 0     |
| Estimated total hrs | ~145h |
| Estimated duration  | 20 days |
| User stories covered| 11/11 |
