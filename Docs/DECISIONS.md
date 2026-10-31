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
- 2026-11-01 · Source: Claude · 🔁 Superseded by D-023
- Synthetic sample doctors, sessions and services are used for design work only. While sample content is in use, a visible banner says so and the page is set to `noindex`. Sample data never reaches production. It lives in one file, `src/features/website-content/sample.ts`.

### D-023: Real clinic content replaces the sample content
- 2026-11-01 · Source: user · ✅ Decided. Supersedes D-022.
- Doctors for now: **Dr. Amit Sengupta** and **Dr. Dipanwita Chowdhury**. Owner: **Nabadwip Kumar Chowdhury**. Phone: **+91 98303 37825**. Location: the Google Maps pin the user shared (https://maps.app.goo.gl/5wByP6h2ZpFjhJpN6). Google labels that pin "Jatindra Mohan Medico".
- The sample banner is gone. Details not yet supplied stay hidden instead of being faked. That covers qualifications, specialities, timings, services, address and hours.
- 🟡 The WhatsApp number is assumed to be the same as the phone number. Confirm.
- The Bengali spellings of the names were written by Claude. Verify them.

### D-024: White theme, floating navbar, professional footer
- 2026-11-01 · Source: user · ✅ Decided
- The page background is white.
- The navbar floats, after the bondapp.io reference the user gave. Over the hero it is transparent with white text. Once the page scrolls it becomes a white rounded bar with a shadow, and the current section is underlined. Phones get a slide-in menu with Book, Call, WhatsApp and Directions.
- The footer is dark navy (🔁 colour superseded by D-027) with four columns (brand, clinic links, doctors, contact) and a bottom bar with copyright and the associated pharmacy.
- **Directions** buttons (hero, contact, menu, footer, phone bar) open Google Maps straight into directions to the pin. The Contact section embeds the map.

### D-025: Visual direction v2: a doctor-booking page, not a flower page
- 2026-11-01 · Source: user · ✅ Decided. Supersedes the lotus motif and colours in D-021 and `DESIGN.md` v0.1.
- The user's feedback: "this is a doctor's appointment booking page… using a flower doesn't make sense". The user's references were bondapp.io and a "SmileLab" dental hero.
- **The page says what it is for:** the headline is "Book your doctor's appointment" ("ডাক্তারবাবুর সিরিয়াল বুক করুন"), and the booking card is the hero.
- **Look:** an inset rounded blue hero panel, oversized light-weight type (Geist, with Bengali through Anek Bangla and Hind Siliguri), clinic blue `#2463A6` with a lime `#D4F26A` accent, and a slowly rotating round "Book your serial" badge.
- **Photos:** free Unsplash medical photos. A stethoscope and BP gauge sits behind the hero, toned blue. A BP check is behind the "How booking works" band. Photos where a doctor's face is the subject were avoided, so patients don't mistake a stock doctor for one of the clinic's. Replace them with real clinic photos when available.
- **Logo:** a white medical plus on blue stands in until the clinic has a logo.
- **No invented social proof:** no fake patient counts or ratings. Add real numbers or reviews only when the clinic supplies them.

### D-026: Booking requests go through WhatsApp until there is a database
- 2026-11-01 · Source: Claude · 🟡 Default
- The hero booking card asks for the doctor, preferred day, patient name and mobile number, all validated in the browser. It then opens WhatsApp to the clinic's number with the request written out. Reception confirms the serial, as BR-01 requires.
- Every "Book" button on the page scrolls to this card. `#book:<doctor>` links preselect that doctor. A separate `/book` page is no longer needed for now.
- Once the database exists, the same card will save the request to it (FR-REQ-05), and WhatsApp becomes an optional notification.

### D-027: The footer matches the hero's clinic blue
- 2026-11-01 · Source: user · ✅ Decided. Supersedes the navy footer colour in D-024.
- **What the user said:** the footer colour is suddenly different; make it uniform.
- The footer is now the same inset rounded clinic-blue panel (`#2463A6`) as the hero, with the same corner radius and side gutter, so the page opens and closes in one colour. Its four columns and bottom bar are unchanged.
- On phones the panel stops above the fixed action bar instead of running behind it.
- 🟡 The "How booking works" photo band keeps its navy overlay. Change it too if it also reads as out of place.

### D-028: Phone menu drops down from the top; the navbar stays put
- 2026-11-01 · Source: user · ✅ Decided. 🟡 The doctor rows are Claude's default.
- **What the user said:** the menu should take the whole screen instead of coming from the side, with less blank space. Then: it should open from the top with an animation, and the navbar's position should stay constant.
- The navbar never moves. Its menu button turns into a close button in the same spot, and a full-screen menu drops down from the top behind the bar. The page behind is locked and cannot be tabbed into. Escape closes the menu.
- 🟡 To use the space well, the lower half is an inset clinic-blue panel ("Book your serial") with a one-tap Book row for each doctor that preselects them in the booking card, then Call, WhatsApp and Directions, and the owner.

### D-029: Contact as one card, a full-width phone footer, and a clinic-blue favicon
- 2026-11-01 · Source: user · ✅ Decided
- **What the user said:** make the Contact section look better and uniform; the phone footer has too much empty space on the right; update the favicon.
- Contact is one bordered card with the details and the map at the same height. The separate "Open in Google Maps" link was removed, because Directions already opens Google Maps.
- On phones the footer puts Clinic beside Contact, with Doctors below. The owner's name moved under the tagline.
- The favicon still had the old green from the lotus design. It is now clinic blue, with an iPhone home-screen icon added.

### D-030: Doctor qualifications and experience; livelier doctor cards
- 2026-11-01 · Source: user · ✅ Decided
- **What the user said:** both doctors have done MBBS. Dr. Dipanwita Chowdhury has worked at "Lady dafrine hospital". The doctors section felt too boring.
- Both doctors show **MBBS**. Dr. Dipanwita Chowdhury shows "Worked at Lady Dufferin Hospital" (Bengali: "অভিজ্ঞতা: লেডি ডাফরিন হাসপাতাল").
- 🟡 Claude corrected the spelling to Lady Dufferin. The full name is probably Lady Dufferin Victoria Hospital, Kolkata. Confirm before launch.
- Each doctor card now has a clinic-blue portrait panel with the doctor's initials in large lime type, which becomes their photo once one is supplied, plus a qualification chip, past hospitals and a Book pill. Real photos of the doctors would improve this section the most.

### D-031: The clinic's email address
- 2026-11-01 · Source: user · ✅ Decided
- The email is **naba.medi@gmail.com**. It appears in the Contact card and in the footer's Contact column as a mailto link.

### D-032: A Lab tests section, with Thyrocare as the partner lab
- 2026-11-01 · Source: user · ✅ Decided. 🟡 The test list is Claude's, from research.
- **What the user said:** the clinic offers all kinds of lab tests and its associated lab is Thyrocare. Research Thyrocare's tests and list them so visitors can see them at a glance.
- The new section follows "How booking works" and gets a "Lab tests" link in the navbar and footer.
- 🟡 Claude grouped the tests by Thyrocare's own profiles and fever panels:
  - Fever: dengue NS1 and IgG/IgM, malaria, typhoid (Widal), chikungunya.
  - Diabetes: fasting and post-meal sugar, HbA1c.
  - Thyroid: thyroid profile, TSH.
  - Heart: lipid profile, cardiac risk markers.
  - Liver and kidney: LFT, KFT, uric acid, urine routine.
  - Blood and vitamins: CBC, iron studies, vitamins D and B12.
  - Full body checkup: Aarogyam packages.
- Each test has one plain line on what it checks. These describe the test, never a diagnosis.
- No prices, report times or home collection are shown until the owner supplies them. The section says other tests are available and that some need fasting.
- Confirm with the owner that every listed test can be done through the clinic, and that the clinic may show the Thyrocare name.

### D-033: Photos show Indian people
- 2026-11-01 · Source: user · ✅ Decided
- **What the user said:** use Indian images, so people can relate.
- "How booking works" now shows an Indian doctor examining an elderly Sikh patient (Pexels 18870282, free under the Pexels licence). It was cropped to remove a poster carrying another clinic's name.
- The hero photo (a stethoscope and BP gauge, with no people) stays.
- Real photos of Padma Clinic, its doctors and its patients (with consent) would serve this best.

### D-034: Lab tests redesigned: search, concern filters and a bento of every test
- 2026-11-01 · Source: user · ✅ Decided. 🟡 The design is Claude's.
- **What the user said:** the section looked too boring; research and use the design skills to make it look proper.
- **What the research showed:** visitors to lab sites usually arrive knowing the exact test their doctor named, such as CBC or lipid profile. Good lab sites also let people browse by health concern and give full-body packages their own prominent spot.
- 🟡 **The new design:**
  - A search box, plus filter chips for each health concern.
  - Every test is visible at once as a pill on its concern's tile. Each tile has its own tint from the palette.
  - A large clinic-blue full body checkup tile shows a lab photo (Pexels 6622519).
  - A lime "Don't see your test?" tile.
  - Tapping a pill explains what that test checks. A search with no match becomes a WhatsApp question carrying the typed test name.
- The full body checkup is now its own item in the content (`labTests.checkup`), not a category with one test.

### D-035: Lab tests: nothing moves when a test is tapped; every filter is visible
- 2026-11-01 · Source: user · ✅ Decided
- **What the user said:** the tiles changed size when a test was tapped, which is bad UX. On phones, not all the filter options were visible.
- Every concern tile now always shows an explanation: the first test is picked by default and tapping another swaps the text. Each tile reserves the height of its longest explanation, so tapping never resizes a tile or the full body checkup tile beside it. This was verified in a browser by tapping all 20 tests at four widths in both languages, with zero layout shift.
- The filter chips wrap onto extra lines instead of scrolling sideways, so all seven are always on screen.
- **Rule for future screens:** an interaction must never change the size of surrounding content. Reserve the space up front.

### D-036: Mobile quality pass
- 2026-11-01 · Source: user ("check the mobile version thoroughly… there should not be any bugs") · ✅ Decided
- **How it was checked:** an automated browser audit across seven phone profiles in both languages:
  - Android profiles in Chromium: Galaxy S9+ (320px), Moto G4 (360px), Pixel 5 and Pixel 7.
  - iPhone profiles in WebKit: iPhone SE, iPhone 13 and iPhone 14 Pro Max.
  - Extra runs in landscape and at 130% text size.
  - What it checked: overflow, cut-off text, tap-target size, overlapping elements, every menu link, the Back button, the booking flow end to end, the bottom bar, and the lab tests.
- **Bugs found and fixed:**
  - The phone's Back button with the menu open went back a page instead of closing the menu. The open menu is now one history entry, so Back, ✕ and Escape close it. The page doesn't reload, the scroll position is kept, and a later Back doesn't reopen the menu.
  - On short screens (landscape, or large text) the menu's blue panel collapsed and cut off the doctors and the Call, WhatsApp and Directions buttons. It now never shrinks below its content, and the menu scrolls.
  - At 320–360px the clinic name in the navbar wrapped onto two lines. The logo is now smaller under 400px and never wraps, and the language switch drops its icon there.
  - The rotating badge covered the headline on narrow phones. It now floats beside the headline so the words wrap around it. Bengali uses a slightly smaller headline on the narrowest phones so its first word fits beside the badge.
  - In the booking card at 320px the date picker was squeezed to a few pixels. Today and Tomorrow now share a row and the date picker gets its own full-width row below 1280px. "Dr." no longer sits alone on a line, and the decorative initials hide under 360px.
  - The bottom bar could cover the booking card's Send button. It now steps aside while the card is in the bottom quarter of the screen.
  - In the Contact card the email broke onto two lines at 320px. The rows are tighter under 400px.
  - Tap targets were too small:
    - lab pills and chips are now 44px;
    - footer links are 40px, stacked with no gaps;
    - the whole Contact row is tappable for phone, WhatsApp and email;
    - the logo link is 44px.
- The mobile checklist in `DESIGN.md` §11 is now the standard for every screen.
