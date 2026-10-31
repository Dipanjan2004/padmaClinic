# MASTER PROJECT PROMPT — PADMA CLINIC MANAGEMENT SYSTEM

You are acting as a Senior Software Architect, Product Designer, UI/UX Engineer and Full-Stack Developer.

I want you to help me design and build a production-ready Clinic Management System for a real-world medical clinic in India called **Padma Clinic**.

This is not a demo project, tutorial project or portfolio-only application. It is intended to be used in an actual clinic by doctors, receptionists, patients and the clinic owner.

Think carefully about real-world workflows, reliability, usability, data security, scalability and maintainability.

Do not rush into writing code. First understand the requirements, propose the architecture, identify potential problems and create a structured implementation plan.

---

# 1. BUSINESS BACKGROUND

The business has two connected operations:

1. Padma Clinic — A medical clinic where multiple doctors visit and consult patients.
2. Jatindra Mohan Medico — An associated chemist shop where patients may purchase prescribed medicines.

**Current development priority: Padma Clinic.**

The pharmacy will eventually be integrated into the system, but the first version should focus on clinic operations.

Current business situation:

- The clinic currently has approximately 2–3 doctors.
- There are two physical consultation chambers.
- A separate reception area is available.
- Doctors will have individual computers with monitors and keyboards.
- The reception will have a computer.
- The chemist shop has a computer.
- There is also a computer available at the owner's home, which can be used for development, testing or backup-related purposes.
- Most operations are currently managed manually using registers, notebooks, phone calls and WhatsApp.

The objective is to digitise the entire clinic workflow.

# 2. MAIN PROJECT OBJECTIVES

Build two interconnected applications:

## A. Public-facing website

A professional website for Padma Clinic where patients can:

- Learn about the clinic.
- View available doctors.
- View doctor qualifications and specialities.
- Check doctor visiting days and timings.
- Explore available services.
- Request appointments online.
- Contact the clinic through phone or WhatsApp.
- Find the clinic's location through Google Maps.

## B. Internal Clinic Management System

A secure management application used by:

- Clinic owner / administrator.
- Receptionists.
- Doctors.
- Pharmacy staff (limited prescription access in the initial integration).

The internal system should manage:

- Patient registration.
- Patient records.
- Appointment requests.
- Appointment confirmation.
- Doctor schedules.
- Chamber allocation.
- Patient queues.
- Consultation payments.
- Digital prescriptions.
- Prescription printing.
- Follow-up appointments.
- Reports and administration.

The public website and internal application should share the relevant backend infrastructure.

Patient information must never be publicly accessible.

---

# 3. USER ROLES AND PERMISSIONS

Implement role-based access control (RBAC).

## 3.1 Owner / Administrator

The owner should have administrative access.

Capabilities:

- View overall clinic dashboard.
- Add, edit and deactivate doctors.
- Add and manage receptionist accounts.
- Manage staff permissions.
- Configure consultation fees.
- Configure doctor schedules.
- Manage chamber assignments.
- View all appointments.
- View patient records subject to appropriate access controls.
- View consultation payment reports.
- View daily, weekly and monthly reports.
- Configure clinic information.
- View audit logs.
- Manage system settings.

## 3.2 Receptionist

The receptionist is responsible for coordinating clinic operations.

Capabilities:

- Register new patients.
- Search existing patients.
- Edit permitted patient details.
- Create appointments.
- Receive online appointment requests.
- Confirm or reject appointment requests.
- Reschedule appointments.
- Cancel appointments.
- Register walk-in patients.
- Mark patients as arrived.
- Collect consultation fees.
- Record payment methods.
- Generate payment receipts.
- Manage doctor queues.
- Notify patients about schedule changes.
- View finalized prescriptions.
- Print prescriptions.

Receptionists must NOT be allowed to modify finalized medical prescriptions.

## 3.3 Doctor

Every doctor should have an individual login.

Each doctor will use a separate computer in their respective chamber.

Capabilities:

- View their own daily appointments.
- View their patient queue.
- Open patient profiles.
- View relevant previous consultation history.
- Record clinical notes.
- Record symptoms and examination findings.
- Record diagnosis.
- Write digital prescriptions.
- Add medicines.
- Specify dosage, frequency and duration.
- Add instructions.
- Add investigation recommendations.
- Finalize prescriptions.
- View their previous consultations.
- Recommend follow-up appointments.

Doctors should not be able to access administrative financial reports unless explicitly authorized.

A doctor must only access records necessary for their clinical work.

## 3.4 Pharmacy Staff

The pharmacy integration is a later development phase.

For the initial version, pharmacy staff should have restricted access to finalized prescriptions.

Capabilities:

- Receive new prescription notifications.
- Search prescriptions using prescription number or patient identifier.
- View finalized prescriptions.
- Print prescriptions.

Do not implement complete pharmacy inventory, medicine sales or supplier management in the initial clinic release.

Those features will be developed separately.

---

# 4. REAL-WORLD PATIENT WORKFLOW

This is the most important requirement.

The application must reflect how an actual clinic operates.

## Step 1: Patient discovers the clinic

A patient finds Padma Clinic through:

- Google Search.
- Google Maps.
- The clinic website.
- WhatsApp.
- Word of mouth.

The patient visits the public website and checks available doctors, their schedules and consultation information.

## Step 2: Appointment request

Patients should be able to request appointments through the website.

They should provide:

- Patient name.
- Phone number.
- Age or date of birth, where appropriate.
- Selected doctor.
- Preferred date.
- Preferred time or available slot.
- Reason for visit (optional).

Do not require patients to create an account for basic appointment requests.

Also support appointments received through:

- WhatsApp.
- Phone calls.
- Direct reception visits.

WhatsApp and phone appointments must be manually entered by the receptionist into the same central appointment system.

There must be only one authoritative appointment database.

## Step 3: Receptionist confirms appointments

**Important business rule: Every appointment must be confirmed by the receptionist.**

Online submissions should initially be treated as appointment requests, not confirmed bookings.

Receptionist workflow:

1. Open pending appointment requests.
2. Check the selected doctor's availability.
3. Check chamber allocation.
4. Check existing appointments.
5. Confirm, reject or suggest another time.
6. Notify the patient of the decision.

The system must prevent accidental double booking.

## Step 4: Patient arrives at the clinic

When a patient arrives:

1. Receptionist asks for their phone number.
2. Searches the patient database.
3. If an existing patient is found, opens their profile.
4. Otherwise, registers a new patient.
5. Links the appointment to the patient.
6. Marks the patient as arrived.

Every patient should have a unique patient ID.

Do not rely exclusively on phone numbers as unique identifiers because phone numbers can be shared or changed.

## Step 5: Consultation fee payment

**Business rule: Consultation fees are collected at reception before consultation.**

Receptionist:

1. Opens the appointment.
2. Checks the doctor's consultation fee.
3. Records the amount collected.
4. Selects payment method.
5. Generates a receipt.
6. Marks the consultation payment as paid.

Support:

- Cash.
- UPI.
- Other configurable payment methods.

The system must maintain payment history and transaction references.

Payment records should not be silently deleted or overwritten.

Provide an auditable correction/refund workflow.

## Step 6: Patient enters the queue

Once the patient has arrived and payment has been recorded, they become eligible for consultation.

Their status changes to:

READY_FOR_CONSULTATION.

The receptionist can see the queue for each doctor.

Queue priority:

**Appointment order, with walk-ins accommodated.**

Walk-in workflow:

1. Register the patient.
2. Select the doctor.
3. Register the visit as a walk-in.
4. Collect the consultation fee.
5. Add the patient to the doctor's queue.
6. Assign an appropriate queue position.

Walk-ins should not automatically jump ahead of confirmed appointments.

The receptionist should be able to manage exceptions, such as urgent cases, with a recorded reason.

## Step 7: Doctor consultation

Each doctor has a separate workstation and login.

When a doctor logs in, they should see:

- Their name and profile.
- Today's schedule.
- Today's appointments.
- Current patient queue.
- Next eligible patient.
- Completed consultations.
- Relevant patient history.

Doctor workflow:

1. Select the next eligible patient.
2. Open the patient profile.
3. Review previous consultation records.
4. Start consultation.
5. Record clinical information.
6. Write the prescription.
7. Finalize the prescription.

## Step 8: Digital prescription

This is a critical feature.

Doctors must be able to write prescriptions digitally using their computers.

Prescription information should include:

- Clinic name and details.
- Doctor name and credentials.
- Doctor registration details, when supplied.
- Patient name.
- Patient identifier.
- Patient age and relevant demographics.
- Consultation date.
- Diagnosis.
- Clinical notes, where appropriate.
- Medicine name.
- Strength.
- Dosage.
- Frequency.
- Duration.
- Quantity.
- Route of administration.
- Instructions.
- Follow-up date, if recommended.

Provide a searchable medicine catalogue with the ability to enter medicines not already in the catalogue, subject to appropriate controls.

The prescription interface should be fast and easy to use.

Doctors should be able to use keyboard navigation wherever practical.

**Important prescription rules:**

- Only authorized doctors can finalize prescriptions.
- Finalized prescriptions must not be silently editable.
- Corrections must create documented amendments.
- Every prescription must have a unique prescription number.
- Preserve the original finalized prescription.
- Maintain timestamps and the identity of the prescribing doctor.
- Generate a clean, professional, print-ready prescription.
- Support A4 printing initially, with the option to add smaller formats later.

Do not introduce AI-generated diagnoses, medicine recommendations or autonomous prescribing.

The doctor is responsible for all clinical decisions and must approve every prescription.

## Step 9: Prescription distribution

**Critical requirement: Finalized prescriptions must be available at BOTH reception and Jatindra Mohan Medico.**

After a prescription is finalized:

1. Save it to the central database.
2. Make it immediately accessible to reception.
3. Make it accessible to authorized pharmacy staff.
4. Notify both locations about the new prescription.
5. Allow either location to print it.

Printing should be configurable.

Do not automatically print every prescription unless explicitly enabled.

A print action should be recorded where practical.

The prescription must remain available even if a printer is temporarily unavailable.

## Step 10: Consultation completion

After consultation:

- Mark the consultation as completed.
- Store clinical notes and prescription.
- Record follow-up recommendations.
- Update the patient's visit history.
- Allow reception to schedule the next appointment.

A patient may choose not to purchase medicines from the associated chemist shop.

Do not automatically create a pharmacy sale just because a prescription exists.

---

# 5. APPOINTMENT MANAGEMENT SYSTEM

Build a complete appointment scheduling engine.

It should support:

- Multiple doctors.
- Two or more chambers.
- Doctor-specific schedules.
- Different visiting days.
- Different consultation timings.
- Breaks and unavailable periods.
- Doctor leave.
- Temporary schedule modifications.
- Different consultation fees.
- First-visit and follow-up fees.
- Configurable appointment duration.
- Appointment requests.
- Confirmations.
- Cancellations.
- Rescheduling.
- Walk-ins.
- No-shows.

Do not hardcode doctors to chambers.

A doctor should be assignable to different chambers according to the schedule.

Prevent overlapping chamber allocations.

Prevent double booking for the same doctor.

Maintain appointment and visit statuses separately.

Suggested appointment statuses:

- REQUESTED
- CONFIRMED
- RESCHEDULED
- CANCELLED
- NO_SHOW

Suggested visit statuses:

- NOT_ARRIVED
- ARRIVED
- PAYMENT_PENDING
- READY_FOR_CONSULTATION
- CONSULTING
- COMPLETED

Implement clear transitions and validation rules.

---

# 6. PATIENT MANAGEMENT

Create a central patient registry.

Patient profile should include:

- Unique patient ID.
- Full name.
- Phone number.
- Date of birth or age.
- Gender, where relevant.
- Address (optional).
- Registration date.
- Relevant medical history.
- Previous visits.
- Previous prescriptions.
- Follow-up history.

Features:

- Search by patient name.
- Search by phone number.
- Search by patient ID.
- View patient history.
- View appointment history.
- View prescriptions.
- View consultation records.

Avoid duplicate patient registrations.

Provide a process for identifying and safely merging duplicate records, with an audit trail.

Collect only the personal and medical information genuinely needed.

---

# 7. CONSULTATION PAYMENT MANAGEMENT

Build a consultation fee management module.

Support:

- Doctor-specific consultation fees.
- First-visit fee.
- Follow-up fee.
- Optional fee overrides.
- Cash.
- UPI.
- Other configurable methods.
- Payment receipts.
- Refunds and corrections.
- Daily collections.
- Doctor-wise collection reports.

Consultation payment must be separate from pharmacy purchases.

Do not assume all doctors charge the same amount.

Fee configuration should be managed by authorized administrators.

---

# 8. PUBLIC WEBSITE — PADMA CLINIC

Build a professional, modern, trustworthy healthcare website.

The design should feel like a real medical clinic's website, not a generic SaaS landing page.

Required pages:

## Homepage

Include:

- Professional hero section.
- Clinic introduction.
- Book appointment CTA.
- Featured doctors.
- Available medical services.
- Clinic highlights.
- Visiting hours.
- Contact information.
- Google Maps location.
- WhatsApp contact option.

## About Us

- Clinic history.
- Introduction.
- Mission and values.
- Facilities.

Do not invent clinic history or medical credentials. Use editable placeholders until actual information is provided.

## Doctors

Doctor listing page with:

- Doctor photographs.
- Names.
- Qualifications.
- Specialities.
- Experience, if provided.
- Visiting days.
- Consultation timings.
- Appointment CTA.

Individual doctor profile pages should be supported.

## Services

Show available services and facilities.

All service descriptions must be editable.

Do not invent services that the clinic does not provide.

## Appointment page

Allow patients to:

1. Select a doctor.
2. Choose a preferred date.
3. View relevant available appointment times, where configured.
4. Enter patient information.
5. Submit an appointment request.
6. Receive acknowledgement that the request is pending confirmation.

Clearly state that submission does not guarantee an appointment until reception confirms it.

## Contact page

Include:

- Clinic phone number.
- WhatsApp number.
- Address.
- Google Maps.
- Opening hours.
- Contact form.

Make the website mobile responsive.

Implement local SEO:

- Appropriate page titles.
- Meta descriptions.
- Clean URLs.
- Open Graph tags.
- Sitemap.
- Robots.txt.
- Structured data using appropriate healthcare/local business schema.
- Google Maps integration.

Do not publish fabricated medical claims or unverified credentials.

---

# 9. UI/UX DESIGN REQUIREMENTS

The software must be easy to use for people who may not be technically experienced.

The receptionist and doctors should be able to understand the application with minimal training.

Design principles:

- Clean and professional.
- Minimal visual clutter.
- Clear typography.
- Fast navigation.
- Responsive layouts.
- Accessible contrast.
- Consistent design system.
- Clear status indicators.
- Keyboard-friendly interactions.
- Useful empty states.
- Confirmation before destructive actions.
- Loading and error states.
- Meaningful success notifications.

Use Shadcn/UI and Tailwind CSS where appropriate.

Use Lucide icons.

Avoid excessive gradients, unnecessary animations and oversized decorative cards.

Prioritize functionality and usability over visual gimmicks.

The internal dashboard should be optimized primarily for desktop computers.

The public website must be fully responsive for mobile.

---

# 10. PROPOSED TECHNOLOGY STACK

Use the following stack unless you identify a strong technical reason to recommend an alternative.

Frontend:
- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Shadcn/UI.
- Lucide icons.

Backend:
- Next.js server-side functionality and secure API endpoints.
- PostgreSQL through Supabase.

Database:
- Supabase PostgreSQL.

Authentication:
- Supabase Auth.

Real-time updates:
- Supabase Realtime.

Hosting:
- Vercel for Next.js.

Database hosting:
- Supabase.

Forms and validation:
- React Hook Form.
- Zod.

Charts:
- Recharts.

Printing:
- Browser-based print templates.
- Print-optimized prescription components.
- Support local USB or network printers connected to reception and pharmacy computers.

Use a modular and maintainable architecture.

Do not create unnecessary microservices.

A modular monolithic application is preferable initially.

---

# 11. DATABASE DESIGN

Design a normalized PostgreSQL database.

The initial schema should consider these tables:

1. users
2. user_roles
3. doctors
4. chambers
5. doctor_schedules
6. schedule_exceptions
7. patients
8. appointments
9. visits
10. queue_entries
11. consultation_payments
12. prescriptions
13. prescription_items
14. medicine_catalogue
15. clinic_services
16. notifications
17. audit_logs
18. clinic_settings

You may add, modify or separate tables where appropriate.

For every table:

- Define primary keys.
- Define foreign keys.
- Define indexes.
- Define timestamps.
- Define appropriate constraints.
- Define deletion and archival policies.

Use UUIDs where appropriate.

Use database transactions for operations that must succeed or fail together, such as appointment confirmation and queue creation.

Avoid storing unnecessary duplicated information.

Important relationships:

- A patient can have multiple appointments.
- A patient can have multiple visits.
- A visit belongs to a patient and a doctor.
- A visit may have one or more prescriptions, depending on the workflow.
- A prescription belongs to a visit and a prescribing doctor.
- A prescription contains multiple prescription items.
- Doctors can have multiple schedules.
- Doctors can be assigned to different chambers at different times.

Implement Row Level Security (RLS) for sensitive data.

Do not rely only on frontend role checks.

---

# 12. REAL-TIME SYSTEM REQUIREMENTS

The application will be used simultaneously by multiple people.

Example:

- Receptionist registers a patient.
- Doctor sees the patient appear in their queue.
- Doctor finalizes a prescription.
- Reception sees the prescription notification.
- Pharmacy sees the prescription notification.

These updates should happen without manual page refreshes wherever possible.

Use Supabase Realtime appropriately.

Handle:

- Connection interruptions.
- Reconnection.
- Duplicate events.
- Concurrent updates.
- Stale data.
- Race conditions.

Database state must remain the source of truth.

Do not rely on realtime messages alone for critical business operations.

---

# 13. PRINTING SYSTEM

Printing is a critical part of the actual business workflow.

Build print-ready layouts for:

1. Appointment receipts.
2. Consultation payment receipts.
3. Medical prescriptions.

Prescription printing requirements:

- Clinic branding.
- Doctor details.
- Patient details.
- Consultation date.
- Prescription number.
- Diagnosis.
- Medicine list.
- Dosage and instructions.
- Doctor signature area.

Allow printing from reception and pharmacy computers.

A browser-based print workflow is acceptable initially.

Do not assume a cloud server can directly control a local USB printer.

If silent automatic printing is needed later, investigate a secure local print agent.

---

# 14. SECURITY AND PRIVACY

This system will handle sensitive patient information.

Security must be designed into the application from the beginning.

Requirements:

- Secure authentication.
- Role-based access control.
- Database-level RLS.
- Secure server-side authorization.
- HTTPS.
- Protected API routes.
- Input validation.
- Protection against common web vulnerabilities.
- Audit logs.
- Secure password handling.
- Database backups.
- Recovery procedures.
- Session management.
- Appropriate data retention and deletion policies.

Do not expose Supabase service-role keys in the browser.

Do not expose patient records through public APIs.

Do not use real patient data during development or testing.

Use synthetic data.

Consider applicable Indian privacy and healthcare requirements, including the Digital Personal Data Protection framework and relevant medical record and prescription requirements. Identify requirements that need legal or regulatory verification rather than assuming compliance.

---

# 15. INFRASTRUCTURE AND COST

The project should be economical.

We do not want to purchase expensive hardware or maintain a dedicated physical server unnecessarily.

Preferred infrastructure:

- Vercel hosting.
- Supabase database and authentication.
- Cloudflare DNS, if useful.
- Existing computers at the clinic.
- Existing computer at home for development and testing.

The clinic computers should access the system through a browser.

The home computer should NOT be required to remain switched on for the production application to work.

Do not recommend a VPS unless there is a specific technical or economic justification.

Evaluate free tiers for development, but clearly explain their limitations before production use.

The system must have:

- Automated backups.
- A tested recovery process.
- Monitoring.
- Error logging.
- Secure environment variables.
- Production and development environments.

Plan for internet and power outages.

The clinic should have a documented manual fallback for patient queues and prescription handling.

---

# 16. FUTURE DEVELOPMENT — NOT PART OF THE INITIAL RELEASE

Keep the architecture extensible for these features:

## Pharmacy integration

Jatindra Mohan Medico will eventually have:

- Medicine inventory.
- Batch management.
- Expiry management.
- Supplier management.
- Medicine purchases.
- Sales billing.
- Prescription-based dispensing.
- Customer credit / udhar ledger.
- Pharmacy revenue reports.

The pharmacy should be able to access finalized prescriptions from Padma Clinic.

However, do not build the full pharmacy module until the clinic's core workflows are stable.

## Additional future features

- WhatsApp Business API integration.
- Automated appointment reminders.
- Follow-up reminders.
- Online payment integration.
- Patient portal.
- Multiple clinic branches.
- Advanced reports.
- Data export.
- Offline-capable workflows.

Keep these features in the roadmap rather than overcomplicating the MVP.

---

# 17. DEVELOPMENT METHODOLOGY

I want you to work in clearly defined phases.

DO NOT attempt to build the entire application in one giant implementation.

## Phase 0 — Discovery and architecture

Before writing code:

1. Inspect the existing repository.
2. Understand its current structure.
3. Identify existing dependencies.
4. Identify existing implementation, if any.
5. Identify missing information.
6. Propose the application architecture.
7. Propose the database schema.
8. Define user roles and permissions.
9. Define the main workflows.
10. Identify technical risks.

Produce:

- PROJECT_REQUIREMENTS.md
- SYSTEM_ARCHITECTURE.md
- DATABASE_SCHEMA.md
- USER_ROLES_AND_PERMISSIONS.md
- WORKFLOW_SPECIFICATION.md
- DEVELOPMENT_ROADMAP.md

If important business information is missing, use clearly marked configuration placeholders.

Do not invent doctors, fees, contact information, addresses, clinic timings or services.

Ask focused questions when an answer is essential.

## Phase 1 — Foundation

Implement:

- Next.js application structure.
- TypeScript configuration.
- Design system.
- Supabase integration.
- Authentication.
- User roles.
- Secure route protection.
- Database migrations.
- Basic admin dashboard.

## Phase 2 — Doctor and chamber management

Implement:

- Doctor profiles.
- Chamber management.
- Doctor schedules.
- Schedule exceptions.
- Doctor-specific fees.
- Admin management interfaces.

## Phase 3 — Patient and appointment management

Implement:

- Patient registration.
- Patient search.
- Patient profiles.
- Appointment requests.
- Receptionist confirmation.
- Rescheduling.
- Cancellation.
- Walk-in registration.
- Appointment calendar.

## Phase 4 — Reception and queue management

Implement:

- Reception dashboard.
- Daily appointments.
- Patient check-in.
- Payment collection.
- Receipt generation.
- Doctor-specific queues.
- Walk-in handling.
- Queue status updates.

## Phase 5 — Doctor dashboard

Implement:

- Individual doctor login.
- Doctor-specific dashboard.
- Today's queue.
- Patient history.
- Consultation interface.
- Clinical notes.
- Consultation completion.

## Phase 6 — Digital prescriptions

Implement:

- Medicine catalogue.
- Prescription editor.
- Dosage and frequency fields.
- Prescription preview.
- Finalization.
- Prescription numbering.
- Amendments.
- Print layouts.
- Real-time prescription notifications.

## Phase 7 — Public clinic website

Implement:

- Homepage.
- About page.
- Doctor listing.
- Doctor profile pages.
- Services.
- Appointment request form.
- Contact page.
- SEO.
- Mobile responsiveness.

## Phase 8 — Testing and production deployment

Test:

- Authentication.
- Permissions.
- Patient registration.
- Appointment booking.
- Double-booking prevention.
- Doctor scheduling.
- Queue management.
- Payment recording.
- Prescription creation.
- Prescription printing.
- Real-time synchronization.
- Concurrent usage.
- Error handling.
- Backup and restoration.

Do not mark a feature complete merely because its interface exists.

Verify its actual functionality.

---

# 18. IMPORTANT ENGINEERING RULES

Follow these rules throughout development:

1. Use clean, modular and maintainable code.
2. Avoid unnecessary abstractions.
3. Use strict TypeScript.
4. Validate all user input.
5. Handle errors explicitly.
6. Use database constraints for important business rules.
7. Implement secure server-side authorization.
8. Do not hardcode clinic information.
9. Keep configurable business settings in the database.
10. Do not fabricate business or medical information.
11. Avoid unnecessary dependencies.
12. Do not break existing functionality.
13. Write database migrations.
14. Use synthetic data for testing.
15. Document important architectural decisions.
16. Build responsive and accessible interfaces.
17. Test real workflows, not just individual components.
18. Maintain a clear distinction between appointment status, visit status, payment status and prescription status.

Prioritize correctness and reliability over implementation speed.

---

# 19. WHAT I EXPECT FROM YOU RIGHT NOW

Do not start implementing the entire application immediately.

First, complete Phase 0.

I want you to:

1. Analyze the project requirements.
2. Identify ambiguities and missing business information.
3. Propose the ideal architecture.
4. Explain the complete application structure.
5. Design the initial database schema.
6. Define the exact user roles and permissions.
7. Explain the real-world workflows.
8. Identify potential operational problems.
9. Recommend the most economical reliable infrastructure.
10. Create the development roadmap.

Then present your findings.

Separate confirmed requirements from assumptions and open questions.

Do not ask me 30 questions at once. Ask only the most important questions, preferably one at a time.

Once the architecture and requirements are approved, proceed phase by phase.

**Final objective: Build a reliable, secure, easy-to-use, production-ready digital operating system for Padma Clinic that can eventually integrate with Jatindra Mohan Medico.**