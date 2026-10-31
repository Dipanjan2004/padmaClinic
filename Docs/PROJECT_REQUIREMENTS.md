# Project Requirements: Padma Clinic Management System

| | |
|---|---|
| Version | 0.5 (draft, awaiting review). Since 0.4: real owner, phone, map and doctors (D-023). Since 0.3: West Bengal, English and Bengali, website first (D-018 to D-020). Since 0.2: phone-first for everyone (D-012). Since 0.1: booking model (D-011). |
| Date | 2026-11-01 |
| Sources | `Docs/idea.md` (owner's brief) and `Docs/DECISIONS.md` |

**How to read this document**

- **Confirmed** means it is stated in the brief or decided by the user. IDs: `FR-` is a functional requirement, `NFR-` a non-functional requirement, `BR-` a business rule.
- **Assumption** (`A-`) is Claude's working assumption. It holds until the user corrects it.
- **Open question** (`Q-`) needs an answer from the clinic before the related feature is built.
- `[TBD: …]` marks real business information we don't have yet. Never fill one in with an invented value.

---

## 1. Purpose and scope

The goal is to digitise Padma Clinic's operations, which today run on registers, notebooks, phone calls and WhatsApp.

**Release 1** contains:
- The public website for Padma Clinic.
- The internal clinic app: patients, appointments, doctor schedules, chambers, queues, consultation fees, consultations, digital prescriptions, printing, reports, administration and the audit log.
- For Jatindra Mohan Medico (the pharmacy), **access to finalized prescriptions only**: notification, search, view and print (D-004).

What is not in release 1 is listed in §10.

## 2. Business context (confirmed)

- Padma Clinic has about 2–3 visiting doctors, 2 consultation chambers and 1 reception area.
- Jatindra Mohan Medico is the associated chemist shop. It is a separate business operation.
- Computers: one in each doctor's chamber, one at reception and one at the chemist shop. There is also one at the owner's home, which is for development, testing and backups only. Production must not depend on it.
- Every clinic computer uses the system through a web browser.
- Patients find the clinic through Google Search, Google Maps, the website, WhatsApp and word of mouth.
- Patients book through the website, WhatsApp, a phone call or in person.

## 3. Users

| Role | Where they work | What they do |
|---|---|---|
| Owner / Administrator | Mostly a phone, any computer | Full administration, configuration, reports and the audit log |
| Receptionist | Mostly a phone, plus the reception computer | Patients, appointments, check-in, fees, queues and printing |
| Doctor | Mostly a phone, plus their chamber's computer | Their own queue, consultations and prescriptions |
| Pharmacy staff | Mostly a phone, plus the chemist shop computer | Finalized prescriptions only: view, search and print |
| Public visitor | Any device, usually a phone | Reads the website and sends appointment requests without an account |

The full permission matrix will go in `USER_ROLES_AND_PERMISSIONS.md`.

## 4. Functional requirements (confirmed)

### 4.1 Public website

- **FR-WEB-01** The site has these pages: Home, About, Doctors (a list plus a profile page per doctor), Services, Appointment request and Contact.
- **FR-WEB-02** The home page shows a hero section, a short introduction, a "Book appointment" button, featured doctors, services, clinic highlights, visiting hours, contact information, a Google Map and a WhatsApp contact option.
- **FR-WEB-03** Each doctor's listing and profile shows a photo, name, qualifications, specialities, experience (if provided), visiting days, consultation timings and a "Book appointment" button.
- **FR-WEB-04** The admin can edit all website content from the internal app: clinic information, the about text, services, doctor profiles and timings. None of it is hardcoded.
- **FR-WEB-05** The Contact page shows the phone number, WhatsApp number, address, map and opening hours, and has a contact form.
- **FR-WEB-06** Every page is fully responsive and designed for phones first.
- **FR-WEB-07** Local SEO covers page titles, meta descriptions, clean URLs, Open Graph tags, `sitemap.xml`, `robots.txt`, schema.org structured data (MedicalClinic and Physician) and the Google Maps embed.
- **FR-WEB-08** The site never shows patient data. It never publishes unverified credentials, invented history or medical claims.

### 4.2 Online appointment requests

- **FR-REQ-01** Patients don't need an account to send a request.
- **FR-REQ-02** The form asks for the patient's name, phone number, age or date of birth, the doctor, the preferred date and the doctor's session on that date. The reason for the visit is optional.
- **FR-REQ-03** For the chosen doctor and date, the form shows the sessions that still have room, each with an approximate time. It says clearly that the time is an estimate (D-011).
- **FR-REQ-04** After submitting, the patient sees that the request is **pending confirmation**. The page states clearly that submitting does not guarantee an appointment.
- **FR-REQ-05** Reception enters requests that arrive by WhatsApp, phone or in person into the same system. There is a single appointment database, and it is the only authoritative one.

### 4.3 Appointment management (reception)

- **FR-APT-01** Reception has an inbox of pending requests.
- **FR-APT-02** While reviewing a request, reception can see the doctor's availability, the chamber allocation and the existing appointments.
- **FR-APT-03** Reception can confirm a request, reject it or propose another time.
- **FR-APT-04** Reception can create, reschedule and cancel appointments and mark no-shows.
- **FR-APT-05** Reception tells patients about decisions and changes (see A-02 for how).
- **FR-APT-06** There is a calendar view of appointments.
- **FR-APT-07** The system prevents double booking: two appointments never share a serial number in the same session, and a session never goes over its maximum number of patients. Chamber allocations never overlap (D-011).

### 4.4 Doctors, schedules and chambers (admin)

- **FR-SCH-01** The admin can add, edit and deactivate doctor profiles. A doctor with history is never hard-deleted.
- **FR-SCH-02** Each doctor has a weekly schedule of visiting days, session start and end times, and breaks.
- **FR-SCH-03** Schedule exceptions cover leave, unavailable periods and one-off timing changes.
- **FR-SCH-04** Chambers are records the admin manages. A doctor is assigned to a chamber through the schedule, never hardcoded.
- **FR-SCH-05** Each doctor has an average consultation time, which the admin can change. It is used to estimate appointment times (D-011).
- **FR-SCH-06** When a schedule change affects booked appointments, reception sees the list of affected patients so they can be told.
- **FR-SCH-07** Fees are set per doctor, with separate first-visit and follow-up fees. Only authorized admins can change them.
- **FR-SCH-08** Each session has a maximum number of patients, which the admin sets.
- **FR-SCH-09** When a doctor is running late or early, reception enters the delay for that session once. All later estimated times move by that amount. Reception can also change a single appointment's time. The app lists the patients affected, each with a ready-made WhatsApp message (D-011).

### 4.5 Patient registry

- **FR-PAT-01** Every patient gets a unique patient ID that the system generates and that is easy to read and print.
- **FR-PAT-02** The profile holds full name, phone number, date of birth or age, gender (optional), address (optional), registration date and relevant medical history.
- **FR-PAT-03** Reception can search by name, phone number or patient ID.
- **FR-PAT-04** The profile shows the patient's visits, appointments, consultations, prescriptions and follow-ups.
- **FR-PAT-05** At registration, the system warns about likely duplicates, for example the same phone number with a similar name.
- **FR-PAT-06** Duplicate records can be merged safely, with an audit trail of what was merged and by whom.
- **FR-PAT-07** Phone numbers are not unique. One number can belong to several family members.
- **FR-PAT-08** The system collects only the personal and medical information it genuinely needs.

### 4.6 Arrival, visits and queue

- **FR-VIS-01** When a patient arrives, reception finds or registers them, links the appointment and marks them as arrived.
- **FR-VIS-02** For a walk-in, reception registers the patient, chooses the doctor, records the visit as a walk-in, collects the fee and adds the patient to the queue.
- **FR-VIS-03** A patient becomes `READY_FOR_CONSULTATION` only after they have arrived and their payment has been recorded.
- **FR-VIS-04** Each doctor has a queue that updates live, at reception and on the doctor's screen.
- **FR-VIS-05** The queue follows appointment order. Walk-ins are fitted in without jumping ahead of confirmed appointments.
- **FR-VIS-06** Reception can change the order, for example for an urgent case, but must enter a reason, which is audited.

### 4.7 Consultation payments

- **FR-PAY-01** The fee comes from the doctor's configuration, as a first-visit fee or a follow-up fee.
- **FR-PAY-02** The fee can be overridden at collection, with a recorded reason (who may do this is Q-03).
- **FR-PAY-03** Payment methods are Cash, UPI and other methods the admin configures.
- **FR-PAY-04** Each payment records the amount, method, transaction reference (such as the UPI reference), who collected it and when.
- **FR-PAY-05** Reception can generate and print a receipt.
- **FR-PAY-06** Refunds and corrections are new linked records. Nothing is deleted or overwritten.
- **FR-PAY-07** There are reports of daily collections and collections per doctor.
- **FR-PAY-08** Consultation payments are kept completely separate from pharmacy purchases.

### 4.8 Doctor workspace and consultation

- **FR-DOC-01** Every doctor has their own login.
- **FR-DOC-02** The doctor's dashboard shows their name and profile, today's schedule and appointments, the live queue, the next eligible patient and the consultations completed today.
- **FR-DOC-03** The doctor can open a patient's profile and their relevant history.
- **FR-DOC-04** The doctor starts the consultation and records symptoms, examination findings, clinical notes, the diagnosis and any investigations advised.
- **FR-DOC-05** The doctor completes the consultation and can recommend a follow-up.
- **FR-DOC-06** The doctor can view their own past consultations.
- **FR-DOC-07** Doctors cannot see the admin's financial reports unless they are explicitly authorized.
- **FR-DOC-08** A doctor only sees the records needed for their clinical work (how far this goes is Q-02).

### 4.9 Digital prescriptions

- **FR-RX-01** A prescription contains:
  - the clinic's name and details;
  - the doctor's name, credentials and registration number (when supplied);
  - the patient's name, ID, age and sex;
  - the date, diagnosis and clinical notes (where appropriate);
  - for each medicine: name, strength, dosage, frequency, duration, quantity, route and instructions;
  - investigations advised and the follow-up date;
  - a signature area.
- **FR-RX-02** Medicines are picked from a searchable catalogue. A doctor can also enter a medicine that isn't in the catalogue, subject to controls (A-10).
- **FR-RX-03** Entry is fast and works from the keyboard wherever practical.
- **FR-RX-04** The doctor previews the prescription before finalizing it.
- **FR-RX-05** Only the authorized prescribing doctor can finalize a prescription.
- **FR-RX-06** A unique prescription number is assigned when the prescription is finalized.
- **FR-RX-07** A finalized prescription is locked. To correct it, the doctor creates an amendment that references the original. Both are kept, each with its timestamps and the doctor's identity.
- **FR-RX-08** Prescriptions print on A4. Smaller formats can come later.

### 4.10 Prescription distribution

- **FR-DST-01** When a prescription is finalized, it is saved centrally and immediately visible at reception and the pharmacy. Both get a live notification.
- **FR-DST-02** Either location can print it. Auto-print is off by default and can be turned on in settings.
- **FR-DST-03** Print actions (who, where, when) are recorded where practical.
- **FR-DST-04** The prescription stays available if a printer is down and can be reprinted at any time.
- **FR-DST-05** Pharmacy staff can search by prescription number or patient ID, view and print. They can't edit anything.
- **FR-DST-06** A prescription never creates a pharmacy sale. The patient is free to buy their medicines elsewhere.

### 4.11 Printing

- **FR-PRT-01** There are print layouts for the appointment slip or receipt, the consultation payment receipt and the prescription.
- **FR-PRT-02** Printing goes through the browser to the local USB or network printers at reception and the pharmacy (D-006).

### 4.12 In-app notifications

- **FR-NOT-01** The app sends live notifications when a new appointment request arrives (to reception), a patient is ready (to the doctor) and a prescription is finalized (to reception and the pharmacy).
- **FR-NOT-02** Notifications are saved to a list, so a missed pop-up is never lost.

### 4.13 Administration, reports and audit

- **FR-ADM-01** The owner has a dashboard with an overview of the clinic.
- **FR-ADM-02** The admin manages staff accounts (doctors, receptionists and pharmacy staff): creating them, activating and deactivating them, and setting roles and permissions.
- **FR-ADM-03** The admin configures clinic information, fees, schedules, chambers, payment methods, services and print settings.
- **FR-ADM-04** There are daily, weekly and monthly reports on appointments, visits and collections, including collections per doctor.
- **FR-ADM-05** The admin can view the audit log: who did what, when, and to which record.

## 5. Business rules (confirmed)

- **BR-01** A receptionist confirms every appointment. An online submission is only a request.
- **BR-02** The consultation fee is collected at reception before the consultation.
- **BR-03** Walk-ins don't jump ahead of confirmed appointments. Any override needs a recorded reason.
- **BR-04** A patient is eligible for consultation only once they have arrived and paid (waived or free visits are Q-12).
- **BR-05** A doctor is never double-booked, and chamber allocations never overlap.
- **BR-06** Doctors are not tied to fixed chambers.
- **BR-07** A finalized prescription is never edited silently. It changes only through an amendment, and the original is kept.
- **BR-08** Every prescription has a unique number, the prescribing doctor's identity and timestamps.
- **BR-09** Payment records are never deleted or overwritten. Refunds and corrections are audited.
- **BR-10** Receptionists can't modify finalized prescriptions.
- **BR-11** Only authorized admins configure fees.
- **BR-12** A patient's identity is their patient ID, not their phone number.
- **BR-13** No AI-generated diagnoses, medicine recommendations or autonomous prescribing.
- **BR-14** Appointment, visit, payment and prescription statuses are tracked separately.
- **BR-15** Development and testing never use real patient data.
- **BR-16** The system never invents business or medical information.
- **BR-17** An appointment time is an estimate. The patient's serial order within the session is fixed, and reception moves times when the doctor is late (D-011).

## 6. Status models

The brief suggests these statuses:

- **Appointment:** `REQUESTED`, `CONFIRMED`, `RESCHEDULED`, `CANCELLED`, `NO_SHOW`
- **Visit:** `NOT_ARRIVED`, `ARRIVED`, `PAYMENT_PENDING`, `READY_FOR_CONSULTATION`, `CONSULTING`, `COMPLETED`
- **Payment:** not specified
- **Prescription:** not specified

**Gaps in the brief.** Claude will propose fixes for each of these in `WORKFLOW_SPECIFICATION.md`:

1. There is no status for a declined request. `REJECTED` is not the same as `CANCELLED`.
2. `RESCHEDULED` as a status loses track of where the appointment ended up. The proposal is to keep the appointment and record each reschedule in its history, or to link the old appointment to the new one.
3. The appointment has no end state such as `COMPLETED`, so there is no way to tell that it turned into a visit.
4. `PAYMENT_PENDING` puts payment inside the visit status, which conflicts with BR-14. The proposal is that the visit status tracks presence and progress, the payment has its own status, and "ready for consultation" is worked out from both.
5. `NOT_ARRIVED` implies that a visit exists before the patient arrives. The proposal is to create the visit at check-in.
6. There is no status for a patient who leaves before being seen, possibly after paying.
7. Payments need statuses, for example `PAID`, `WAIVED`, `REFUNDED` and `PARTIALLY_REFUNDED`.
8. Prescriptions need statuses, for example `DRAFT`, `FINALIZED` and `SUPERSEDED` (replaced by an amendment).

## 7. Non-functional requirements (confirmed)

### Security and privacy
- **NFR-SEC-01** Login is secure. Only the admin creates staff accounts, and there is no public sign-up.
- **NFR-SEC-02** Role-based access is enforced on the server and in the database (Row Level Security). Checks in the UI are not relied on.
- **NFR-SEC-03** The system uses HTTPS only, protects its API routes and validates input at every server entry point.
- **NFR-SEC-04** It protects against common web vulnerabilities, including broken access control, injection, XSS and CSRF.
- **NFR-SEC-05** Secret keys, including the Supabase service-role key, never reach the browser.
- **NFR-SEC-06** No public API exposes patient data.
- **NFR-SEC-07** Sensitive actions are written to an audit log.
- **NFR-SEC-08** Sessions are managed so that shared computers are safe (A-07).
- **NFR-SEC-09** There is a policy for how long data is kept and how it is deleted (needs legal input, §8).
- **NFR-SEC-10** Public forms are protected against spam and abuse.

### Reliability
- **NFR-REL-01** The database is the source of truth. Realtime updates are a convenience, and every screen recovers the correct state after reconnecting.
- **NFR-REL-02** The system copes with dropped connections, reconnection, duplicate events, concurrent edits, stale data and race conditions.
- **NFR-REL-03** Operations with several steps run as single database transactions. Either every step succeeds or none does.
- **NFR-REL-04** Backups are automatic, and the restore procedure has been tested.
- **NFR-REL-05** There is monitoring, error logging and an alert when the site goes down.
- **NFR-REL-06** Development and production run in separate environments, and secrets live in environment variables.
- **NFR-REL-07** A manual fallback is documented for internet and power outages, covering paper queues, paper prescriptions and how to enter them afterwards.
- **NFR-REL-08** Production does not depend on the home computer (D-007).

### Usability and accessibility
- **NFR-UX-01** Non-technical staff can use the app with minimal training.
- **NFR-UX-02** Every screen, public and internal, is designed for phones first and expands for computers (D-012). This replaces the brief's desktop-first internal app.
- **NFR-UX-03** The app works well from the keyboard, especially prescription entry.
- **NFR-UX-04** Every screen has clear status indicators, useful empty states, loading and error states, success messages, and a confirmation before any destructive action.
- **NFR-UX-05** Colour contrast meets WCAG 2.2 AA.
- **NFR-UX-06** The design is clean, professional and uncluttered, without excessive gradients, animation or decoration. It uses shadcn/ui, Tailwind and Lucide icons.

### Cost and infrastructure
- **NFR-INF-01** The setup is economical. There is no dedicated server, and no VPS without a justification.
- **NFR-INF-02** Free tiers are fine for development. Their limits are explained before production (D-010).

### Maintainability
- **NFR-MNT-01** The code is a modular monolith in strict TypeScript, with minimal dependencies, SQL migrations, documented decisions and tests of real workflows.
- **NFR-MNT-02** The architecture leaves room for the pharmacy module and the future features in §10 without a rewrite.

## 8. Legal and regulatory items to be verified by a qualified person

Claude is flagging these, not answering them. None of them should be treated as compliant until someone qualified has checked.

- **Digital Personal Data Protection Act 2023 and DPDP Rules 2025** (being brought into force in phases):
  - the notice and consent for collecting patient data, including through the website form;
  - limiting data use to its stated purpose, and the security safeguards;
  - breach notification;
  - patients' rights to access, correct and erase their data, and how erasure fits with keeping medical records;
  - data of patients under 18, and whether the exemptions for healthcare providers apply;
  - agreements with data processors such as Supabase and Vercel;
  - where the data is stored (D-009 proposes an India region).
- **Prescription content rules** under the Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations 2002 and current NMC rules, for example the doctor's registration number and guidance on prescribing by generic name.
- **How long outpatient records must be kept**, including West Bengal rules (D-019).
- **The West Bengal Clinical Establishments (Registration, Regulation and Transparency) Act, 2017**: registration details that must be displayed, and any rules on showing fees and prices.
- **Tax details on consultation receipts**, such as GST. Healthcare services are generally exempt, but this needs checking.
- **Drugs and Cosmetics Rules** on dispensing and record-keeping (for example Schedule H, H1 and X). These apply when the pharmacy module is built.
- **ABDM / ABHA** (India's national digital health ID) integration is optional and not required for release 1. It is a possible future feature.

## 9. Risks noticed so far

Each risk will be addressed in the document named.

| Risk | Mitigation | Where |
|---|---|---|
| An internet outage stops the clinic's system | Manual paper fallback; a backup mobile hotspot | Architecture, Workflows |
| A power cut | A UPS for the router and the reception computer | Architecture |
| The doctor arrives late and waiting patients get frustrated | Enter the delay once to move every estimated time; the app lists the patients to message | Workflows |
| A computer is left logged in, exposing patient data | Auto-lock after inactivity; quick re-login | Roles |
| Duplicate patients (shared phones, spelling variants) | Match warnings at registration; audited merge | Workflows, Schema |
| Fake or spam online requests | Turnstile, rate limits; every request needs confirmation anyway | Architecture |
| Free tiers have no backups or forbid commercial use | Paid plans in production (D-010) | Architecture |
| A realtime update is missed and a screen shows stale data | Refetch from the database on reconnect and on every event | Architecture |
| Typing a prescription is slower than writing it | Keyboard-first entry, a doctor's favourite medicines, repeating the last prescription | Workflows |
| The browser's print dialog slows reception down | Print layouts tuned for one-click printing; silent printing as a later option | Architecture |
| Shared logins or staff turnover | Individual accounts that can be deactivated; audit log | Roles |
| Two receptionists act on the same appointment at once | Database constraints and transactions; clear conflict messages | Schema, Workflows |
| A phone can't print to a USB printer attached to a PC | Print from that computer, or use a Wi-Fi printer (Q-17) | Architecture §10 |
| Patient data on staff's personal phones, or a lost phone | Inactivity lock, remote sign-out, no offline storage, audit of record views | Architecture §10, Roles |
| A weak mobile network causes double taps or retries | A request ID on every write prevents duplicates; an offline banner | Architecture §6, §9 |

## 10. Out of scope for release 1

The architecture must stay ready for all of these.

- **Pharmacy:** inventory, batches, expiry tracking, suppliers, purchases, sales billing, dispensing, the customer credit (udhar) ledger and pharmacy revenue reports.
- **Other features:** WhatsApp Business API, automated appointment and follow-up reminders, online payments, a patient portal or patient login, multiple branches, advanced reports, bulk data export, offline mode and a silent auto-print agent.
- **Never:** AI features of any clinical kind (BR-13).

## 11. Assumptions

These are Claude's assumptions. Please correct any that are wrong.

- **A-01** The interface is in English for release 1 (the language question is Q-04).
- **A-02** In release 1, reception tells patients about decisions by phone or WhatsApp by hand. The app helps by building a WhatsApp click-to-chat link with the message already filled in. There is no paid SMS or WhatsApp API, because SMS in India also needs DLT registration.
- **A-03** Staff log in with an email address or username and a password. The admin creates every account. There is no SMS OTP.
- **A-04** The owner is the first and only admin. More admins can be added later.
- **A-05** There is a single clinic location. Multiple branches are not modelled in release 1.
- **A-06** Money is in INR and times are in `Asia/Kolkata`. Dates are shown as DD-MM-YYYY.
- **A-07** Most staff use their own phones (Q-18). The clinic computers may be shared by different people, for example a chamber computer used by different doctors on different days. So the app auto-locks after inactivity, makes switching users quick, and lets the admin sign a lost phone out remotely.
- **A-08** The consultation fee is collected in full in one payment, with no partial payments (see Q-12).
- **A-09** When the date of birth is unknown, the age is recorded together with the date it was recorded, so the current age can be estimated later.
- **A-10** The medicine catalogue starts with a list the clinic provides, or empty, and grows as doctors use it. When a doctor adds a medicine that isn't listed, it is marked as unverified until the admin reviews it. No licensed external drug database is used.
- **A-11** Pharmacy staff see what is on the printed prescription and nothing else from the patient's record (see Q-06).
- **A-12** Messages from the website's contact form go to an inbox in the internal app. No email sending is needed in release 1.
- **A-13** Supported browsers are Chrome on Android and Safari on iPhone, both recent versions from the last 2 years, and recent Chrome or Edge on the clinic computers. Mid-range Android phones on 4G are the main target.
- **A-14** The clinic provides doctor photos and clinic images, with the doctors' consent.
- **A-15** The website's appointment form shows a short privacy notice. The final wording needs legal review (§8).

## 12. Open questions

These are in priority order. Claude asks them one at a time.

| ID | Question | Why it matters | Needed by |
|---|---|---|---|
| Q-01 | ✅ **Answered (D-011).** Times vary, for example when the doctor comes late, and reception updates them. Bookings are a serial order within a session, with an estimated time. | It shapes the scheduling engine, the booking form, the queue and the database | Done |
| Q-02 | Can a doctor see the consultations and prescriptions that **other** Padma Clinic doctors wrote for the same patient? | It is central to the access rules for records | Roles |
| Q-03 | What makes a visit a "follow-up" (for example, within N days of the last visit to the same doctor)? Who may change or waive a fee? | Fee calculation and permissions | Roles, Schema |
| Q-04 | **Partly answered (D-020):** the website is in English and Bengali. Still open: should Bengali be the default at `/`? Which language should the printed prescription use? | Default language; the prescription layout | Phase 6 |
| Q-05 | What is the monthly budget for production hosting (D-010)? | The hosting choice | Before Phase 8 |
| Q-06 | Should pharmacy staff see the diagnosis, or only the medicines? Does reception need to see clinical notes? | Access to records | Roles |
| Q-07 | Is a doctor's chamber fixed per weekly session, or does reception decide it each day? | The chamber allocation design | Workflows |
| Q-08 | Are there preferred formats for the patient ID and the prescription number? | Numbering | Schema |
| Q-09 | Is there an existing list of medicines to import, for example an export from the chemist shop's software? | The medicine catalogue | Phase 6 |
| Q-10 | Do prescriptions print on plain A4 with a printed header, or on pre-printed letterhead paper? | The print layout | Phase 6 |
| Q-11 | Would doctors like saved templates or favourites for common prescriptions? | Speed of prescription entry | Phase 6 |
| Q-12 | Does the clinic ever give partial payments, discounts or free consultations (camps, staff, hardship)? | Payment rules | Schema |
| Q-13 | Who records medical history such as allergies and chronic conditions: reception, doctors or both? | Permissions | Roles |
| Q-14 | Does the chemist shop already use billing software? If so, which? | Future pharmacy integration | Later |
| Q-15 | Does the clinic already own a domain name? | Deployment, SEO | Phase 7 |
| Q-16 | How long must records be kept? This needs input from the legal check in §8. | The retention policy | Before go-live |
| Q-17 | Are the reception and pharmacy printers USB (printing only from that computer) or Wi-Fi (phones can print too)? | Phone printing | Phase 4 |
| Q-18 | Do staff use their own phones or clinic-owned phones? | Device and privacy policy | Roles |

## 13. Business information the clinic must supply

All of this is stored in the database and edited from the admin screens. Nothing is hardcoded.

| Item | Value |
|---|---|
| Clinic display name | Padma Clinic (confirmed) |
| Owner | Nabadwip Kumar Chowdhury (D-023) |
| Email | naba.medi@gmail.com (D-031) |
| Lab tests | The clinic offers all kinds of lab tests with Thyrocare as its partner lab (D-032). [TBD: prices, report times, whether samples are collected at the clinic or at home, and whether the clinic may show the Thyrocare name] |
| Doctors (current) | Dr. Amit Sengupta, MBBS. Dr. Dipanwita Chowdhury, MBBS, has worked at Lady Dufferin Hospital (D-023, D-030). [TBD: confirm the hospital's full name; speciality, registration number, photo, timings and fees for each] |
| Clinic name in Bengali script | [TBD: exact Bengali spelling, for example পদ্ম or পদ্মা] |
| Town or locality (West Bengal) | [TBD: clinic locality] |
| Legal or registered name | [TBD: legal name] |
| Clinic registration number (if required) | [TBD: registration number] |
| Address | [TBD: full address]. The map location is known (D-023). |
| Phone | +91 98303 37825 (D-023) |
| WhatsApp | Assumed +91 98303 37825. [TBD: confirm] |
| Email | [TBD: email address, optional] |
| Google Maps location | https://maps.app.goo.gl/5wByP6h2ZpFjhJpN6 (pin labelled "Jatindra Mohan Medico") |
| Opening hours | [TBD: opening hours] |
| Logo and brand colours | [TBD: logo file]. Interim: blue `#2463A6` and lime, see DESIGN.md v0.2 |
| About, history, mission and values | [TBD: written by the clinic] |
| Services and facilities | [TBD: list of services the clinic actually provides] |
| Chamber names | [TBD: how the chambers are referred to] |
| For each doctor: name, qualifications, specialities, registration number and council, experience, photo, weekly sessions, maximum patients per session, average consultation time, first-visit fee and follow-up fee | [TBD: for each doctor] |
| Payment methods besides Cash and UPI | [TBD: e.g. card] |
| UPI ID or QR code shown at reception or on receipts | [TBD: optional] |
| Jatindra Mohan Medico details to show on prescriptions, if any | [TBD: optional] |
| Domain name | [TBD: domain] |
