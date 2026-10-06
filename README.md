# TrainingAndPlacements — Editorial Recruitment & Placement Platform

A production-grade recruitment and corporate placement platform connecting ambitious candidates, technical training pipelines, and direct hiring drives with Tier-1 MNCs and US Healthcare ITES employers.

> **Content Reference**: Built using real hiring drives, interview pipelines, verified candidates, and recruiter desk information from Hyderabad, Telangana. Re-engineered into an original, high-performance, editorial aesthetic.

---

## ✦ Key Highlights & Features

- **Apple-Level Simplicity & Editorial Aesthetics**: Clean typographic hierarchy, generous whitespace, thin borders, subtle micro-interactions, and zero generic boilerplate elements.
- **23+ Verified Client Drives**: Real drives from Capgemini, Cognizant, Teleperformance, Wipro, Tech Mahindra, Deloitte, Virtusa, R1 RCM, IKS Health, Ascent, and WNS Global.
- **Dynamic Job Board & Multi-Criteria Filtering**: Instant client-side search across role title, company, skills, work mode, and experience with sorting (Salary High/Low, Newest, Company A-Z).
- **Dynamic JobPosting SEO Schema**: Automatic injection of Schema.org `JobPosting` and `Organization` JSON-LD data for Google Jobs crawling.
- **Lenis Smooth Scroll + GSAP ScrollTrigger**: Integrated smooth inertial scrolling with GSAP ScrollTrigger animations, with full `prefers-reduced-motion` compliance.
- **Desktop Custom Cursor & Scroll Progress**: Subtle, non-intrusive interactive cursor with contextual badges (`VIEW`, `APPLY`, `EXPLORE`) and a minimalist top scroll progress indicator.
- **100% Data-Driven Architecture**: Easily update jobs, companies, testimonials, categories, and site contact details without touching component JSX.
- **Backend-Ready Contact Service**: Dedicated `contactService.js` supporting immediate REST API / Supabase / Express integration via environment variables.

---

## 🛠 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Animation**: [GSAP 3](https://greensock.com/gsap/) + [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Micro-Interactions & Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
trainingandplacements/
│
├── public/
│   ├── favicon.svg              # Custom brand SVG favicon
│   └── robots.txt               # SEO search engine bot instructions
│
├── src/
│   ├── components/
│   │   ├── CareerCategories/    # Bento grid for hiring streams
│   │   ├── ContactForm/         # Validated form with status handling
│   │   ├── CustomCursor/        # Accessibility-aware cursor dot & pill
│   │   ├── FeaturedJobs/        # Curated horizontal scroll section
│   │   ├── Footer/              # Premium dark editorial footer & watermark
│   │   ├── Hero/                # Editorial full-height hero section
│   │   ├── HiringPartners/      # Verified Tier-1 MNC grid
│   │   ├── HowItWorks/          # 5-Step interactive placement timeline
│   │   ├── JobCard/             # Modular job cards with tags & quick apply
│   │   ├── JobFilters/          # Search, category pills, & select filters
│   │   ├── Marquee/             # Infinite looping career marquee
│   │   ├── MobileMenu/          # Fullscreen mobile navigation drawer
│   │   ├── Navbar/              # Sticky header with blurred backdrop transition
│   │   ├── PageTransition/      # Smooth Framer Motion page wrapper
│   │   ├── RecruiterCTA/        # B2B staffing & corporate recruiter banner
│   │   ├── ScrollProgress/      # Minimal progress bar at viewport top
│   │   ├── ScrollToTop.jsx      # Route transition scroll reset
│   │   ├── Stats/               # Editorial numbers with GSAP counter
│   │   ├── Testimonials/        # Real placed candidate reviews
│   │   └── WhyChooseUs/         # Interactive value proposition cards
│   │
│   ├── data/
│   │   ├── categories.js        # Career categories & discipline tracks
│   │   ├── companies.js         # Verified MNC partners & sector info
│   │   ├── jobs.js              # 23+ Real active client drives data
│   │   ├── siteContent.js       # Brand, founder, hotline, copy & stats
│   │   └── testimonials.js      # Placed candidates feedback data
│   │
│   ├── hooks/
│   │   ├── useJobFilters.js     # Filter, search, and sort logic
│   │   ├── useLenis.js          # Lenis smooth scroll + GSAP integration
│   │   └── useScrollReveal.js   # GSAP ScrollTrigger intersection reveal
│   │
│   ├── pages/
│   │   ├── About.jsx            # Founder profile, mission & ecosystem
│   │   ├── Contact.jsx          # Contact desk, location & inquiry form
│   │   ├── Home.jsx             # Comprehensive long-form homepage
│   │   ├── JobDetails.jsx       # Dynamic job page (/jobs/:id) with JSON-LD
│   │   ├── Jobs.jsx             # Dedicated searchable job board
│   │   └── NotFound.jsx         # 404 page
│   │
│   ├── services/
│   │   └── contactService.js    # API service abstraction for inquiries
│   │
│   ├── utils/
│   │   └── helpers.js           # Utility helpers (cn, formatDate, slugify)
│   │
│   ├── App.jsx                  # Main router & layout shell
│   ├── index.css                # Global styles, variables, typography & Lenis CSS
│   └── main.jsx                 # React root mount
│
├── index.html                   # HTML entry with Organization Schema
├── package.json                 # Dependencies & scripts
├── tailwind.config.js           # Design system configuration
├── vite.config.js               # Vite build & manual code-splitting chunks
└── README.md                    # Documentation
```

---

## 🚀 Getting Started

### 1. Installation

Ensure you have [Node.js](https://nodejs.org/) (v18 or later) installed:

```bash
cd trainingandplacements
npm install
```

### 2. Development Server

Start Vite local development server on `http://localhost:3000`:

```bash
npm run dev
```

### 3. Production Build

Build optimized minified production assets with code splitting:

```bash
npm run build
```

### 4. Production Preview

Preview the built production distribution locally:

```bash
npm run preview
```

---

## ⚡ Supabase PostgreSQL Architecture & Admin Portal

Instead of maintaining separate static job files and backend jobs, the platform connects directly to **Supabase PostgreSQL**:

```text
Admin Portal (/admin)
        ↓
Supabase PostgreSQL (`jobs` table)
        ↓
React Frontend (Real-time live drives & filters)
```



### Recruiter Admin Panel (`/admin`)
- Accessible at `/admin` (also linked in Navbar and Footer).
- **Live Database Status**: Tests connectivity to `sbwantnhvsiylfnmayfb.supabase.co`.
- **1-Click Sync / Seeding**: Push all 23+ verified reference hiring drives to PostgreSQL with one click.
- **Publish New Drives**: Complete modal form with skills, package, eligibility, and WhatsApp recruiter routing.
- **Edit & Delete**: Manage live postings with instant reflection on `/jobs` and `/jobs/:id`.
- **SQL Schema Generator**: View and copy the full `jobs` table definition and RLS policies (`supabase_schema.sql`).

---

## 📝 Managing Content & Data

All content is separated into clean, modular JavaScript data files in `src/data/`:

### 1. Adding or Editing Jobs
Edit `src/data/jobs.js`:
```javascript
{
  id: "TR1025",
  company: "New Company",
  companyCategory: "Tier-1 IT Giant",
  title: "Cloud Infrastructure Engineer",
  category: "IT & Engineering",
  location: "Hyderabad",
  workMode: "Hybrid",
  experience: "Freshers (2025 / 2026 Batch)",
  salary: "₹6.00 LPA",
  salaryMin: 600000,
  salaryMax: 600000,
  featured: true,
  shifts: "Day Shifts (5 Days)",
  processType: "Virtual Assessment",
  description: "Description of the role...",
  skills: ["AWS", "Linux", "Docker"],
  eligibility: ["BE / B.Tech CSE / IT"],
  responsibilities: ["Develop and automate cloud systems..."],
  applyUrl: "https://wa.me/918309740722?text=Application",
  postedDate: "2026-10-06"
}
```

### 2. Adding Hiring Partners
Edit `src/data/companies.js`:
```javascript
{
  name: "New Partner",
  sector: "Cloud & AI",
  type: "Tier-1 Enterprise",
  openings: 2,
  logoText: "NewPartner",
  gradient: "from-blue-600 to-indigo-700"
}
```

### 3. Adding Real Candidate Testimonials
Edit `src/data/testimonials.js`:
```javascript
{
  id: 5,
  name: "Candidate Name",
  role: "Candidate – Placed Candidate",
  category: "IT PLACEMENT",
  email: "candidate@example.com",
  quote: "Personalized mentorship helped me crack the client interview on the first attempt.",
  rating: 5,
  location: "Hyderabad",
  batch: "2024"
}
```

### 4. Updating Branding, Phone, WhatsApp, or Founder Information
Edit `src/data/siteContent.js`:
```javascript
export const SITE_CONFIG = {
  brandName: "TrainingAndPlacements",
  founder: "Sandru Anudeep",
  founderTitle: "Founder & CEO",
  directLine: "+91 8309740722",
  whatsappUrl: "https://wa.me/918309740722",
  officeLocation: "Hyderabad, Telangana, India",
  // ...
};
```

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the framework preset to **Vite**.
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. Click **Deploy**.

For single-page application routing on static hosts, ensure client-side routing rewrites are configured (e.g. `vercel.json`):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🛡️ License & Copyright

© 2026 **TrainingAndPlacements**. All rights reserved.
Developed for professional corporate recruitment and placement operations.
# trainingandplacements
