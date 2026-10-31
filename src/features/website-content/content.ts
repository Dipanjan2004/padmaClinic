import type { PublicSiteData } from "./types";

/**
 * Clinic content supplied by the owner (2026-11-01, D-023). It lives here until
 * the database exists, and then moves to admin-editable tables.
 * Anything not yet supplied is null or empty and is hidden on the site.
 */
export const clinicContent: PublicSiteData = {
  clinic: {
    name: { en: "Padma Clinic" },
    owner: { en: "Nabadwip Kumar Chowdhury", bn: "নবদ্বীপ কুমার চৌধুরী" },
    address: null, // [TBD: full address]
    hours: null, // [TBD: opening hours]
    phone: "+919830337825",
    whatsapp: "+919830337825", // Assumed to be the same number. Confirm with the owner.
    email: "naba.medi@gmail.com", // Owner, 2026-11-01 (D-031)
    mapsUrl: "https://maps.app.goo.gl/5wByP6h2ZpFjhJpN6",
    location: { lat: 22.7273861, lng: 88.4675096 },
  },
  doctors: [
    {
      slug: "amit-sengupta",
      name: { en: "Dr. Amit Sengupta", bn: "ডাঃ অমিত সেনগুপ্ত" },
      qualifications: "MBBS", // Owner, 2026-11-01 (D-030)
      speciality: null, // [TBD]
      pastWork: [],
      photoUrl: null,
      sessions: [], // [TBD: weekly timings]
    },
    {
      slug: "dipanwita-chowdhury",
      name: { en: "Dr. Dipanwita Chowdhury", bn: "ডাঃ দীপান্বিতা চৌধুরী" },
      qualifications: "MBBS", // Owner, 2026-11-01 (D-030)
      speciality: null, // [TBD]
      // The owner wrote "Lady dafrine hospital"; spelling corrected. Confirm the full name.
      pastWork: [{ en: "Lady Dufferin Hospital", bn: "লেডি ডাফরিন হাসপাতাল" }],
      photoUrl: null,
      sessions: [], // [TBD: weekly timings]
    },
  ],
  services: [], // [TBD: services the clinic actually provides]
  // The owner: the clinic offers all kinds of lab tests, and its partner lab is Thyrocare (D-032).
  // The groups follow Thyrocare's own profiles and fever panels. No prices or report times yet.
  labTests: {
    partner: { en: "Thyrocare", bn: "থাইরোকেয়ার" },
    checkup: {
      name: { en: "Aarogyam full body checkups", bn: "আরোগ্যম ফুল বডি চেকআপ" },
      about: {
        en: "Thyrocare's packages that test many things in one go.",
        bn: "থাইরোকেয়ারের প্যাকেজ, এক বারে অনেক পরীক্ষা।",
      },
      covers: [
        { en: "Blood count", bn: "রক্ত" },
        { en: "Sugar", bn: "সুগার" },
        { en: "Thyroid", bn: "থাইরয়েড" },
        { en: "Cholesterol", bn: "কোলেস্টেরল" },
        { en: "Liver", bn: "লিভার" },
        { en: "Kidney", bn: "কিডনি" },
        { en: "Vitamins", bn: "ভিটামিন" },
      ],
    },
    categories: [
      {
        id: "fever",
        icon: "thermometer",
        name: { en: "Fever", bn: "জ্বর" },
        tests: [
          {
            name: { en: "Dengue NS1 antigen", bn: "ডেঙ্গু NS1 অ্যান্টিজেন" },
            about: {
              en: "Finds dengue early, in the first days of fever",
              bn: "জ্বরের প্রথম কয়েক দিনেই ডেঙ্গু ধরা পড়ে",
            },
          },
          {
            name: { en: "Dengue IgG and IgM", bn: "ডেঙ্গু IgG ও IgM" },
            about: {
              en: "Shows a current or past dengue infection",
              bn: "এখন বা আগে ডেঙ্গু হয়েছে কি না দেখায়",
            },
          },
          {
            name: { en: "Malaria", bn: "ম্যালেরিয়া" },
            about: {
              en: "Looks for the malaria parasite in the blood",
              bn: "রক্তে ম্যালেরিয়ার জীবাণু খোঁজে",
            },
          },
          {
            name: { en: "Typhoid (Widal)", bn: "টাইফয়েড (ওয়াইডাল)" },
            about: { en: "Checks for typhoid fever", bn: "টাইফয়েড জ্বর আছে কি না দেখে" },
          },
          {
            name: { en: "Chikungunya", bn: "চিকুনগুনিয়া" },
            about: { en: "For fever with severe joint pain", bn: "জ্বরের সঙ্গে গাঁটে তীব্র ব্যথা হলে" },
          },
        ],
      },
      {
        id: "diabetes",
        icon: "droplet",
        name: { en: "Diabetes", bn: "সুগার" },
        tests: [
          {
            name: { en: "Fasting blood sugar", bn: "খালি পেটে সুগার" },
            about: { en: "Blood sugar after an overnight fast", bn: "সারা রাত না খেয়ে রক্তে সুগার" },
          },
          {
            name: { en: "Blood sugar after meals (PP)", bn: "খাওয়ার পরে সুগার (PP)" },
            about: { en: "Blood sugar two hours after eating", bn: "খাওয়ার দু'ঘণ্টা পরে রক্তে সুগার" },
          },
          {
            name: { en: "HbA1c", bn: "HbA1c" },
            about: { en: "Average blood sugar over the last three months", bn: "গত তিন মাসের গড় সুগার" },
          },
        ],
      },
      {
        id: "thyroid",
        icon: "activity",
        name: { en: "Thyroid", bn: "থাইরয়েড" },
        tests: [
          {
            name: { en: "Thyroid profile (T3, T4, TSH)", bn: "থাইরয়েড প্রোফাইল (T3, T4, TSH)" },
            about: {
              en: "How well the thyroid gland is working",
              bn: "থাইরয়েড গ্রন্থি ঠিকমতো কাজ করছে কি না",
            },
          },
          {
            name: { en: "TSH", bn: "TSH" },
            about: { en: "The main thyroid screening test", bn: "থাইরয়েডের প্রধান স্ক্রিনিং টেস্ট" },
          },
        ],
      },
      {
        id: "heart",
        icon: "heart-pulse",
        name: { en: "Heart", bn: "হার্ট" },
        tests: [
          {
            name: { en: "Lipid profile", bn: "লিপিড প্রোফাইল" },
            about: { en: "Cholesterol and triglycerides", bn: "কোলেস্টেরল আর ট্রাইগ্লিসারাইড" },
          },
          {
            name: { en: "Cardiac risk markers", bn: "কার্ডিয়াক রিস্ক মার্কার" },
            about: {
              en: "Extra heart-risk markers such as hs-CRP",
              bn: "hs-CRP-এর মতো হার্টের বাড়তি ঝুঁকির মাপ",
            },
          },
        ],
      },
      {
        id: "liver-kidney",
        icon: "flask",
        name: { en: "Liver and kidney", bn: "লিভার ও কিডনি" },
        tests: [
          {
            name: { en: "Liver function test (LFT)", bn: "লিভার ফাংশন টেস্ট (LFT)" },
            about: { en: "Liver enzymes, bilirubin and proteins", bn: "লিভারের এনজাইম, বিলিরুবিন ও প্রোটিন" },
          },
          {
            name: { en: "Kidney function test (KFT)", bn: "কিডনি ফাংশন টেস্ট (KFT)" },
            about: {
              en: "Creatinine, urea and how well the kidneys filter",
              bn: "ক্রিয়েটিনিন, ইউরিয়া আর কিডনি কেমন কাজ করছে",
            },
          },
          {
            name: { en: "Uric acid", bn: "ইউরিক অ্যাসিড" },
            about: {
              en: "High levels can cause gout and joint pain",
              bn: "বেশি হলে গেঁটে বাত ও গাঁটে ব্যথা হতে পারে",
            },
          },
          {
            name: { en: "Urine routine", bn: "ইউরিন রুটিন" },
            about: {
              en: "Infection, sugar and protein in the urine",
              bn: "প্রস্রাবে সংক্রমণ, সুগার ও প্রোটিন",
            },
          },
        ],
      },
      {
        id: "blood-vitamins",
        icon: "test-tubes",
        name: { en: "Blood and vitamins", bn: "রক্ত ও ভিটামিন" },
        tests: [
          {
            name: { en: "Complete blood count (CBC)", bn: "কমপ্লিট ব্লাড কাউন্ট (CBC)" },
            about: { en: "Haemoglobin, blood cells and platelets", bn: "হিমোগ্লোবিন, রক্তকণিকা ও প্লেটলেট" },
          },
          {
            name: { en: "Iron studies", bn: "আয়রন প্রোফাইল" },
            about: { en: "Iron levels, to check for anaemia", bn: "রক্তাল্পতা আছে কি না, আয়রনের মাত্রা" },
          },
          {
            name: { en: "Vitamin D", bn: "ভিটামিন ডি" },
            about: { en: "Important for bones and muscles", bn: "হাড় ও পেশির জন্য দরকারি" },
          },
          {
            name: { en: "Vitamin B12", bn: "ভিটামিন বি১২" },
            about: { en: "Important for nerves and blood", bn: "স্নায়ু ও রক্তের জন্য দরকারি" },
          },
        ],
      },
    ],
  },
};
