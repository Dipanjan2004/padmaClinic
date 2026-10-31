# Decisions log

This is the binding record of the choices made for this project. Claude adds an entry whenever the user decides something, in the same turn. Nothing counts as decided until it is written here. To change a decision, add a new entry and mark the old one as superseded. Never rewrite history.

Status key:
- ✅ **Decided**: by the user, or stated in the brief (`idea.md`).
- 🟡 **Default**: Claude's choice so work can continue. It holds until the user overrides it.
- ⏳ **Pending**: Claude has proposed it and is waiting for the user.
- 🔁 **Superseded**: replaced by a later entry.

---

### D-001: Work in baby steps
- 2026-11-01 · Source: user · ✅ Decided
- One document or feature slice at a time. Claude stops after each step and waits for the user's review before starting the next.

### D-002: Ask one question at a time
- 2026-11-01 · Source: user (`idea.md` §19) · ✅ Decided
- Claude asks only the questions that matter, one at a time. The rest wait under *Open questions* in `PROJECT_REQUIREMENTS.md`.

### D-003: Project memory lives in the repository
- 2026-11-01 · Source: user · ✅ Decided
- `CLAUDE.md` holds the standing instructions, and this file holds the choices. `CLAUDE.md` imports this file, so every session starts with all of the decisions loaded.

### D-004: Release 1 is Padma Clinic; the pharmacy gets prescription access only
- 2026-11-01 · Source: brief · ✅ Decided
- Pharmacy staff can be notified about, search, view and print finalized prescriptions, and nothing more. Inventory, sales, suppliers and the credit ledger come later.

### D-005: Modular monolith
- 2026-11-01 · Source: brief · ✅ Decided
- One application with one backend. No microservices.

### D-006: Browser-based printing
- 2026-11-01 · Source: brief · ✅ Decided
- Printing goes through the browser's print dialog to the local printers at reception and the pharmacy. A local print agent will be considered only if silent auto-printing becomes necessary.

### D-007: Cloud hosted, used through a browser
- 2026-11-01 · Source: brief · ✅ Decided
- Production must not depend on the home computer. No VPS unless there is a specific justification.

### D-008: Order of the Phase 0 documents
- 2026-11-01 · Source: Claude · 🟡 Default
- The order is Requirements, Architecture, Roles and Permissions, Database Schema, Workflows, then Roadmap. Each document builds on the previous one.

### D-009: Tech stack
- 2026-11-01 · Source: Claude proposal, approved by the user on 2026-11-01 · ✅ Decided
- Keep the brief's stack: Next.js, React, TypeScript, Tailwind, shadcn/ui, Lucide, React Hook Form, Zod, Supabase (Postgres, Auth and Realtime), Recharts and Vercel.
- **One Next.js app** serves both the public website and the internal app, with separate route groups and layouts.
- **No ORM.** Use `supabase-js` with generated TypeScript types and plain SQL migrations through the Supabase CLI. Queries then run as the logged-in user, so Row Level Security always applies. Prisma or Drizzle would connect as a privileged database user and bypass it.
- **Additions:**
  - TanStack Query for the live internal screens. A realtime event triggers a refetch from the database, which copes with missed or duplicate events.
  - Cloudflare Turnstile to block spam on the public appointment form (free).
  - Sentry for error tracking (free tier).
  - Vitest, Playwright, and pgTAP for database tests.
  - pnpm as the package manager.
- **Region:** Supabase Mumbai (`ap-south-1`).
- **Development:** a local Supabase stack (the Supabase CLI running on Docker) on the home computer.

### D-010: Production infrastructure and monthly cost
- 2026-11-01 · Source: Claude proposal · ⏳ Pending (needed before Phase 8, not before)
- **Supabase Pro (~US$25/month) is required in production.** The free plan has no automatic backups and pauses after a week of inactivity, which is unacceptable for patient records. Free projects are fine for development and staging.
- **Vercel's Hobby (free) plan forbids commercial use**, so the clinic's production site needs **Vercel Pro (~US$20/month)**. The alternative is Cloudflare Workers, whose free tier allows commercial use but runs Next.js through an adapter, which means more setup and occasional incompatibilities.
- Claude recommends Vercel Pro as the lowest-risk option.
- Prices are approximate. Verify them before buying.

### D-011: Booking model: serial order within a session, with an estimated time
- 2026-11-01 · Source: user (answer to Q-01) · ✅ The principle is decided. 🟡 The details are Claude's default.
- **What the user said:** timings vary. If the doctor comes late, the timings change, and the receptionist updates them.
- **Principle:** a patient's place in the line is fixed. Their time is only an estimate, and reception can move it.
- **Details (Claude's default):**
  - Each doctor's schedule is made of **sessions**, for example Monday 18:00–21:00.
  - An appointment is a place in one session. It has a **serial number** and an **estimated time**.
  - Estimated time = session start + (serial − 1) × the doctor's average consultation time. Reception can edit any single time.
  - **When the doctor is late,** reception enters the delay once (for example "+30 min"). Every estimated time after that point moves by the same amount. The app then lists the affected patients, each with a ready-made WhatsApp message.
  - Each session has a **maximum number of patients**. Double booking is prevented because a serial number is unique within its session and a session can't go over its maximum. Overlapping time ranges are not used for this.
  - The website and reception always show times as approximate ("about 6:30 pm").
  - The rules for walk-ins and the queue go in `WORKFLOW_SPECIFICATION.md`.

### D-012: Mobile-first, for patients and staff
- 2026-11-01 · Source: user · ✅ Decided. 🟡 The interpretation is Claude's default.
- **What the user said:** about 99% of users will use the system on a phone.
- **Interpretation:** this covers staff as well as patients. Every screen, including reception, doctor, pharmacy and admin, is designed for a phone first and expands for computers. This replaces the brief's "internal app optimised for desktop". The computers in the chambers, at reception and at the chemist shop remain fully supported.
- If staff will in fact mostly use the clinic computers, the internal app goes back to desktop-first and the website stays phone-first.
- The architecture consequences are in `SYSTEM_ARCHITECTURE.md` §10.

### D-013: Staff log in with a username and password
- 2026-11-01 · Source: Claude · 🟡 Default
- The admin creates every account and resets passwords. Supabase Auth needs an email address, so each account gets an internal address that never receives mail. The app sends no email, so there are no SMTP or email costs. Self-service password reset is not offered.

### D-014: Where business rules are enforced
- 2026-11-01 · Source: Claude · 🟡 Default
- Rules that protect data, such as no double booking, status changes, locked prescriptions, append-only payments and numbering, live in the database as constraints, triggers and Postgres functions. Status columns change only through those functions. App code validates input and shows clear messages, but the database has the final say.
- Writes from phones carry a client-generated request ID, so a double tap or a retry on a weak network never creates a duplicate.

### D-015: Realtime as a "refetch" signal
- 2026-11-01 · Source: Claude · 🟡 Default
- A realtime event only tells a screen that something changed, and the screen then re-reads the database. Screens also re-read when they reconnect, when they come back into view (phones suspend background tabs) and every 60 seconds as a safety net.

### D-016: URLs, region and offline behaviour
- 2026-11-01 · Source: Claude · 🟡 Default
- The website is at `/`. The internal app is under `/staff/...` on the same domain, never indexed by search engines.
- Server code runs in Vercel's Mumbai region (`bom1`), next to the Supabase Mumbai database.
- Staff can install the app on their home screen (a PWA). Patient data is **never stored offline** on devices in release 1.

### D-017: A second, independent backup
- 2026-11-01 · Source: Claude · 🟡 Default
- On top of Supabase Pro's daily backups, a scheduled job takes a weekly encrypted database dump and stores it on Cloudflare R2 (free up to 10 GB). A restore into staging is tested every quarter.

### D-018: Build the public website first
- 2026-11-01 · Source: user · ✅ Decided
- The website comes before the remaining Phase 0 documents (Roles, Schema, Workflows, Roadmap) and before the internal app. Those documents resume afterwards. Q-02 is still open.
- The website is built **one page at a time**: Home, then Book, then Doctors and each doctor's profile, then Services, About and Contact.
- Until the database exists, pages read content through one function (`getPublicSiteData`) that returns sample content (D-022). Booking-form submissions are connected once the database exists.

### D-019: The clinic is in West Bengal; the audience is local
- 2026-11-01 · Source: user · ✅ Decided
- The design, language and wording are made for local patients and families in West Bengal (see D-020 and `Docs/DESIGN.md`). The exact town or locality is [TBD: clinic locality].
- The West Bengal Clinical Establishments (Registration, Regulation and Transparency) Act, 2017 is added to the legal checklist.

### D-020: The website is in English and Bengali
- 2026-11-01 · Source: Claude, following D-019 · 🟡 Default
- English is at `/` and Bengali (বাংলা) at `/bn`. A toggle in the header switches between them. Each language has its own URL, so both can be found on Google.
- All interface text exists in both languages. Content the admin enters, such as names, specialities and services, has an optional Bengali version that falls back to English.
- On the Bengali site, numbers use Bengali digits and times use local words: "সন্ধ্যা ৬টা", not "6 PM".
- Wording uses the local idiom: "সিরিয়াল" (serial), "ডাক্তারবাবু", "বসেন" (the doctor sits). A native speaker should review all the Bengali copy before launch.
- Open: should Bengali be the default at `/` instead of English?

### D-021: Design direction: minimal, to the point, interactive, with purposeful animation
- 2026-11-01 · Source: user · ✅ Decided
- This **replaces the brief's "avoid unnecessary animations"**. Animation is welcome when it explains something or adds delight, as long as it stays fast on mid-range Android phones and has a reduced-motion version.
- Design guidance comes from the Impeccable skill. The details are in `Docs/DESIGN.md`.

### D-022: Sample content until the database exists
- 2026-11-01 · Source: Claude · 🟡 Default
- Synthetic sample doctors, sessions and services are used for design work only. While sample content is in use, a visible banner says so and the page is set to `noindex`. Sample data never reaches production. It lives in one file, `src/features/website-content/sample.ts`.
