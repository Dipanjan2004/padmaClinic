# System Architecture: Padma Clinic Management System

| | |
|---|---|
| Version | 0.1 (draft, awaiting review) |
| Date | 2026-11-01 |
| Builds on | `PROJECT_REQUIREMENTS.md` v0.3 and decisions D-005 to D-017 |

---

## 1. Summary

- **One Next.js app on Vercel** serves the public website (`/`) and the internal clinic app (`/staff`). It talks to **one Supabase project** in Mumbai: Postgres, Auth, Realtime and Storage.
- **Phone first** for patients and staff (D-012). Clinic computers get the same app with more room on screen.
- **The database protects the data.** Row Level Security decides who sees what. Constraints and Postgres functions enforce the business rules. The Next.js code validates input and gives clear messages, but it is not the last line of defence (D-014).
- **Realtime only signals "something changed".** Screens then re-read the database, so missed or duplicate events never leave a screen wrong (D-015).
- **No servers to run.** Production costs about ₹2,200–4,000 a month plus a domain, and the home computer is never needed (§15).

## 2. Design principles

1. **The database is the source of truth.** Every screen can be rebuilt from it at any moment.
2. **Defence in layers.** The UI hides what you can't do, the server refuses it, and the database blocks it.
3. **Plain, boring technology.** Every dependency must earn its place. No microservices, no separate API server, no ORM.
4. **Phone first, weak network assumed.** Small pages, large touch targets, safe retries, and a clear signal when the connection drops.
5. **Nothing clinical is ever lost or silently changed.** Records are append-only or versioned, and every sensitive action is audited.
6. **No hardcoded business facts.** Clinic details, doctors, fees and sessions all live in the database.

## 3. System overview

```
   Patients (phones)                          Staff (mostly phones; also chamber, reception
        │                                      and chemist-shop computers)
        │ HTTPS                                           │ HTTPS, logged in
        ▼                                                 ▼
┌────────────────────────── Vercel · Mumbai (bom1) ──────────────────────────┐
│  One Next.js app                                                            │
│   /…        public website: pre-rendered, cached, no patient data           │
│   /staff/…  internal app: rendered per user, never cached or indexed        │
│   Server Actions: check the session → validate with Zod → call the database │
└───────────────┬───────────────────────────────────────────┬────────────────┘
                │ as the logged-in user (RLS applies)       │ secret key, server only
                │                                           │ (staff account admin)
                ▼                                           ▼
┌────────────────────────── Supabase · Mumbai (ap-south-1) ──────────────────┐
│  Postgres   tables · RLS policies · constraints · functions · audit triggers│
│  Auth       staff accounts and sessions                                     │
│  Realtime   "row changed" signals, filtered by RLS                          │
│  Storage    public bucket for doctor photos and the logo (no patient files) │
└─────────────────────────────────────────────────────────────────────────────┘
        ▲
        └── Each logged-in browser holds a Realtime connection straight to Supabase

Printing:  browser print dialog on a reception or pharmacy device → local or Wi-Fi printer
Around it: Cloudflare (DNS, Turnstile spam check, R2 backup storage) · Sentry (errors)
           · uptime monitor · GitHub (code, scheduled backup job)
```

| Component | Job | Notes |
|---|---|---|
| Next.js app | Pages, Server Actions, print layouts, health check | Single deployable. Functions run in Mumbai. |
| Supabase Postgres | All data and business rules | Migrations in `supabase/migrations/` |
| Supabase Auth | Staff logins and sessions | No public sign-up (D-013) |
| Supabase Realtime | Live queue, requests and prescription alerts | Signals only (D-015) |
| Supabase Storage | Public website images | Patient documents are out of scope |
| Cloudflare | DNS, Turnstile, R2 | Free tiers |
| Sentry | Error tracking for browser and server | Free tier. Patient data is scrubbed from reports. |
| Uptime monitor | Pings `/api/health` | For example UptimeRobot (free) |

## 4. Tech stack (approved, D-009)

| Concern | Choice | Why this one |
|---|---|---|
| Framework | Next.js (App Router), React, TypeScript in strict mode | One app for the website and the internal app. Pre-rendering for SEO. Server Actions mean no separate API. |
| UI | Tailwind CSS, shadcn/ui, Lucide | Accessible components we own and can adapt, with consistent styling |
| Forms | React Hook Form and Zod | The same Zod schema checks the form on the phone and again on the server |
| Live data | TanStack Query, used only on live screens | Handles refetch on reconnect, on focus and on a timer, and shows a stale-data state |
| Database | Supabase Postgres | Real constraints, transactions, exclusion constraints and RLS |
| Data access | `supabase-js` with generated TypeScript types | Queries run as the user, so RLS always applies |
| Schema changes | SQL migrations through the Supabase CLI | Reviewable and repeatable. Never edited after they are applied. |
| Auth | Supabase Auth through `@supabase/ssr` (cookie sessions) | Works with server rendering and Server Actions |
| Realtime | Supabase Realtime | Already included, and it respects RLS |
| Charts | Recharts | Admin reports only |
| Printing | Browser print with print CSS (`@page A4`) | No print server needed (D-006) |
| Spam protection | Cloudflare Turnstile | Free and privacy-friendly. Used on public forms. |
| Errors | Sentry | Free tier |
| Tests | Vitest (logic), Playwright (real workflows on phone and desktop sizes), pgTAP (RLS, constraints, functions) | §13 |
| Tooling | pnpm, ESLint, Prettier, Node LTS | Exact versions are pinned in Phase 1 |

**Deliberately not used:**
- **Prisma or Drizzle:** they connect as a privileged user and bypass RLS.
- **A separate Express or Nest backend:** Server Actions cover the need, and a second server would be one more thing to run.
- **Redux or Zustand:** the server state lives in TanStack Query, and the rest is local component state.
- **GraphQL:** unnecessary.
- **A paid SMS provider:** cost, plus DLT registration.
- **Any AI service:** BR-13.

## 5. Application structure

### 5.1 URL map

| Area | Paths | Who |
|---|---|---|
| Website | `/`, `/about`, `/doctors`, `/doctors/[slug]`, `/services`, `/book`, `/contact` | Everyone |
| Login | `/login` | Staff |
| Reception | `/staff/reception/…`: today, requests, appointments, patients, payments | Receptionist, admin |
| Doctor | `/staff/doctor/…`: today's queue, consultation, patient history | Doctor |
| Pharmacy | `/staff/pharmacy/…`: new prescriptions, search | Pharmacy staff |
| Admin | `/staff/admin/…`: doctors, sessions, chambers, fees, staff, website content, reports, audit log, settings | Owner/admin |
| Print | `/staff/print/…`: prescription, payment receipt, appointment slip | Staff allowed to print that document |
| System | `/api/health`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Monitors, search engines, browsers |

After login, each person lands on their role's home. Everything under `/staff` is `noindex` and `no-store`.

### 5.2 Folder layout

```
padmaClinic/
├─ CLAUDE.md
├─ Docs/
├─ src/
│  ├─ app/
│  │  ├─ (public)/              website pages and their layout
│  │  ├─ (staff)/staff/         internal app: reception/ doctor/ pharmacy/ admin/ print/
│  │  ├─ login/
│  │  ├─ api/health/
│  │  └─ sitemap.ts · robots.ts · manifest.ts
│  ├─ features/                 one folder per business module (§5.3)
│  │  └─ <module>/
│  │     ├─ schemas.ts          Zod schemas, shared by the form and the server
│  │     ├─ queries.ts          reads
│  │     ├─ actions.ts          Server Actions (writes)
│  │     └─ components/         UI that belongs to this module
│  ├─ components/ui/            shadcn/ui components
│  ├─ components/               shared shell: navigation, page layout, status badges
│  └─ lib/
│     ├─ supabase/              server.ts · browser.ts · admin.ts (server-only, secret key)
│     ├─ auth.ts                current user, role and guard helpers
│     ├─ dates.ts               Asia/Kolkata helpers
│     └─ money.ts               paise ↔ rupees formatting
├─ supabase/
│  ├─ migrations/               the schema's single source of truth
│  ├─ tests/                    pgTAP tests
│  └─ seed.sql                  synthetic data only
└─ tests/e2e/                   Playwright tests of real workflows
```

A module may use another module's `queries.ts` and `actions.ts` but never reaches into its components or internals. A screen in `app/` composes modules and contains no business logic.

### 5.3 Modules

| Module | Owns |
|---|---|
| `clinic-settings` | Clinic details, payment methods, print and auto-print settings |
| `website-content` | About text, services, public doctor profiles, featured items |
| `staff` | Staff accounts, roles, activation, session sign-out |
| `schedules` | Doctors, chambers, weekly sessions, exceptions and leave, session delays (D-011) |
| `patients` | Registry, search, duplicate warnings, merge |
| `appointments` | Requests, booking, serial numbers, estimated times, reschedule, cancel, no-show |
| `visits` | Check-in, walk-ins, the queue and its order, overrides |
| `payments` | Fee lookup, collection, receipts, refunds and corrections |
| `consultations` | Symptoms, findings, notes, diagnosis, investigations, follow-up |
| `prescriptions` | Medicine catalogue, editor, finalize, numbering, amendments, print records |
| `notifications` | In-app notifications, WhatsApp click-to-chat message links |
| `reports` | Daily, weekly and monthly reports and collections |
| `audit` | Audit log viewer (the writing is done by database triggers) |

## 6. How a request works

### 6.1 Reading
- **Ordinary pages** are React Server Components. They read through the server Supabase client using the user's session, so RLS filters every row.
- **Live screens**, such as the queue, the request inbox and pharmacy alerts, load their first data on the server, then hand over to TanStack Query in the browser, which keeps them fresh (§9).
- **Public pages** are pre-rendered and cached. When the admin edits website content, the affected pages are re-generated.

### 6.2 Writing (staff)
1. A form is validated in the browser with the module's Zod schema. This is for speed only.
2. A Server Action runs on Vercel. It verifies the session (`getClaims()` or `getUser()`, never `getSession()` alone), validates the input with the same Zod schema and checks the role.
3. It calls the database:
   - Simple edits go through as an `insert` or `update` under RLS.
   - Anything with several steps, or that changes a status, calls a Postgres function, such as `confirm_appointment`, `check_in_patient`, `record_payment` or `finalize_prescription`. The function runs as one transaction, re-checks the caller's permission and enforces the rule.
4. Every write carries a `client_request_id`, a UUID created when the form opens. A unique constraint makes a retried or double-tapped submit return the original result instead of creating a duplicate (D-014).
5. Records that can be edited carry a `version` number. If two people edit at once, the second gets "Someone else changed this. Here is the latest version." Nothing is overwritten silently.
6. Errors come back as plain messages, such as "This session is full" or "Payment already recorded", never stack traces.

### 6.3 Public appointment request
1. The patient fills in `/book` on their phone. The Turnstile check runs invisibly.
2. A Server Action verifies Turnstile with Cloudflare and validates the input with Zod.
3. It calls the database function `submit_appointment_request(…)`, which is the only thing the public role is allowed to call. The function:
   - applies rate limits (requests per phone number per day, and per IP address per hour, with the IP stored only as a hash);
   - inserts a `REQUESTED` appointment request;
   - returns only a reference number.
4. Reception gets a live notification.
5. The public role can read the published website content and a function that returns **remaining capacity per session**. That is counts only, never names or bookings. It cannot read any patient table.

### 6.4 Staff account administration
Creating staff accounts, resetting passwords and signing someone out of all their devices are done with the Supabase secret key. The key lives only in `lib/supabase/admin.ts`, which is marked `server-only` so the build fails if it is ever imported into browser code. Only admin Server Actions use it, and every use is audited.

## 7. Where each business rule is enforced

| Rule | Database enforcement | App's role |
|---|---|---|
| No double booking (BR-05, D-011) | Unique (`session_id`, `serial_no`). The booking function locks the session row, checks capacity, then assigns the next serial. | Shows the remaining places |
| No overlapping chamber use (BR-05) | Exclusion constraint on (chamber, time range) | Highlights clashes in the schedule editor |
| Statuses kept separate, with valid transitions only (BR-14) | Separate status columns. Changes go through functions only, and direct `UPDATE` on status columns is revoked. | Shows only the actions that are valid now |
| Ready for consultation = arrived + paid (BR-04) | Checked inside the queue function | Shows why a patient isn't ready yet |
| Walk-in overrides need a reason (BR-03) | The override function requires a non-empty reason, which is audited | A reason field in the override dialog |
| Finalized prescriptions are locked (BR-07, BR-10) | A trigger rejects changes to finalized prescriptions and their items. An amendment is a new row linked to the original. | An "Amend" flow in place of an edit button |
| Unique prescription number (BR-08) | Assigned inside `finalize_prescription` from a counter, with a unique constraint | Shows the number after finalizing |
| Only the prescribing doctor finalizes (FR-RX-05) | RLS, plus a check inside the function | The button appears only for that doctor |
| Payments are append-only (BR-09) | No `UPDATE` or `DELETE` rights on payment tables. Refunds and corrections are new rows linked to the original. | Refund and correction dialogs |
| Fees set only by admins (BR-11) | RLS on the fee tables | The admin screen |
| Audit trail (NFR-SEC-07) | Triggers write to an append-only `audit_logs` table | The viewer |
| Input shape and limits | `CHECK` constraints on critical columns | Zod on every Server Action |

The full detail goes in `DATABASE_SCHEMA.md`.

## 8. Authentication, sessions and access control

- **Login:** a username and password (D-013). The admin creates each account and assigns its role. There is no public sign-up, and passwords are hashed by Supabase Auth.
- **Roles:** stored in a database table, not only inside the login token, so **deactivating someone takes effect immediately**. RLS policies call one small helper that reads the current user's role and active flag.
- **Route protection:**
  - `proxy.ts` (called `middleware.ts` before Next.js 16) only refreshes the session cookie and redirects logged-out visitors to `/login`. It is never trusted for authorization.
  - Every Server Action and staff page checks the session and role again.
  - RLS is the final check.
- **Sessions on phones:**
  - Staff stay logged in for the working day.
  - After an inactivity timeout, the app locks and asks for the password again.
  - The admin can sign a person out of all their devices, for example when a phone is lost.
  - Supabase Pro provides session lifetime and inactivity limits. The exact values go in `USER_ROLES_AND_PERMISSIONS.md`.
- The full permission matrix goes in `USER_ROLES_AND_PERMISSIONS.md`, the next document.

## 9. Realtime and data freshness (D-015)

- Live screens subscribe to changes on just the tables they show, filtered to the doctor or the day. Realtime applies RLS, so nobody receives changes they can't read.
- **An event never updates the screen directly.** It marks the matching TanStack Query data as stale, and the screen re-reads it from the database. As a result:
  - **Duplicate events** cause one harmless extra read.
  - **Missed events**, such as a phone that was locked or a dropped connection, are caught on reconnect, when the tab comes back into view, and by a 60-second background refresh.
  - **Out-of-order events** don't matter, because the database answer is always the current one.
- A small banner shows **"Offline: changes can't be saved"** or **"Reconnecting…"**. While offline, save buttons are disabled instead of failing silently.
- Persisted notifications (FR-NOT-02) are rows in a `notifications` table. The live event is only the doorbell.
- **Phone limitation:** phones pause background tabs, so a doctor who switches to WhatsApp sees the queue update when they come back, not while they are away. Push notifications to a locked phone (Web Push) are a later enhancement (§16).

## 10. Phone-first design (D-012)

**For everyone**
- Layouts are designed at 360–400 px width first and expand at tablet and desktop sizes.
- Touch targets are at least 44 px. The main action sits in a bottom bar within thumb reach. Inputs use the correct mobile keyboard: number pad for phone numbers, amounts and ages.
- Phone numbers are stored in a single +91 format, so searching works however a number was typed.
- WhatsApp links (`wa.me`) open the WhatsApp app directly with the message filled in.

**Public website**
- Pages are pre-rendered and carry very little JavaScript. Images are resized and served in modern formats, and fonts are kept to a minimum.
- Target: the main content appears within 2.5 seconds on a mid-range Android phone over 4G (LCP ≤ 2.5 s, CLS < 0.1, INP < 200 ms).
- "Call", "WhatsApp" and "Book" buttons are always one tap away.

**Internal app**
- On phones there is a bottom tab bar per role: for reception Today, Requests, Patients and Payments, and for the doctor Queue and Patients. Computers get a sidebar.
- Tables become cards on phones.
- **Prescription entry** works on both:
  - on a phone, a search-as-you-type medicine picker, quick-pick dosage patterns (for example 1-0-1), duration chips and "repeat last prescription";
  - on a computer, keyboard shortcuts as well.
- The app can be installed on the home screen as a PWA, so it opens like an app without the browser bar. **No patient data is cached for offline use** (D-016), and a lost phone is handled by signing that person out remotely.

**Two phone limits to plan around**

| Limit | Plan |
|---|---|
| A phone can't print to a USB printer plugged into a PC | Print from the reception or pharmacy computer, **or** use a Wi-Fi printer that phones can reach. Printers are bought or set up accordingly (Q-17). |
| Patient data is shown on staff's personal phones | Inactivity lock, remote sign-out, no offline storage and an audit of record views. The staff device policy is in `USER_ROLES_AND_PERMISSIONS.md`. |

## 11. Printing

- Each document has a print-only route under `/staff/print/…`, such as a prescription, payment receipt or appointment slip. It renders clean HTML with print CSS (`@page { size: A4 }`) and has no navigation.
- The flow is: tap **Print**, the print page opens, the browser's print dialog appears, then the local or Wi-Fi printer prints. The app records who printed what, when and from which role (FR-DST-03).
- Prescriptions can be reprinted at any time, so a jammed or offline printer never blocks the clinic (FR-DST-04).
- **Auto-print** is off by default (FR-DST-02). Browsers can't print silently. If silent printing is needed later, the options are a reception or pharmacy computer running Chrome in kiosk-printing mode, or a small local print agent (D-006).
- Smaller formats (A5, thermal receipts) are new print layouts later, with no architecture change.

## 12. Security

- **Transport:** HTTPS only, with HSTS.
- **Headers:** a Content-Security-Policy, `frame-ancestors 'none'`, a strict `Referrer-Policy` and `X-Content-Type-Options`.
- **Secrets:** the publishable key is the only one in the browser. The secret key, the Turnstile secret and the Sentry auth token exist only in Vercel's server environment variables, and the `server-only` import guard enforces this.
- **Access:** three layers, the UI, then the Server Action check, then RLS and database functions. RLS is switched on for **every** table, including tables the public role never touches.
- **Public surface:** the public role can call one write function (the appointment request) and read published website content and session capacity. That is all.
- **Common attacks:**
  - Server Actions check the request origin, which protects against CSRF.
  - React escapes output (XSS).
  - Parameterised queries prevent SQL injection.
  - Zod limits field sizes.
  - Uploads are restricted to admin image uploads, checked by type and size.
- **Audit:** triggers log creates, changes and status changes on sensitive tables. Opening a patient record or prescription is also logged. The audit table has no update or delete rights for anyone.
- **Error reports:** Sentry is set up to drop request bodies and form values, so patient data never leaves our database through error reports.
- **Development:** synthetic data only (BR-15). Real data never leaves production, and staging is seeded from `seed.sql`.
- **Legal items** in `PROJECT_REQUIREMENTS.md` §8 are still open and must be checked before go-live.

## 13. Environments, testing and deployment

| Environment | Database | App | Data |
|---|---|---|---|
| Local | Supabase CLI stack (Docker) on the home computer | `pnpm dev` | `seed.sql` (synthetic) |
| Staging | Supabase free project | Vercel preview deployments | Synthetic |
| Production | Supabase Pro, Mumbai | Vercel Pro, Mumbai functions | Real |

- **Code:** a private GitHub repository. Pull requests produce preview deployments against staging, and merging to `main` deploys production.
- **Migrations:** written locally and tested with pgTAP. They are applied to staging first, then to production with the Supabase CLI. Each migration is a new file and is never edited.
- **Tests that gate a release:**
  - pgTAP for RLS (one test per role per sensitive table), constraints and functions;
  - Vitest for pure logic such as estimated times, fee rules and number formats;
  - Playwright for the real workflows: request → confirm → check-in → pay → queue → consult → finalize → print. Each runs at **phone size and desktop size**, with several users at once.
- **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `SENTRY_DSN` and `APP_BASE_URL`.

## 14. Backups, monitoring and outages

**Backups (NFR-REL-04, D-017)**
- Supabase Pro takes daily backups and keeps them for 7 days.
- A weekly GitHub Actions job takes an encrypted `pg_dump`, uploads it to Cloudflare R2 and keeps 12 weeks of history. The decryption key is held offline by the owner.
- Website images in Supabase Storage are not in database backups. The originals are kept by the clinic.
- **Restore drill every quarter:** restore the latest dump into staging, run the checks and write down the result. A backup only counts once it has been restored successfully.

**Monitoring (NFR-REL-05)**
- Sentry alerts on new errors.
- An uptime monitor checks `/api/health` every 5 minutes. The health check confirms the database answers, and alerts go to the owner's and developer's phones.
- Supabase usage alerts warn about database size and connection limits.

**Outages (NFR-REL-07)**

| Situation | What happens | What staff do |
|---|---|---|
| Clinic broadband is down | Staff phones on mobile data keep working, which is a real benefit of going phone-first | Carry on. Computers can use a phone hotspot. |
| Power cut | Phones keep working. The router and printer go off. | A UPS for the router and the reception printer |
| No internet at all, or Vercel or Supabase is down | The system is unavailable | **Paper fallback:** print the day's session lists each morning, issue paper token slips, write prescriptions on letterhead. Afterwards, enter them through a "record past visit" screen that keeps the original times. The full procedure goes in `WORKFLOW_SPECIFICATION.md`. |

## 15. Cost (D-010)

| Item | Development | Production (per month unless noted) |
|---|---|---|
| Supabase | Free (local, plus a free staging project) | Pro, about US$25 |
| Vercel | Not needed for local work | Pro, about US$20 (the Hobby plan forbids commercial use). Alternative: Cloudflare, free but more setup. |
| Domain | — | About ₹800–1,500 per year [TBD: domain, Q-15] |
| Cloudflare DNS, Turnstile, R2 (≤10 GB) | Free | Free |
| Sentry, uptime monitor, GitHub | Free tiers | Free tiers |
| **Total** | **₹0** | **About ₹2,200–4,000 per month, plus the domain** |

Prices are approximate. Check them before buying (Q-05). There is no hardware to buy apart from a UPS and, if needed, a Wi-Fi printer.

## 16. Ready for later (not built now)

| Future feature | What the architecture already allows |
|---|---|
| Pharmacy module (inventory, sales, udhar) | New `pharmacy` module and tables that reference `prescriptions.id`. The pharmacy role already exists. Prescriptions are never changed by the pharmacy. |
| WhatsApp Business API, reminders | The `notifications` module builds the patient messages today. Later it sends them through the API instead of making `wa.me` links. |
| Push notifications to locked phones | The PWA is already installable. Add a service worker and Web Push. |
| Online payments | Payments already record a method and a reference. A payment gateway becomes another method plus a webhook route. |
| Patient portal | A separate `patient` role in RLS. Patient records already have stable IDs. |
| Multiple branches | Not modelled now (A-05). Adding a `clinic_id` later is a planned migration. |
| Offline mode | Deliberately excluded for now (D-016). It would need its own design for privacy and conflicts. |
| Silent printing | Kiosk-mode Chrome or a local print agent (§11) |

## 17. Open points that affect the architecture

| ID | Point | Default until answered |
|---|---|---|
| Q-04 | Languages for the website and prescriptions (English, Bengali, Hindi?) | English only. If another language is needed, add translation support before Phase 7 (website) and Phase 6 (prescription print). |
| Q-05 | Production hosting budget | Vercel Pro (D-010) |
| Q-17 | Printers: USB on a PC, or Wi-Fi so phones can print? | Print from the reception and pharmacy computers |
| Q-18 | Do staff use their own phones or clinic-owned phones? | Own phones, with the safeguards in §10 |
