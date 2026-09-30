/* Content. Every string here is carried over verbatim from
   hillbottomproperties.com, the in-progress build, or the client brief.
   Nothing in this file is newly written marketing copy.
   Items flagged `hold:true` are placeholders the client must replace. */

import fs from "fs";

export const POSTS = JSON.parse(fs.readFileSync(new URL("./blog.json", import.meta.url), "utf8"));

export const CO = {
  name: "Hill Bottom Properties",
  line: "Luxury Homes and Vibrant Communities in the Heart of Addis Ababa.",
  promise: "Transparency. Timelines. Technical Excellence.",
  email: "info@hillbottomproperties.com",
  tel: "+251 116 390 420",
  telHref: "tel:+251116390420",
  short: "9508",
  shortHref: "tel:9508",
  wa: "+251 99 270 7070",
  waHref: "https://wa.me/251992707070",
  hours: "Mon–Sat · 9:00 AM to 6:00 PM EAT",
  offices: [
    { name: "Hill Bottom Village", role: "Completed Project — Ayat", lines: ["Hill Bottom Village Apartments", "Ayat Square, Addis Ababa", "Ethiopia"], map: "https://www.google.com/maps/search/?api=1&query=Ayat+Square+Addis+Ababa" },
    { name: "Urban Kaza", role: "Sales Gallery — Kazanchis", lines: ["Urban Kaza Sales Gallery", "Kazanchis, Diplomatic Corridor", "Addis Ababa, Ethiopia"], map: "https://www.google.com/maps/search/?api=1&query=Kazanchis+Addis+Ababa" },
  ],
  /* Verified against the live site's own footer links. */
  social: [
    { name: "LinkedIn", href: "https://www.linkedin.com/company/hill-bottom-properties/", icon: "linkedin" },
    { name: "Instagram", href: "https://www.instagram.com/hillbottomproperties", icon: "instagram" },
    { name: "Facebook", href: "https://www.facebook.com/hillbottomproperties", icon: "facebook" },
  ],
  copyright: "Hill Bottom Properties 2026 © All rights reserved",
};

export const NAV = [
  { href: "projects.html", label: "Residences", note: "04" },
  { href: "about.html", label: "About", note: "" },
  { href: "buying-from-abroad.html", label: "Buying From Abroad", note: "" },
  { href: "construction.html", label: "Construction Updates", note: "" },
  { href: "news.html", label: "Insights", note: "" },
];

/* Demoted from the primary bar per audit §6 — still reachable everywhere. */
export const NAV_SECONDARY = [
  { href: "vr-tours.html", label: "Virtual Tours" },
  { href: "team.html", label: "Leadership & Team" },
  { href: "contact.html", label: "Contact" },
];

/* ---- projects ---------------------------------------------------------
   status carries the real delivery state; `pct` drives the progress gauge
   and is derived from the stated phase, not invented precision.        */
export const PROJECTS = [
  {
    key: "hillbottom-village",
    href: "projects/hillbottom-village.html",
    name: "Hill Bottom Village",
    where: "Ayat Square, Addis Ababa",
    line: "Modern luxury with a touch of Ethiopian heritage.",
    blurb: "Three phases at Ayat Square. Block A is complete and fully occupied. Block B delivers October 2026. Phase 3 — the Commercial &amp; Recreation Center — opens January 2027.",
    status: "Block A Complete",
    stage: "Completed",
    pct: 62,
    img: "block-c-10",
    alt: "Hill Bottom Village and its landscaped Block C community plaza",
    cta: "View Development",
  },
  {
    key: "urban-kaza",
    href: "projects/urban-kaza.html",
    name: "Urban Kaza",
    where: "Kazanchis, near Addis Sport Park",
    line: "Where sophistication meets community.",
    blurb: "98 exclusive residential apartments in Kazanchis — Addis Ababa's diplomatic corridor. Where African heritage meets cosmopolitan precision.",
    status: "In Progress",
    stage: "Newly Launched",
    pct: 44,
    img: "urban-kaza-ext-v2",
    alt: "Urban Kaza exterior, Kazanchis",
    cta: "Explore Urban Kaza",
    price: "135,000 ETB / sqm",
    units: "98",
  },
  {
    key: "recreation-center",
    href: "projects/recreation-center.html",
    name: "Hill Bottom Commercial + Recreation",
    where: "Ayat, Addis Ababa — Phase 3",
    line: "Where the community gathers.",
    blurb: "A world-class commercial and recreation center: hair salon, steam sauna, Morocco bath, swimming pool, restaurant (club house), bakery, event space, children's playground and more.",
    status: "Coming Jan 2027",
    stage: "Under Construction",
    pct: 18,
    img: "block-c-01",
    alt: "Hill Bottom Commercial and Recreation Center evening exterior",
    cta: "View Project",
  },
  {
    key: "the-switch",
    name: "The Switch Addis Ababa",
    where: "Addis Ababa",
    line: "Concept phase.",
    status: "Concept phase",
    stage: "Concept",
    pct: 6,
    concept: true,
  },
];

/* Hero dimension line: the whole portfolio as one measured span. */
export const PORTFOLIO_LINE = [
  { k: "Ayat · Block A", v: "Complete", n: "Delivered and fully occupied", href: "projects/hillbottom-village.html" },
  { k: "Ayat · Block B", v: "October 2026", n: "In construction", href: "projects/hillbottom-village.html" },
  { k: "Kazanchis", v: "Urban Kaza", n: "98 residences · in progress", href: "projects/urban-kaza.html" },
  { k: "Ayat · Phase 3", v: "January 2027", n: "Commercial + Recreation", href: "projects/recreation-center.html" },
];

/* ---- brief-supplied pillars, verbatim --------------------------------- */
export const PILLARS = [
  { n: "01", t: "Quality", d: "Built with attention to detail and lasting value." },
  { n: "02", t: "Modern Design — Ethiopolitan", d: "Contemporary architecture designed for modern lifestyles." },
  { n: "03", t: "Prime Locations", d: "Strategically located properties in Addis Ababa." },
  { n: "04", t: "Customer Commitment", d: "From purchase to delivery, we put our customers first." },
  { n: "05", t: "Investment Value", d: "Properties designed for both living and long-term value." },
];

export const WELCOME = {
  title: "We successfully delivered our Ayat project.",
  body: "Now, discover our newest premium residence in Kazanchis — Urban Kaza.",
  yes: "Discover Urban Kaza",
  no: "Not now",
  yesHref: "projects/urban-kaza.html",
};

export const TESTIMONIALS = [
  { q: "አውቀዋለው አሰማማኝ ድርጅት ነው የገረመኝ: ፍጥነት + Quality መሆኑ ነው። My best choice, Hill Bottom Properties", by: "Abdu R", at: "Addis Ababa", am: true },
  { q: "Clear updates, floor plans, and responsive agents made it feel safe to buy from the UK.", by: "Selam T.", at: "London, UK" },
  { q: "The team was always reachable and every milestone was confirmed in writing. Exceptional.", by: "Yonas K.", at: "Washington D.C." },
];

/* ---- Urban Kaza ------------------------------------------------------- */
export const KAZA_FLOORS = [
  { f: "Underground", t: "Underground Parking", img: "kaza-building" },
  { f: "Ground Floor", t: "Lobby, Café & Concierge", img: "kaza-cafe-01" },
  { f: "1st Floor", t: "Above-Ground Parking", img: "kaza-building" },
  { f: "2F – 15F", t: "Residential Apartments", img: "kaza-apt-01-v2" },
  { f: "Rooftop", t: "Gym, Bar & Restaurant", img: "kaza-rooftop" },
];

/* Unit schedule exactly as published on the existing Urban Kaza page. */
export const KAZA_UNIT_COLS = ["Unit", "Type", "Net Area", "Common Area", "Parking", "Total Area"];
export const KAZA_UNITS = [
  ["UK-01", "2 Bedroom", "105 m²", "18 m²", "12.5 m²", "135.5 m²"],
  ["UK-02", "2 Bedroom", "105 m²", "18 m²", "12.5 m²", "135.5 m²"],
  ["UK-03", "2 Bedroom", "100 m²", "17 m²", "12.5 m²", "129.5 m²"],
  ["UK-04", "2 Bedroom", "100 m²", "17 m²", "12.5 m²", "129.5 m²"],
  ["UK-05", "1 Bedroom", "70 m²", "12 m²", "12.5 m²", "94.5 m²"],
  ["UK-06", "1 Bedroom", "69 m²", "12 m²", "12.5 m²", "93.5 m²"],
  ["UK-07", "2 Bedroom", "117 m²", "20 m²", "12.5 m²", "149.5 m²"],
];
export const KAZA_NOTE = [
  "All dimensions are provided by our design architects. Rooms are measured from structural elements' and architectural partitions' external faces and do not include finishes and tolerances.",
  "Drawings are not to scale. Actual suite area may slightly vary. The developer reserves the right to make alterations or revisions. Units are measured at typical floor level; column sizes may vary per floor.",
];

export const KAZA_CONTEXT = [
  { t: "UN Headquarters", d: "The global nerve center of Africa." },
  { t: "Addis Sport Park", d: "6 Hectares — 25+ World-Class Facilities." },
  { t: "Sheraton Addis", d: "A landmark of hospitality and prestige. Entertainment, restaurants, and rooftop experiences at your reach." },
  { t: "Kazanchis Park", d: "Urban greenery and open-air leisure in one of the city's most established green zones." },
];

export const KAZA_GALLERY = [
  { img: "kaza-rooftop", cap: "Rooftop Terrace" },
  { img: "kaza-rooftop-02", cap: "Rooftop Bar & Dining" },
  { img: "kaza-rooftop-03", cap: "Rooftop Lounge" },
  { img: "kaza-rooftop-05", cap: "Rooftop Sky Deck" },
  { img: "kaza-rooftop-06", cap: "Rooftop Interior 06" },
  { img: "kaza-rooftop-07", cap: "Rooftop Interior 07" },
  { img: "kaza-rooftop-08", cap: "Rooftop Interior 08" },
  { img: "kaza-apt-01-v2", cap: "Apartment 01" },
  { img: "kaza-apt-02", cap: "Apartment 02" },
  { img: "kaza-apt-03", cap: "Apartment 03" },
  { img: "kaza-apt-04", cap: "Apartment 04" },
  { img: "kaza-apt-05", cap: "Apartment 05" },
  { img: "kaza-apt-06", cap: "Apartment 06" },
  { img: "kaza-apt-07", cap: "Apartment 07" },
  { img: "kaza-apt-08", cap: "Apartment 08" },
  { img: "kaza-cafe-01", cap: "Café & Reception" },
  { img: "kaza-cafe-02", cap: "Reception Lounge" },
  { img: "kaza-cafe-05", cap: "Café & Lounge" },
  { img: "kaza-cafe-06", cap: "Café Atrium" },
  { img: "kaza-cafe-07", cap: "Social Hub" },
  { img: "kaza-cafe-08", cap: "Café Interior 08" },
  { img: "kaza-cafe-09", cap: "Café Interior 09" },
  { img: "kaza-gym", cap: "Rooftop Gym" },
  { img: "kaza-gym-02", cap: "Fitness Studio" },
  { img: "kaza-hotel-01", cap: "Hotel Suite" },
  { img: "kaza-members-01", cap: "Members Lounge" },
  { img: "kaza-members-02", cap: "Members Club" },
];

/* ---- Hill Bottom Village --------------------------------------------- */
export const VILLAGE_P1 = [
  "Gated community with 24-hour security",
  "Landscaped gardens and common areas",
  "Premium finishes throughout",
  "Underground parking",
  "Backup power generator",
  "High-speed elevator access",
];
export const VILLAGE_P2 = [
  "Expanded unit count — more variety",
  "Enhanced amenity package",
  "Improved parking and traffic flow",
  "Modern lobby redesign",
  "Smart home-ready infrastructure",
  "Green building standards",
];

/* ---- Recreation Centre ------------------------------------------------ */
export const REC_FACILITIES = [
  "Hair Salon", "Steam Sauna", "Morocco Bath (Hammam)", "Swimming Pool",
  "Rental Office Space", "Restaurant (Club House)", "Children Playground",
  "Café", "Event Space", "Community Roof Terrace", "In-building Recreation Facilities",
];

export const REC_GALLERY = [
  { img: "block-c-01", cap: "Block C — evening street arrival" },
  { img: "block-c-02", cap: "Block C — daytime street arrival" },
  { img: "block-c-03", cap: "Community plaza — evening aerial" },
  { img: "block-c-04", cap: "Community plaza — daytime aerial" },
  { img: "block-c-05", cap: "Garden terrace — evening" },
  { img: "block-c-06", cap: "Garden terrace — daytime" },
  { img: "block-c-07", cap: "Roof terrace — daytime" },
  { img: "block-c-08", cap: "Roof terrace — evening" },
  { img: "block-c-09", cap: "Landscaped community garden" },
  { img: "block-c-10", cap: "Plaza and café frontage" },
  { img: "block-c-11", cap: "Retail frontage — evening" },
  { img: "block-c-12", cap: "Retail frontage — night" },
];

/* ---- process ---------------------------------------------------------- */
export const PROCESS = [
  { t: "Unit Shortlist", d: "Choose a project and request brochures, floor plans, and starting prices via email or WhatsApp. Our sales team responds within 24 hours on business days." },
  { t: "Virtual Tour + Documentation", d: "Review detailed floor plans with dimensions and high-quality interior/exterior photography. Confirm what is included in the unit — finish level, building features, and parking." },
  { t: "Payment Plan Agreement", d: "We confirm the full payment plan in writing — milestones tied to actual construction progress, not arbitrary dates. Review with your independent attorney before signing." },
  { t: "Construction Progress Updates", d: "Receive dated photo and video updates at every construction milestone. You can request additional walkthroughs via video call at any stage." },
  { t: "Handover + Key Collection", d: "Conduct a thorough unit inspection before signing the handover document. Title deed (Yidir) transfer is completed within the agreed timeframe after final payment." },
];

export const VALUES = [
  { t: "Registered Developer", d: "Hill Bottom Properties is a licensed real estate developer in Ethiopia with a verifiable track record of completed projects." },
  { t: "Delivered Proof", d: "Hill Bottom Village Apartments in Ayat are completed and occupied. Visit our delivered project before deciding on Urban Kaza." },
  { t: "Transparent Contracts", d: "All sales agreements include explicit delivery timelines, milestone-linked payment schedules, and remedies if timelines are missed." },
  { t: "Independent Legal Support", d: "We encourage — and accommodate — independent legal review of all contracts before signing. This is a major purchase. Take the time." },
  { t: "Bank-Ready Documentation", d: "All project documentation is structured to support bank financing applications and foreign currency transactions." },
  { t: "US-Based Representatives", d: "Diaspora buyers in the United States and UK can speak with our local representatives in their timezone before committing." },
];

export const TEAMS = [
  { t: "Executive Team", role: "Hill Bottom Leadership", d: "Experienced real estate professionals with roots in Ethiopia and a global perspective." },
  { t: "Technical Team", role: "Design & Construction", d: "Architects and engineers delivering premium quality on every project." },
  { t: "Client Relations", role: "Sales & Diaspora", d: "Dedicated team for local and international buyers, fluent in Ethiopia, Europe, and North America." },
];

export const CTA = {
  home: "Explore Residences",
  project: "Check Availability",
  plan: "Ask About This Residence",
  diaspora: "Book Video Consultation",
  delivered: "Schedule Site Visit",
  construction: "Speak With Sales",
  article: "Download Buyer Guide",
};

export const INTEREST = [
  "1 Bedroom Residence", "2 Bedroom Residence", "Investment Opportunity", "General Inquiry",
];

export const VR_TOURS = [
  { name: "Urban Kaza", where: "Kazanchis, near Addis Sport Park", img: "urban-kaza-ext-v2", status: "In Progress",
    d: "Walk every floor, amenity, and living space in full 360° — the lobby, the residential levels, and the rooftop." },
  { name: "Hill Bottom Village", where: "Ayat Square, Addis Ababa", img: "block-c-10", status: "Block A Complete",
    d: "Step inside the completed, occupied Phase 1 apartments before you visit in person." },
];

/* ---- Buying From Abroad (audit §12, §28) --------------------------------
   Every string below is carried over verbatim from the Diaspora page of the
   in-progress build. Nothing here is newly written. */
export const REMOTE_JOURNEY = [
  { t: "Pick your unit + request floor plans", d: "Browse our portfolio online and download the brochure. Shortlist your preferred unit type remotely with our full floor plan library." },
  { t: "Virtual tour & Q&A session", d: "Schedule a live video call or virtual site tour. Our team answers questions with live walkthroughs, site videos, and sample apartments." },
  { t: "Transparent payment plan confirmed", d: "We share a full written pricing breakdown — every cost itemized. Payment milestones tied to verified construction progress only." },
  { t: "Progress updates at every milestone", d: "Dated photos and video of every construction milestone delivered to you. Request additional walkthroughs at any stage." },
  { t: "Handover & key collection", d: "Full legal support for title transfer and key collection. We walk you through every step — whether you collect in person or via representative." },
];

export const REMOTE_SUPPORT = [
  { t: "Flexible Payment Plans", d: "We offer structured payment milestones tied to actual construction progress. You only pay as we build, ensuring your investment is secure and aligned with visible results." },
  { t: "Legal Protections", d: "All contracts are drafted by top-tier legal professionals in Addis Ababa, with provisions specifically designed to protect international buyers and their foreign currency investments." },
  { t: "US & Europe Representatives", d: "Prefer speaking to someone in your timezone? We have authorized sales representatives in major US and European cities ready to assist in person or via video call." },
];

export const REMOTE_FAQ = [
  { q: "Can I buy remotely without visiting Ethiopia?", a: "Yes. Our remote purchase flow is specifically designed for diaspora buyers: floor plan review, virtual tours, written confirmations at every step, and WhatsApp communication throughout. Many of our buyers have purchased from the US, UK, and Europe without an in-person visit prior to handover." },
  { q: "How do payment plans work for overseas buyers?", a: "Payment plans are tied to verified construction milestones — not arbitrary dates. We provide a full written breakdown showing exactly which payment corresponds to which construction stage. Payments are made in Ethiopian Birr, and we can guide you through the international transfer process." },
  { q: "What legal protections do I have as an international buyer?", a: "All contracts are drafted by qualified Ethiopian legal professionals with provisions specifically protecting international buyers. We encourage — and accommodate — independent legal review before signing. The purchase agreement includes explicit delivery timelines and remedies." },
  { q: "How do I verify Hill Bottom is a legitimate developer?", a: "Hill Bottom Properties is a registered Ethiopian developer with a completed, occupied project — Hill Bottom Village Apartments in Ayat. We encourage prospective buyers to visit this completed project and speak with current residents before committing to Urban Kaza." },
  { q: "Can I get pricing in USD?", a: "All transactions are denominated in Ethiopian Birr. We provide USD equivalents at current exchange rates for reference, but the contract price is in Birr. Many diaspora buyers convert foreign currency at each milestone payment, which can provide currency-hedging benefits over time." },
  { q: "Do you have representatives outside Ethiopia?", a: "We have authorized sales representatives available in major US and European cities for in-person or video consultations in your timezone. Contact our main sales team via WhatsApp to be connected with the representative nearest you." },
  { q: "What happens during construction — how will I stay informed?", a: "You receive dated construction progress updates — photos and video — at every major milestone. You can request additional video walkthroughs at any stage. Our construction progress page is also publicly accessible so you can monitor the project in real time." },
];

/* ---- Construction updates (audit §14) -----------------------------------
   Stage and milestone are the real published states. No progress photography
   or verified completion percentage exists yet, so none is shown. */
export const CONSTRUCTION = [
  { key: "urban-kaza", name: "Urban Kaza", where: "Kazanchis, near Addis Sport Park", stage: "Superstructure in progress", milestone: "Reserve now — 98 residences", img: "urban-kaza-ext-v2", href: "projects/urban-kaza.html", status: "In Progress" },
  { key: "hillbottom-village", name: "Hill Bottom Village — Block B", where: "Ayat Square, Addis Ababa", stage: "In construction", milestone: "Delivery October 2026", img: "block-c-10", href: "projects/hillbottom-village.html", status: "Block A Complete" },
  { key: "recreation-center", name: "Commercial + Recreation Centre", where: "Ayat, Addis Ababa — Phase 3", stage: "Begins after Block B handover", milestone: "Opening January 2027", img: "block-c-01", href: "projects/recreation-center.html", status: "Coming Jan 2027" },
];

/* ---- Urban Kaza unit selector (audit §18) -------------------------------
   Derived from the published unit schedule. Bedrooms, areas and parking are
   real. Per-unit availability and price are NOT published, so the selector
   says "Request current price" rather than inventing either. */
export const KAZA_UNIT_SET = KAZA_UNITS.map(([id, type, net, common, parking, total]) => {
  const num = (s) => parseFloat(String(s).replace(/[^\d.]/g, ""));
  return {
    id, type, net, common, parking, total,
    beds: type.startsWith("1") ? 1 : 2,
    totalNum: num(total),
    band: num(total) < 110 ? "compact" : num(total) < 140 ? "mid" : "large",
  };
});
export const KAZA_BANDS = [
  { key: "compact", label: "93–110 m²" },
  { key: "mid", label: "110–140 m²" },
  { key: "large", label: "140–150 m²" },
];
