# Design: Padma Clinic

| | |
|---|---|
| Version | 0.1 (draft, awaiting review) |
| Date | 2026-11-01 |
| Decisions | D-012 (phone first), D-019 (West Bengal), D-020 (English and Bengali), D-021 (direction) |
| Method | Impeccable skill: mode, direction, craft floor |

Claude reads this before touching any screen.

## 1. Who and where

- **Patients and their families** in [TBD: clinic locality], West Bengal. Often a son or daughter books for a parent.
- **Mid-range Android phones on 4G**, often outdoors in daylight, sometimes on a slow connection. Many people read Bengali more comfortably than English, and most know WhatsApp better than websites.
- What they want, in this order:
  1. Is my doctor in today, or on which day, and at what time?
  2. How do I get a serial?
  3. Where is the clinic, and how do I call?

## 2. Mode and primary action

- **Website:** Impeccable's Persuade mode, but in service of a task. The **primary action is "Book a serial" (সিরিয়াল বুক করুন)**. The secondary actions are Call and WhatsApp.
- **Internal app (later):** Operate mode, with precision and calm. The same tokens, and quieter motion.
- Every page answers its main question within the first phone screen.

## 3. Principles

1. **To the point.** One idea per section: a heading and one line, not paragraphs. Cut copy in half, then cut again.
2. **Local, not generic.** Bengali is a first-class language, with its own typeface, Bengali digits and local time words. Wording follows how people actually speak: সিরিয়াল, ডাক্তারবাবু, বসেন.
3. **Minimal surface, lively details.** The layout stays quiet. Motion lives in a few deliberate places (§7).
4. **Thumb first.** The main actions are always within reach. A sticky action bar sits at the bottom on phones.
5. **Honest.** No invented facts or claims. Times are always shown as approximate (D-011).

## 4. Visual identity

This is a default until the clinic supplies its logo and colours.

- **Motif:** the lotus (পদ্ম, *Padma*). There is one line-drawn lotus in the hero, which draws itself on load, and a small lotus mark as a stand-in logo. There is no other ornament.
- **Theme:** light only for the public site. That was chosen from the setting, phones used in daylight, not because clinics are usually light.
- **Palette:**

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FBF8F3` | Page background (warm off-white) |
| `surface` | `#FFFFFF` | Raised panels |
| `ink` | `#1D1A17` | Text |
| `ink-muted` | `#5C544D` | Secondary text (7:1 on paper) |
| `line` | `#E7DFD4` | Dividers and borders |
| `leaf` | `#1E5B45` | **Primary actions**, links, "in now" (lotus-leaf green, 8:1 with white) |
| `leaf-soft` | `#E3EFE8` | Selected and success backgrounds |
| `lotus` | `#B83F72` | Brand accent: the lotus, highlights (5:1 on white) |
| `lotus-soft` | `#F9E8EF` | Avatar backgrounds, the sample banner |
| `sun` / `sun-soft` | `#9A5B00` / `#FBEFD9` | "Starts later" and warning states |

The usual healthcare blue was avoided on purpose. Green and pink come from the lotus and its leaf, which ties the colours to the clinic's name.

## 5. Typography

| Role | Family | Notes |
|---|---|---|
| Display (headings, names, times) | **Anek Bangla** (variable weight and width) | One family for both Bengali and Latin headings. The clinic name uses a slightly wider width for presence. |
| Body | **Hind Siliguri** (400, 500, 600) | Clear Bengali for long reading. Its Latin is also good. |

- Body text is 17px with a line height of 1.65. Bengali needs more height for its vowel signs, so Bengali headings get a looser line height than Latin ones.
- Headings use `text-wrap: balance`, and times and numbers use tabular figures.

## 6. Layout (phones first)

- Design at a width of 360–400px, with 16px side gutters. At 768px and above, sections become two or three columns.
- Touch targets are at least 44px. The sticky bottom bar on phones holds **Call**, **WhatsApp** and **Book**, and it respects the phone's safe area.
- Use as few containers as possible: spacing and dividers instead of cards. Panels are used only for the "Today" box and the doctor profiles, and are never nested.

## 7. Motion (D-021)

The motion is fast, quiet and done in CSS only, with no animation library. Every item has a reduced-motion version: it appears straight away, with no movement.

| Where | What | Why | Timing |
|---|---|---|---|
| Hero | The lotus draws its petals, then fills. The heading, line and buttons rise into place. | The one authored moment | Lotus about 1.6s; text 400–600ms, staggered |
| "Today" box | A soft pulse on the dot of a doctor who is in now | Shows a live status at a glance | 2s loop |
| Day picker | A pill slides to the chosen day, and that day's list rises in | Shows the change of state | 250ms / 200ms |
| Buttons | Press shrinks to 97% | Confirms the tap | 120ms |
| Bottom bar | Slides up once the hero's buttons scroll away | Keeps the actions in reach | 250ms |
| Doctor profile (desktop) | Lifts slightly on hover | Shows it can be tapped | 200ms |

Easing is `cubic-bezier(0.16, 1, 0.3, 1)`, with no bounce. There are no scroll-reveal effects on every section.

## 8. Copy voice

- Short and warm, with plain verbs. "Book a serial", not "Submit".
- Bengali is written the way it is spoken locally, not as a stiff translation.
- Be honest about the process: "Reception confirms your serial and time." Never "Booking confirmed" for a request.

## 9. Refuse (Impeccable's list, applied here)

- Grids of identical icon cards
- Small labels above headings
- Gradient text, decorative glass or blur
- Emoji as icons (Lucide only)
- A stock photo of a smiling doctor
- Healthcare blue chosen by habit
- Scroll animations on every section

## 10. Checks before any screen is called done

- Text contrast is at least 4.5:1, focus rings are visible, and every control is labelled.
- It works at 360px and 1440px, in both English **and Bengali**, because Bengali text runs longer and taller.
- With reduced motion turned on, nothing moves and nothing is hidden.
- On a mid-range phone over 4G, the main content appears within 2.5 seconds (LCP ≤ 2.5s) and nothing jumps around as it loads (CLS < 0.1).
- The screen has been checked by eye in a real browser screenshot, at phone and desktop sizes.
