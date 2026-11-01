# Design: Padma Clinic

| | |
|---|---|
| Version | 0.2 (awaiting review). Replaces the v0.1 lotus direction. |
| Date | 2026-11-01 |
| Decisions | D-012 (phone first), D-019 (West Bengal), D-020 (English and Bengali), D-024 (white, nav, footer), D-025 (visual direction), D-026 (booking card), D-027 (footer colour), D-028 (phone menu), D-029 (contact, favicon), D-030 (doctor cards) |
| References | bondapp.io (navbar, plain-spoken hero), the "SmileLab" dental hero the user shared (inset colour panel, oversized type, rotating badge) |
| Method | Impeccable skill; research on doctor-booking pages (§9) |

Claude reads this before touching any screen.

## 1. Who and where

- **Patients and their families** around the clinic in West Bengal, mostly on mid-range Android phones over 4G. Often a son or daughter books for a parent.
- They come to the site to **book a doctor**. Second, they want to call or find the clinic.

## 2. What the page must do

- Say within one second that **this is where you book a doctor at Padma Clinic**.
- Let people book in the fewest steps: doctor, day, name, mobile, send (D-026).
- Keep Call, WhatsApp and Directions one tap away on every screen.

## 3. Principles

1. **Purpose first.** The headline names the job ("Book your doctor's appointment"), and the booking card is the hero visual.
2. **Modern, not template.** Oversized light type, one bold colour panel, one accent, real controls. No stock icon-card grids.
3. **Local.** Bengali is first-class, and the wording is how people speak: সিরিয়াল, ডাক্তারবাবু.
4. **Honest.** No invented stats, reviews, credentials or timings. Missing details are hidden, not faked (D-023).
5. **Thumb first.** A floating nav, a sticky bottom bar on phones, touch targets of at least 44px.

## 4. Visual identity

- **Theme:** a white page. The hero and the footer are matching inset rounded panels in clinic blue, so the page opens and closes in one colour (D-027). The "How booking works" band is a photo under a dark navy overlay.
- **Logo and favicon:** a white medical plus in a clinic-blue rounded square, a stand-in until the clinic supplies a logo. The tab icon is `src/app/icon.svg`; the iPhone home-screen icon is `src/app/apple-icon.png` (180px, square, because iOS rounds the corners itself).
- **Palette:**

| Token | Hex | Use |
|---|---|---|
| `surface` | `#FFFFFF` | Page and cards |
| `mist` | `#F3F6FA` | Subtle fills |
| `ink` | `#0F1B2D` | Text |
| `ink-muted` | `#526070` | Secondary text |
| `line` | `#E2E8F0` | Borders |
| `brand` | `#2463A6` | Hero and footer panels, primary buttons, links (6.2:1 with white). Secondary text on it is white at 80% or more (4.6:1); lower opacities fail contrast. |
| `brand-strong` / `brand-soft` | `#1B4F87` / `#E6EEF8` | Hover, selected fills, avatars |
| `lime` | `#D4F26A` | The accent: the highlighted headline word, the badge, arrow circles. Use sparingly. |
| `navy` | `#0E2240` | The booking band overlay |
| `ok` / `ok-soft` | `#1F7A4D` / `#E3F3EA` | "In now" status |
| `sun` / `sun-soft` | `#9A5B00` / `#FBEFD9` | "Later" status |

- **Photos:** free Unsplash and Pexels photos, toned to fit the palette. **People in photos must be Indian, so local patients can relate** (D-033). Avoid photos where a doctor's face is the subject, and crop out any other clinic's name or branding. Replace them with the clinic's own photos when possible.

| File | Unsplash photo | Where it is used |
|---|---|---|
| `src/assets/images/hero-booking-home.jpg` | Pexels 19485860 (Click'r Sharad Patil): an elderly Indian woman in a saree booking from home on her laptop | Behind the hero, blue luminosity blend. She shows between the headline and the booking card, looking towards it (D-046) |
| `src/assets/images/lab-tubes.jpg` | Pexels 6622519 (Charlie-Helen Robinson): barcoded sample tubes in a rack | Full body checkup tile in Lab tests, blue luminosity blend (D-034) |
| `src/assets/images/clinic-consult.jpg` | Pexels 18870282 (World Sikh Organization): an Indian doctor examining an elderly Sikh patient with a stethoscope, cropped to remove another clinic's poster | Background of "How booking works" (D-033) |

## 5. Typography

| Role | Family | Notes |
|---|---|---|
| Latin display and body | **Geist** | Headline weight 500, tracking −0.045em, leading 0.95 |
| Bengali | **Anek Bangla** (headings) and **Hind Siliguri** (body) | Used automatically for Bengali glyphs. Bengali headlines get leading 1.2 and no negative tracking. |

Body text is 17px. Never put letter-spacing on Bengali text, because it breaks the conjuncts.

## 6. Layout

- **Navbar:** floating and inset. Logo on the left, 3–4 links in the centre, then phone (on wide screens), the language switch, and a "Book appointment" pill with a lime arrow. Transparent over the hero; white with a shadow after scrolling. Phones show the logo, the language switch and a white menu button.
- **Navbar on narrow phones (D-036):** below 400px the logo is a little smaller and never wraps, and the language switch drops its icon but keeps its label. Everything stays on one line down to 300px.
- **Phone bottom bar (D-036):** slides up once the hero's buttons scroll away, and steps aside while the booking card reaches the bottom quarter of the screen, so it never covers the card's Send button.
- **Phone menu (D-028):** the navbar never moves. The menu button turns into a close button in the same spot, and a full-screen white menu drops down from the top behind the bar: large section links, then an inset clinic-blue panel ("Book your serial") with one-tap booking for each doctor, Call, WhatsApp and Directions, and the owner.
- **Hero:**
  - On phones: headline (badge beside it), doctors' avatars, one line of explanation, Call and Directions, then the booking card.
  - On desktop: text on the left, the booking card on the right.
- **Doctors (D-043):** a list of chamber nameplates, the way doctors in Bengal present themselves. There are no cards, no placeholder portraits and no icon chips. Each row has the name set large with the Bengali name beneath it (the English name on the Bengali page), the degree and facts in plain text, a plain-text line "Call the clinic for timings" until timings are known, and one Book pill. A round photo appears beside the name once the clinic supplies one. Rows are separated by thin rules; the intro sits to the right of the heading on desktop. Behind the list, a quiet watermark of the **Rod of Asclepius** (the medical emblem, drawn for this site) at 7% opacity, faded as one layer (D-046).
- **Contact (D-029):** one bordered card. Details (phone, WhatsApp, owner, then address and hours once known) are rows with dividers and the Directions and Call buttons at the bottom; the map fills the other half at the same height. On phones the map sits below the details inside the same card.
- **Footer (D-027, D-029):** an inset clinic-blue panel matching the hero. On phones and tablets: brand, tagline and owner across the top, Clinic beside Doctors, then Contact at full width so the email never breaks. Four columns on wide screens.
- **Lab tests (D-032, D-042):** an inset mist panel.
  - Header: a "Partner lab: Thyrocare" pill, the heading and a **search box**. People usually arrive knowing the test their doctor named.
  - Browsing: the full body checkup card (lab photo, lime tag, one sentence on what it covers, "Ask about packages") sits beside a **test menu**, a single white panel styled like the printed test menus labs hand out.
    - Categories flow in balanced columns at their natural height, separated by a thin rule, so no box is ever left half empty.
    - Each category has a small tinted icon and a plain list of test names, with no pills or per-test explanations.
    - A footer row reads "Don't see your test?" with WhatsApp and Call.
  - Searching swaps the menu for a results list: each match with its group and what it checks. No match offers "Ask about '…'" on WhatsApp with the typed name.
  - Two columns on desktop (card, then menu), the card over the menu on tablets, and everything stacked on phones.
- **FAQ (D-044, D-045):** each question is a card; the whole card is the button (64px).
  - **One answer open at a time.** Opening another closes the first. The answer slides open by animating its grid row from 0 to full height plus opacity, over 300ms. The open card lifts with a soft shadow, and its plus turns into a ×.
  - Closed answers are inert, so screen readers and the keyboard skip them.
  - A clinic-blue "Still have a question?" card shows the phone number large, with Call and WhatsApp. On desktop it sits under the heading; on phones it comes after the questions.
  - Answers use only confirmed facts: no fees, no timings.
- **Sections:** doctors, "How booking works" (on a photo), lab tests, services (once real), FAQ, contact with the map, then the footer.

## 7. Motion

| Where | What | Timing |
|---|---|---|
| Hero | Text rises in, staggered. The photo settles from a slight zoom. | 700ms; 1.8s |
| Badge | The ring of text turns | 14s per turn, linear |
| Nav | Background and shadow fade in on scroll; the active link underline grows | 300ms |
| Phone menu | Drops down from the top behind the fixed navbar; the menu icon turns into a close icon; links rise one by one. Closing is faster. | 520ms open, 300ms close; 45ms stagger |
| Lab tests | Tiles settle in, 40ms apart, when the filter changes; the explanation settles in when a pill is tapped; the lab photo zooms slightly on hover | 240ms |
| Doctor cards | Card lifts on hover; the faint plus in the portrait panel turns a quarter; the Book arrow turns 45° | 300ms; 700ms; 300ms |
| Booking card | Selected states, success state settles in | 150–240ms |
| Buttons | Press shrinks to 97%; the arrow turns 45° on hover | 120ms; 300ms |

Easing is `cubic-bezier(0.16, 1, 0.3, 1)`. Under reduced motion, nothing moves: no spin, rise, zoom or slide.

## 8. Copy voice

Short and plain, with a verb on every button ("Send request on WhatsApp"). Be honest about the process: "Reception confirms your serial", never "Booked!".

## 9. What research says about booking pages (applied here)

- Put a prominent booking entry point on the homepage, and keep a booking action in the header. → Hero card, nav pill, phone bottom bar.
- Use as few steps as possible and short action labels. → Four fields, one button.
- Tap-to-call on mobile. → Hero, nav, bottom bar.
- Trust signals: credentials, reviews, clear cost. → Add them when the clinic supplies **real** ones. Never invent them.
- Speed and accessibility matter. → Static pages, optimised images, contrast checked.

Sources: [Proweaver](https://www.proweaver.com/amplify-healthcare-website-ux-for-easy-scheduling), [Solution21](https://www.solution21.com/blog-digital-patient-experience-how-modern-website-ux-drives-bookings-and-patient-retention), [Designerly](https://designerly.com/10-health-care-web-design-practices-for-the-telemedicine-age/). These are vendor blogs, so treat them as guidance, not evidence.

## 10. Refuse

- Decorative motifs that don't relate to healthcare (the lotus was dropped)
- Invented statistics or reviews
- Stock photos where a doctor's face is the subject
- Grids of identical icon cards
- Gradient text
- Emoji used as icons

## 11. Checks before any screen is called done

Mobile (D-036). Most visitors use phones, so these are checked in a real browser engine, Chromium (Android) and WebKit (iPhone), on phone profiles from 320px to 430px in both languages:

- No sideways scrolling, and no element is cut off or squeezed. Check 320px especially.
- Tap targets are at least 44px tall. Stacked text links are at least 40px tall, with no gap between them.
- Nothing on the page moves when something is tapped. Space is reserved up front.
- The Back button closes any open overlay, without reloading the page or losing the scroll position.
- Fixed bars never cover a form's fields or buttons.
- Overlays still reach their last item in landscape (360px tall) and at 130% text size.
- The logo and the navbar stay on one line.

Everywhere:

- Contrast is at least 4.5:1 and focus rings are visible.
- No sideways scrolling at 360–390px.
- Checked in English **and** Bengali, at 390px and 1440px.
- With reduced motion turned on, nothing moves.
- Real browser screenshots have been reviewed.
- Every form has been run end to end: errors, success, and the WhatsApp text it produces.
