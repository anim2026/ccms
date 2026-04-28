# CCMS Development Plan

## Tech Stack (Recommended)

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React + TypeScript + Tailwind CSS   |
| Backend      | Node.js + Express (TypeScript)      |
| Database     | PostgreSQL + Prisma ORM             |
| Auth         | JWT + bcrypt                        |
| Email        | Nodemailer / SendGrid               |
| Validation   | Zod                                 |
| Testing      | Vitest (unit), Playwright (e2e)     |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Browser (SPA)                   │
│            React + React Router DOM              │
├─────────────────────────────────────────────────┤
│                  REST API Layer                  │
│                   Express.js                     │
├──────────────┬──────────────┬───────────────────┤
│  Auth Module │ Complaint Mod│  Admin Module     │
│  (register,  │ (CRUD,       │  (dashboard,      │
│   login,     │  status flow)│   assignment,     │
│   verify)    │              │   status update)  │
├──────────────┴──────────────┴───────────────────┤
│                  Prisma ORM                      │
├─────────────────────────────────────────────────┤
│                  PostgreSQL                      │
└─────────────────────────────────────────────────┘
```

### Data Model

```
User (id, email, password, role[Customer|Admin], verified, createdAt)
Complaint (id, title, description, categoryId, priorityId, statusId, userId, assignedAdminId, createdAt, updatedAt)
Category (id, name)
Priority (id, label)
Status   (id, label)
EmailToken (id, token, userId, expiresAt, type[Verify|Reset])
```

---

## Development Phases

### Phase 0 — Project Setup (Day 1–2)

| ID   | Task                                      | Est.    | Priority |
| ---- | ----------------------------------------- | ------- | -------- |
| P0-1 | Initialise monorepo / project scaffold    | 4h      | High     |
| P0-2 | Configure TypeScript, ESLint, Prettier    | 2h      | High     |
| P0-3 | Setup PostgreSQL & Prisma schema          | 4h      | High     |
| P0-4 | Seed database (categories, priorities)    | 2h      | Medium   |
| P0-5 | Setup CI/CD pipeline (GitHub Actions)     | 4h      | Medium   |
| P0-6 | Configure dev, staging, prod environments | 3h      | High     |

### Phase 1 — Authentication (Day 3–5)

| ID   | Task                         | Est. | Priority | Maps To |
| ---- | ---------------------------- | ---- | -------- | ------- |
| P1-1 | User model & Prisma migration | 2h  | High     | —       |
| P1-2 | Register API endpoint         | 4h  | High     | US-01   |
| P1-3 | Email verification flow       | 6h  | High     | US-02   |
| P1-4 | Login API endpoint (JWT)      | 4h  | High     | US-03   |
| P1-5 | Forgot / Reset password flow  | 4h  | Medium   | US-01   |
| P1-6 | Auth middleware & role guard   | 3h  | High     | —       |
| P1-7 | Frontend — Auth pages          | 8h  | High     | US-01/02/03 |

### Phase 2 — Complaint CRUD (Customer) (Day 6–9)

| ID   | Task                              | Est. | Priority | Maps To |
| ---- | --------------------------------- | ---- | -------- | ------- |
| P2-1 | Complaint model & Prisma migration | 2h  | High     | —       |
| P2-2 | Create complaint API               | 4h  | High     | US-04   |
| P2-3 | List my complaints API             | 3h  | High     | US-05   |
| P2-4 | Get complaint detail API           | 2h  | High     | US-05   |
| P2-5 | Update complaint API               | 3h  | High     | US-06   |
| P2-6 | Delete complaint API               | 2h  | High     | US-07   |
| P2-7 | Frontend — Complaint pages         | 12h | High     | US-04/05/06/07 |

### Phase 3 — Admin Features (Day 10–14)

| ID   | Task                               | Est. | Priority | Maps To |
| ---- | ---------------------------------- | ---- | -------- | ------- |
| P3-1 | List all complaints API (paginated)| 4h  | High     | US-08   |
| P3-2 | Filter & search complaints API     | 4h  | Medium   | US-08   |
| P3-3 | Assign complaint API               | 3h  | High     | US-09   |
| P3-4 | Update status API (workflow)       | 4h  | High     | US-10   |
| P3-5 | Dashboard stats API                | 4h  | High     | US-11   |
| P3-6 | Frontend — Admin pages             | 16h | High     | US-08/09/10/11 |

### Phase 4 — Email Notifications (Day 15–16)

| ID   | Task                                | Est. | Priority |
| ---- | ----------------------------------- | ---- | -------- |
| P4-1 | Email service setup                 | 3h  | Medium   |
| P4-2 | Complaint created notification      | 2h  | Medium   |
| P4-3 | Status change notification          | 2h  | Medium   |
| P4-4 | Assignment notification             | 2h  | Medium   |

### Phase 5 — Polish & QA (Day 17–19)

| ID   | Task                         | Est. | Priority |
| ---- | ---------------------------- | ---- | -------- |
| P5-1 | Input validation & error UX  | 4h   | Medium   |
| P5-2 | Responsive design pass       | 4h   | Medium   |
| P5-3 | API integration tests        | 6h   | High     |
| P5-4 | End-to-end tests             | 6h   | High     |
| P5-5 | Performance audit & fixes    | 3h   | Low      |
| P5-6 | Security audit               | 3h   | High     |

### Phase 6 — Deploy & Handover (Day 20)

| ID   | Task                              | Est. | Priority |
| ---- | --------------------------------- | ---- | -------- |
| P6-1 | Production deployment             | 4h   | High     |
| P6-2 | DNS / domain configuration        | 1h   | High     |
| P6-3 | User acceptance testing (UAT)     | 4h   | High     |
| P6-4 | Documentation & handover          | 3h   | Medium   |

---

## Milestones

| MS  | Date     | Deliverable                              |
| --- | -------- | ---------------------------------------- |
| M1  | Day 2    | Scaffold, DB schema, CI/CD ready          |
| M2  | Day 5    | Auth flow complete (register, login, verify) |
| M3  | Day 9    | Customer complaint CRUD complete          |
| M4  | Day 14   | Admin features complete                   |
| M5  | Day 16   | Email notifications complete              |
| M6  | Day 19   | Testing & polish complete                 |
| M7  | Day 20   | Production go-live                        |

---

## Status Workflow State Machine

```
       ┌──────────┐
       │   Open   │
       └────┬─────┘
            │
            ▼
       ┌──────────┐
       │In Progress│
       └────┬─────┘
            │
            ▼
       ┌──────────┐
       │ Resolved │
       └────┬─────┘
            │
            ▼
       ┌──────────┐
       │  Closed  │ (terminal)
       └──────────┘
```

### Transition Rules

| From         | To            | Who    | Condition                    |
| ------------ | ------------- | ------ | ---------------------------- |
| Open         | In Progress   | Admin  | Assigned admin only          |
| In Progress  | Resolved      | Admin  | Assigned admin only          |
| Resolved     | Closed        | Admin  | Assigned admin only          |
| Open         | Resolved      | Admin  | Skip if applicable           |
| * (not Closed)| *            | Admin  | Allow manual override        |

- Customer can only EDIT complaint when status ≠ Closed.
- Customer can only DELETE complaint when status = Open.

---

## Risk Register

| Risk                     | Impact | Likelihood | Mitigation                                |
| ------------------------ | ------ | ---------- | ----------------------------------------- |
| Scope creep              | High   | Medium     | Strict phase-based delivery, change log   |
| Email deliverability     | Medium | Medium     | Use transactional email service (SendGrid)|
| Security vulnerability   | High   | Low        | Helmet, rate-limit, CORS, input validation|
| DB performance           | Medium | Low        | Indexes on foreign keys, pagination       |

---

## Change Log

| Date       | Change                          | Reason |
| ---------- | ------------------------------- | ------ |
| 2026-04-27 | Initial development plan created| —      |
