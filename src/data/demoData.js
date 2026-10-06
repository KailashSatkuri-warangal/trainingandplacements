/**
 * COMPREHENSIVE DEMO DATASET - ALL POSSIBLE CASES & WORKFLOWS
 * Includes:
 * 1. Hiring Drives: All statuses (PUBLISHED, DRAFT, CLOSED, ARCHIVED), featured/standard, all work modes, experience brackets, and categories.
 * 2. Applications: All pipeline stages (APPLIED, REVIEWING, SHORTLISTED, REJECTED, PLACED).
 * 3. Enquiries: All sender types (CANDIDATE, RECRUITER, EMPLOYER, GENERAL) & statuses (NEW, CONTACTED, RESOLVED, ARCHIVED).
 * 4. Companies: Active and inactive across IT, Healthcare, BPO, Operations.
 * 5. Categories: All career streams with live counts.
 * 6. Testimonials: Published & draft reviews with ratings 3, 4, 5 stars.
 */

export const DEMO_COMPANIES = [
  {
    id: "comp-1",
    name: "Cognizant",
    slug: "cognizant",
    logo_url: "/images/companies/cognizant.svg",
    description: "Global enterprise IT services and digital transformation multinational.",
    website: "https://www.cognizant.com",
    industry: "Information Technology & Consulting",
    location: "Hyderabad, Telangana",
    is_active: true,
    created_at: "2026-09-01T10:00:00Z"
  },
  {
    id: "comp-2",
    name: "Teleperformance",
    slug: "teleperformance",
    logo_url: "/images/companies/teleperformance.svg",
    description: "Global leader in digital business services and outsourced customer experience management.",
    website: "https://www.teleperformance.com",
    industry: "BPO & Customer Experience",
    location: "Hyderabad & Pan-India",
    is_active: true,
    created_at: "2026-09-02T10:00:00Z"
  },
  {
    id: "comp-3",
    name: "R1 RCM",
    slug: "r1-rcm",
    logo_url: "/images/companies/r1rcm.svg",
    description: "Leading technology-enabled revenue cycle partner for US hospital systems and healthcare providers.",
    website: "https://www.r1rcm.com",
    industry: "US Healthcare Revenue Cycle (RCM)",
    location: "Hyderabad (Hitec City)",
    is_active: true,
    created_at: "2026-09-03T10:00:00Z"
  },
  {
    id: "comp-4",
    name: "Capgemini",
    slug: "capgemini",
    logo_url: "/images/companies/capgemini.svg",
    description: "Global consulting, technology services, and digital engineering conglomerate.",
    website: "https://www.capgemini.com",
    industry: "IT & Digital Engineering",
    location: "Hyderabad (Gachibowli)",
    is_active: true,
    created_at: "2026-09-04T10:00:00Z"
  },
  {
    id: "comp-5",
    name: "Tech Mahindra",
    slug: "tech-mahindra",
    logo_url: "/images/companies/techmahindra.svg",
    description: "Provider of digital transformation, consulting, and business re-engineering solutions.",
    website: "https://www.techmahindra.com",
    industry: "Telecom & Enterprise ITES",
    location: "Hyderabad (Madhapur)",
    is_active: true,
    created_at: "2026-09-05T10:00:00Z"
  },
  {
    id: "comp-6",
    name: "Concentrix",
    slug: "concentrix",
    logo_url: "/images/companies/concentrix.svg",
    description: "Global customer engagement, workflow intelligence, and technology solutions company.",
    website: "https://www.concentrix.com",
    industry: "Customer Operations & FinTech",
    location: "Hyderabad (Kondapur)",
    is_active: true,
    created_at: "2026-09-06T10:00:00Z"
  },
  {
    id: "comp-7",
    name: "Deloitte India",
    slug: "deloitte-india",
    logo_url: "/images/companies/deloitte.svg",
    description: "Audit, consulting, tax, and advisory services multinational.",
    website: "https://www2.deloitte.com",
    industry: "Advisory & Risk Advisory",
    location: "Hyderabad (Hitec City)",
    is_active: true,
    created_at: "2026-09-07T10:00:00Z"
  },
  {
    id: "comp-8",
    name: "Legacy Solutions Partner",
    slug: "legacy-solutions",
    logo_url: "/images/companies/legacy.svg",
    description: "Archived partner from Q1 2025 recruitment cycle.",
    website: "https://example.com",
    industry: "Legacy BPO",
    location: "Secunderabad",
    is_active: false,
    created_at: "2026-01-15T10:00:00Z"
  }
];

export const DEMO_CATEGORIES = [
  {
    id: "cat-1",
    name: "BPO / Customer Support",
    slug: "bpo-customer-support",
    description: "Voice, Semi-Voice, and Non-Voice Customer Relationship processes for Fortune 500 tech clients.",
    is_active: true,
    created_at: "2026-09-01T10:00:00Z"
  },
  {
    id: "cat-2",
    name: "Healthcare / Medical Billing",
    slug: "healthcare-medical-billing",
    description: "Recession-proof US healthcare revenue cycle management, AR callers, and insurance claim processing.",
    is_active: true,
    created_at: "2026-09-02T10:00:00Z"
  },
  {
    id: "cat-3",
    name: "IT / Software Development",
    slug: "it-software-development",
    description: "Core full-stack development, QA test automation, Guidewire systems, and enterprise cloud engineering.",
    is_active: true,
    created_at: "2026-09-03T10:00:00Z"
  },
  {
    id: "cat-4",
    name: "Operations & Core Services",
    slug: "operations-core-services",
    description: "Financial transactions, enterprise ticketing, HR operations, and digital mapping validation.",
    is_active: true,
    created_at: "2026-09-04T10:00:00Z"
  }
];

export const DEMO_DRIVES = [
  // 1. PUBLISHED + FEATURED + Freshers + Work From Office (IT)
  {
    id: "drive-1",
    title: "Associate Software Engineer – 2025/2026 Batch",
    slug: "associate-software-engineer-cognizant-2025-2026",
    company_id: "comp-1",
    company: DEMO_COMPANIES[0],
    category_id: "cat-3",
    category: DEMO_CATEGORIES[2],
    location: "Hyderabad (Gachibowli)",
    work_mode: "Work From Office",
    experience: "Freshers (2024 / 2025 / 2026 Batch)",
    salary_text: "₹4.50 LPA - ₹5.50 LPA",
    salary_min: 450000,
    salary_max: 550000,
    shifts: "Standard Day Shift (Mon - Fri, 5 Days Working)",
    process_type: "Online Aptitude + Technical Coding Round + HR Evaluation",
    skills: ["Java", "Spring Boot", "SQL", "Data Structures", "Problem Solving"],
    eligibility: [
      "B.Tech / B.E (CSE, IT, ECE, EEE) or MCA graduates.",
      "Minimum 60% aggregate across 10th, 12th, and Graduation.",
      "No active backlogs at the time of final onboarding."
    ],
    responsibilities: [
      "Develop and maintain enterprise software modules under senior architect guidance.",
      "Participate in code reviews, unit testing, and agile sprint planning.",
      "Collaborate with multinational delivery teams to ship client enhancements."
    ],
    description: "Cognizant is conducting direct campus-to-corporate hiring drives in Hyderabad. Shortlisted candidates receive dedicated 1-on-1 interview mentoring through our Contact Team to prepare for the technical coding panel.",
    status: "PUBLISHED",
    featured: true,
    views: 342,
    posted_at: "2026-10-04T09:00:00Z",
    created_at: "2026-10-04T09:00:00Z"
  },

  // 2. PUBLISHED + FEATURED + US Healthcare + Hybrid
  {
    id: "drive-2",
    title: "US Healthcare AR Caller & Billing Executive",
    slug: "us-healthcare-ar-caller-r1-rcm",
    company_id: "comp-3",
    company: DEMO_COMPANIES[2],
    category_id: "cat-2",
    category: DEMO_CATEGORIES[1],
    location: "Hyderabad (Hitec City)",
    work_mode: "Hybrid",
    experience: "0 - 1 Years",
    salary_text: "₹3.80 LPA + ₹45,000 Shift Incentives",
    salary_min: 380000,
    salary_max: 425000,
    shifts: "Fixed US Night Shift (6:30 PM - 3:30 AM, Sat/Sun Off)",
    process_type: "Direct Face-to-Face Voice Assessment & Ops Panel",
    skills: ["US Healthcare", "Medical Billing", "AR Follow-up", "Denial Management", "US Dialect"],
    eligibility: [
      "Any Graduate / Post Graduate (B.Com, B.Sc, BBA, B.Tech, Pharma).",
      "Excellent verbal English fluency and analytical problem solving.",
      "Comfortable with fixed night shifts with company doorstep cab service."
    ],
    responsibilities: [
      "Contact US insurance carriers regarding unpaid, denied, or pending medical claims.",
      "Investigate denial codes, prepare claim appeals, and document payer responses.",
      "Maintain 98%+ accuracy compliance according to HIPAA privacy mandates."
    ],
    description: "R1 RCM offers high-stability careers in the recession-proof US healthcare domain. TrainingAndPlacements assists with complete mock voice clearance.",
    status: "PUBLISHED",
    featured: true,
    views: 418,
    posted_at: "2026-10-03T11:30:00Z",
    created_at: "2026-10-03T11:30:00Z"
  },

  // 3. PUBLISHED + Customer Experience + Work From Home
  {
    id: "drive-3",
    title: "International Customer Success Specialist (Remote)",
    slug: "international-customer-success-teleperformance",
    company_id: "comp-2",
    company: DEMO_COMPANIES[1],
    category_id: "cat-1",
    category: DEMO_CATEGORIES[0],
    location: "Pan-India / Remote",
    work_mode: "Work From Home",
    experience: "Freshers & Experienced",
    salary_text: "₹3.20 LPA - ₹4.00 LPA + WFH Equipment",
    salary_min: 320000,
    salary_max: 400000,
    shifts: "Rotational 24/7 Shifts (9 Hours Login, 2 Consecutive Offs)",
    process_type: "Versant Voice Assessment (Level 4+) + Operations Interview",
    skills: ["Customer Empathy", "English Fluency", "Typing (35+ WPM)", "Active Listening"],
    eligibility: [
      "10+2 / Intermediate or any undergraduate/graduate degree.",
      "Dedicated quiet home workspace with stable broadband connection.",
      "Good command over conversational English with neutral accent."
    ],
    responsibilities: [
      "Handle incoming queries and customer requests via phone and live chat.",
      "Diagnose client issues and provide first-contact resolution within target SLA.",
      "Deliver empathetic customer service representing global technology brands."
    ],
    description: "Teleperformance India is recruiting candidate batches for its premier global accounts. Company provides laptop and power backup reimbursement.",
    status: "PUBLISHED",
    featured: true,
    views: 295,
    posted_at: "2026-10-02T14:15:00Z",
    created_at: "2026-10-02T14:15:00Z"
  },

  // 4. PUBLISHED + Operations & FinTech + Experienced (1 - 3 Years)
  {
    id: "drive-4",
    title: "Financial Crime & KYC Operations Analyst",
    slug: "financial-crime-kyc-analyst-concentrix",
    company_id: "comp-6",
    company: DEMO_COMPANIES[5],
    category_id: "cat-4",
    category: DEMO_CATEGORIES[3],
    location: "Hyderabad (Kondapur)",
    work_mode: "Work From Office",
    experience: "1 - 3 Years",
    salary_text: "₹5.00 LPA - ₹6.50 LPA",
    salary_min: 500000,
    salary_max: 650000,
    shifts: "Rotational Day & Afternoon Shifts",
    process_type: "HR Screen + Domain Scenario Assessment + Manager Round",
    skills: ["AML", "KYC Compliance", "CDD / EDD", "Risk Investigation", "Excel"],
    eligibility: [
      "B.Com, BBA, MBA Finance or relevant business degrees.",
      "1 to 3 years experience in banking operations or customer due diligence.",
      "Familiarity with global sanctions lists and transaction monitoring."
    ],
    responsibilities: [
      "Review high-risk customer onboarding documentation and perform enhanced due diligence.",
      "Flag suspicious financial transactions and escalate according to compliance protocols.",
      "Draft clear case summaries for regulatory audits and senior compliance review."
    ],
    description: "Join Concentrix's banking intelligence and risk management vertical. Accelerated appraisal cycles with direct client management exposure.",
    status: "PUBLISHED",
    featured: true,
    views: 184,
    posted_at: "2026-10-01T16:00:00Z",
    created_at: "2026-10-01T16:00:00Z"
  },

  // 5. PUBLISHED + Senior IT + 3+ Years
  {
    id: "drive-5",
    title: "Senior Full Stack Cloud Engineer (React / Node / AWS)",
    slug: "senior-full-stack-cloud-capgemini",
    company_id: "comp-4",
    company: DEMO_COMPANIES[3],
    category_id: "cat-3",
    category: DEMO_CATEGORIES[2],
    location: "Hyderabad (Gachibowli)",
    work_mode: "Hybrid",
    experience: "3+ Years",
    salary_text: "₹9.50 LPA - ₹14.00 LPA",
    salary_min: 950000,
    salary_max: 1400000,
    shifts: "General Day Shift",
    process_type: "Technical System Architecture Round + Client Director Interview",
    skills: ["React", "Node.js", "AWS", "PostgreSQL", "Docker", "Microservices"],
    eligibility: [
      "Minimum 3 years demonstrable production web app experience.",
      "Strong command of modern JavaScript/TypeScript, SQL, and cloud infrastructure.",
      "Experience leading sprint deliverables and mentoring junior developers."
    ],
    responsibilities: [
      "Architect enterprise web applications and API microservices.",
      "Implement robust automated testing and CI/CD deployment pipelines on AWS.",
      "Collaborate directly with European and US business stakeholders."
    ],
    description: "Premium lateral opening at Capgemini. Offers high package hike and immediate joining bonus for eligible candidates.",
    status: "PUBLISHED",
    featured: true,
    views: 512,
    posted_at: "2026-09-28T10:00:00Z",
    created_at: "2026-09-28T10:00:00Z"
  },

  // 6. DRAFT - Pipeline preparing for next week (Admin test case)
  {
    id: "drive-6",
    title: "[DRAFT] Data Operations & Google Mapping Associate",
    slug: "draft-data-ops-google-mapping-techm",
    company_id: "comp-5",
    company: DEMO_COMPANIES[4],
    category_id: "cat-4",
    category: DEMO_CATEGORIES[3],
    location: "Hyderabad (Madhapur)",
    work_mode: "Work From Office",
    experience: "Freshers (2024 / 2025)",
    salary_text: "₹2.80 LPA - ₹3.20 LPA",
    salary_min: 280000,
    salary_max: 320000,
    shifts: "Day Shift (Mon - Fri)",
    process_type: "Spatial Reasoning Test + HR Discussion",
    skills: ["GIS Basics", "Google Earth", "Map Navigation", "Data Verification"],
    eligibility: ["Any graduate with basic computer literacy and geographic awareness."],
    responsibilities: ["Verify map vector data, route geometry, and local business POI accuracy."],
    description: "Under recruiter review. Pending final hiring intake allocation from client.",
    status: "DRAFT",
    featured: false,
    views: 12,
    posted_at: "2026-10-06T08:00:00Z",
    created_at: "2026-10-06T08:00:00Z"
  },

  // 7. CLOSED - Hiring Target Reached (Admin test case)
  {
    id: "drive-7",
    title: "[CLOSED] IT Support Desk Analyst – Batch 12",
    slug: "closed-it-support-analyst-deloitte",
    company_id: "comp-7",
    company: DEMO_COMPANIES[6],
    category_id: "cat-3",
    category: DEMO_CATEGORIES[2],
    location: "Hyderabad (Hitec City)",
    work_mode: "Work From Office",
    experience: "0 - 1 Years",
    salary_text: "₹4.00 LPA",
    salary_min: 400000,
    salary_max: 400000,
    shifts: "Rotational Shifts",
    process_type: "Completed",
    skills: ["Active Directory", "Hardware / Networking", "Windows Server", "ITIL"],
    eligibility: ["B.Tech / B.Sc Computers"],
    responsibilities: ["All 40 headcount slots filled through TrainingAndPlacements."],
    description: "This hiring drive completed its intake in September 2026 with 100% joining.",
    status: "CLOSED",
    featured: false,
    views: 680,
    posted_at: "2026-09-15T09:00:00Z",
    created_at: "2026-09-15T09:00:00Z"
  },

  // 8. ARCHIVED - Older Drive from past year (Admin test case)
  {
    id: "drive-8",
    title: "[ARCHIVED] Legacy Voice Executive – Q1 2025",
    slug: "archived-legacy-voice-exec",
    company_id: "comp-8",
    company: DEMO_COMPANIES[7],
    category_id: "cat-1",
    category: DEMO_CATEGORIES[0],
    location: "Secunderabad",
    work_mode: "Work From Office",
    experience: "Freshers",
    salary_text: "₹2.20 LPA",
    salary_min: 220000,
    salary_max: 220000,
    shifts: "Day Shift",
    process_type: "Archived",
    skills: ["Voice", "Telugu / Hindi / English"],
    eligibility: ["Intermediate / Any Degree"],
    responsibilities: ["Archived historical drive."],
    description: "Archived reference drive for historical placement metrics.",
    status: "ARCHIVED",
    featured: false,
    views: 94,
    posted_at: "2026-01-20T10:00:00Z",
    created_at: "2026-01-20T10:00:00Z"
  },

  // 9. PUBLISHED + FEATURED + Wipro Non-Voice
  {
    id: "drive-9",
    title: "Wipro Freshers Non-Voice & Chat Operations Associate",
    slug: "wipro-freshers-non-voice-associate",
    company_id: "comp-5",
    company: DEMO_COMPANIES[4],
    category_id: "cat-4",
    category: DEMO_CATEGORIES[3],
    location: "Hyderabad (Gachibowli)",
    work_mode: "Work From Office",
    experience: "Freshers (2024 / 2025 / 2026 Graduates)",
    salary_text: "₹2.75 LPA - ₹3.40 LPA",
    salary_min: 275000,
    salary_max: 340000,
    shifts: "Rotational Shifts (5 Days Working, 2 Days Off)",
    process_type: "Aptitude + Written English Test + Operations Panel",
    skills: ["Written English", "Typing (30 WPM)", "Email Support", "MS Office"],
    eligibility: [
      "Any graduate (B.Com, B.Sc, BBA, BA, B.Tech passouts).",
      "No active backlogs.",
      "Good comprehension and typing speed."
    ],
    responsibilities: [
      "Process customer emails and live chat tickets with high accuracy.",
      "Adhere to project quality matrices and strict compliance protocols.",
      "Ensure fast resolution times with zero escalation."
    ],
    description: "Wipro is conducting an exclusive walk-in hiring drive with 40+ immediate openings in Hyderabad.",
    status: "PUBLISHED",
    featured: true,
    views: 480,
    posted_at: "2026-10-04T12:00:00Z",
    created_at: "2026-10-04T12:00:00Z"
  },

  // 10. PUBLISHED + FEATURED + Virtusa Software Engineer
  {
    id: "drive-10",
    title: "Virtusa 2026 Software Engineer & Java Full Stack Drive",
    slug: "virtusa-2026-software-engineer-java",
    company_id: "comp-4",
    company: DEMO_COMPANIES[3],
    category_id: "cat-3",
    category: DEMO_CATEGORIES[2],
    location: "Hyderabad (Nanakramguda)",
    work_mode: "Hybrid",
    experience: "Freshers & 1 Year (2025 / 2026 Batches)",
    salary_text: "₹5.00 LPA - ₹6.50 LPA",
    salary_min: 500000,
    salary_max: 650000,
    shifts: "General Day Shift",
    process_type: "Coding Assessment + Technical F2F + HR Discussion",
    skills: ["Java", "Spring Boot", "React", "SQL", "Git", "DSA"],
    eligibility: [
      "B.Tech / B.E (CSE, IT, ECE) or MCA with 65% aggregate.",
      "Hands-on coding experience in Java or Python."
    ],
    responsibilities: [
      "Develop scalable web microservices and client-facing modules.",
      "Write clean unit tests and participate in automated code deployments."
    ],
    description: "Accelerated software engineering program at Virtusa with confirmed client placement slots.",
    status: "PUBLISHED",
    featured: true,
    views: 610,
    posted_at: "2026-10-03T16:00:00Z",
    created_at: "2026-10-03T16:00:00Z"
  },

  // 11. PUBLISHED + FEATURED + Deloitte Associate Analyst
  {
    id: "drive-11",
    title: "Deloitte India Associate Risk & Technology Analyst",
    slug: "deloitte-associate-analyst-drive",
    company_id: "comp-7",
    company: DEMO_COMPANIES[6],
    category_id: "cat-3",
    category: DEMO_CATEGORIES[2],
    location: "Hyderabad (Hitec City)",
    work_mode: "Hybrid",
    experience: "0 - 2 Years",
    salary_text: "₹6.00 LPA - ₹8.00 LPA",
    salary_min: 600000,
    salary_max: 800000,
    shifts: "Day Shift (Mon - Fri)",
    process_type: "Aptitude + Tech Interview + Partner Panel",
    skills: ["Data Analysis", "Python / SQL", "Power BI", "Risk Consulting", "Excel"],
    eligibility: [
      "B.Tech, B.Sc Computers, B.Com Computer Applications, or MBA.",
      "Strong analytical, presentation, and data interpretation skills."
    ],
    responsibilities: [
      "Analyze enterprise data sets to evaluate IT risks and operational security.",
      "Prepare interactive client reporting dashboards using Power BI and Excel."
    ],
    description: "Join Deloitte's world-class advisory practice. Exceptional career growth and fast track promotions.",
    status: "PUBLISHED",
    featured: true,
    views: 740,
    posted_at: "2026-10-02T10:00:00Z",
    created_at: "2026-10-02T10:00:00Z"
  },

  // 12. PUBLISHED + FEATURED + R1 RCM AR Caller Lead
  {
    id: "drive-12",
    title: "R1 RCM Senior AR Follow-Up & Denial Resolution Lead",
    slug: "r1-rcm-senior-ar-caller-lead",
    company_id: "comp-3",
    company: DEMO_COMPANIES[2],
    category_id: "cat-2",
    category: DEMO_CATEGORIES[1],
    location: "Hyderabad (Hitec City)",
    work_mode: "Work From Office",
    experience: "1 - 4 Years",
    salary_text: "₹4.80 LPA - ₹6.20 LPA + Performance Bonus",
    salary_min: 480000,
    salary_max: 620000,
    shifts: "US Night Shift (Fixed Weekends Off)",
    process_type: "Direct Operations Manager F2F Round",
    skills: ["US Healthcare RCM", "Denial Management", "Appeals", "HIPAA", "Payer Calling"],
    eligibility: [
      "1+ years experience in US Hospital or Physician Billing AR.",
      "Clear understanding of commercial and government payer guidelines."
    ],
    responsibilities: [
      "Manage high-dollar unpaid accounts and resolve complex insurance denials.",
      "Mentor junior team members on telephone negotiation with US payers."
    ],
    description: "High-paying US Healthcare career with permanent cab transport and quarterly bonuses.",
    status: "PUBLISHED",
    featured: true,
    views: 520,
    posted_at: "2026-10-01T12:00:00Z",
    created_at: "2026-10-01T12:00:00Z"
  }
];

export const DEMO_APPLICATIONS = [
  // Case 1: Status = APPLIED (Brand new submission, needs review)
  {
    id: "app-101",
    drive_id: "drive-1",
    drive: {
      id: "drive-1",
      title: "Associate Software Engineer – 2025/2026 Batch",
      slug: "associate-software-engineer-cognizant-2025-2026",
      location: "Hyderabad (Gachibowli)",
      company: { name: "Cognizant" }
    },
    candidate_name: "Karthik Varma",
    email: "karthik.varma2025@gmail.com",
    phone: "+91 98480 23145",
    resume_url: "https://example.com/resumes/karthik_varma_btech_cse.pdf",
    cover_letter: "2025 CSE graduate from JNTUH with 74% aggregate. Proficient in Java, Spring Boot, and LeetCode problem solving (200+ solved). Eager to attend Cognizant drive.",
    status: "APPLIED",
    created_at: "2026-10-06T14:30:00Z"
  },

  // Case 2: Status = REVIEWING (Recruiter evaluating profile & marks)
  {
    id: "app-102",
    drive_id: "drive-2",
    drive: {
      id: "drive-2",
      title: "US Healthcare AR Caller & Billing Executive",
      slug: "us-healthcare-ar-caller-r1-rcm",
      location: "Hyderabad (Hitec City)",
      company: { name: "R1 RCM" }
    },
    candidate_name: "Pooja Reddy",
    email: "pooja.reddy.rcm@outlook.com",
    phone: "+91 94901 88234",
    resume_url: "https://example.com/resumes/pooja_reddy_bpharm.pdf",
    cover_letter: "B.Pharmacy 2024 pass-out with strong English voice command and medical terminology foundation. Ready for fixed night shift with company cab.",
    status: "REVIEWING",
    created_at: "2026-10-05T16:15:00Z"
  },

  // Case 3: Status = SHORTLISTED (Mock interview cleared, candidate slotted for client)
  {
    id: "app-103",
    drive_id: "drive-3",
    drive: {
      id: "drive-3",
      title: "International Customer Success Specialist (Remote)",
      slug: "international-customer-success-teleperformance",
      location: "Pan-India / Remote",
      company: { name: "Teleperformance" }
    },
    candidate_name: "Mohammed Zeeshan",
    email: "zeeshan.mhd98@gmail.com",
    phone: "+91 83281 99012",
    resume_url: "https://example.com/resumes/zeeshan_bba.pdf",
    cover_letter: "BBA graduate with 1.5 years customer service experience. Cleared internal Versant voice test with the Contact Team. Slotted for TP client interview.",
    status: "SHORTLISTED",
    created_at: "2026-10-04T11:00:00Z"
  },

  // Case 4: Status = PLACED (Success story! Offer letter released)
  {
    id: "app-104",
    drive_id: "drive-1",
    drive: {
      id: "drive-1",
      title: "Associate Software Engineer – 2025/2026 Batch",
      slug: "associate-software-engineer-cognizant-2025-2026",
      location: "Hyderabad (Gachibowli)",
      company: { name: "Cognizant" }
    },
    candidate_name: "Sneha Goud",
    email: "sneha.goud99@gmail.com",
    phone: "+91 70321 44567",
    resume_url: "https://example.com/resumes/sneha_goud_offer.pdf",
    cover_letter: "Attended TrainingAndPlacements mock interview on 28th September. Successfully cleared Cognizant technical and HR rounds. Received official LOI ₹4.75 LPA!",
    status: "PLACED",
    created_at: "2026-09-29T10:00:00Z"
  },

  // Case 5: Status = REJECTED (Unfit criteria / notice mismatch)
  {
    id: "app-105",
    drive_id: "drive-5",
    drive: {
      id: "drive-5",
      title: "Senior Full Stack Cloud Engineer (React / Node / AWS)",
      slug: "senior-full-stack-cloud-capgemini",
      location: "Hyderabad (Gachibowli)",
      company: { name: "Capgemini" }
    },
    candidate_name: "Ramesh Naidu",
    email: "ramesh.naidu@yahoo.com",
    phone: "+91 99887 66554",
    resume_url: null,
    cover_letter: "90 days notice period not acceptable by Capgemini immediate joining requirement. Advised to re-apply when serving final 30 days.",
    status: "REJECTED",
    created_at: "2026-10-01T15:20:00Z"
  }
];

export const DEMO_ENQUIRIES = [
  // Case 1: Status = NEW, Type = CANDIDATE
  {
    id: "enq-201",
    name: "Sai Krishna Rao",
    email: "saikrishna.rao@gmail.com",
    phone: "+91 88970 12345",
    subject: "2025 B.Tech Freshers Placement Schedule",
    type: "CANDIDATE",
    message: "Sir, I am a 2025 pass-out from Warangal. Can you please let me know if walk-in or virtual drives are scheduled for Cognizant or Capgemini this weekend?",
    status: "NEW",
    created_at: "2026-10-06T15:45:00Z"
  },

  // Case 2: Status = CONTACTED, Type = RECRUITER
  {
    id: "enq-202",
    name: "Neha Mathur",
    email: "neha.mathur@teleperformance.com",
    phone: "+91 98200 45678",
    subject: "Requirement of 35 Pre-screened Voice Candidates",
    type: "RECRUITER",
    message: "Hi Contact Team, we are scaling our US Voice account in Hyderabad Hitec City campus. We need 35 candidates screened on Versant 4+ by Monday. Please share resumes.",
    status: "CONTACTED",
    created_at: "2026-10-05T12:30:00Z"
  },

  // Case 3: Status = RESOLVED, Type = EMPLOYER
  {
    id: "enq-203",
    name: "Venkatesh Prasad",
    email: "venkatesh@clarissolutions.in",
    phone: "+91 97011 22334",
    subject: "Hiring Partnership for FinTech Startup",
    type: "EMPLOYER",
    message: "Looking to hire 6 React & Node.js engineers. The Contact Team aligned 12 candidate profiles. 5 candidates already offered. Partnership active.",
    status: "RESOLVED",
    created_at: "2026-10-02T10:15:00Z"
  },

  // Case 4: Status = ARCHIVED, Type = GENERAL
  {
    id: "enq-204",
    name: "Dr. K. Srinivas",
    email: "principal@cbit.ac.in",
    phone: "+91 94400 11223",
    subject: "Campus Placement Training Collaboration",
    type: "GENERAL",
    message: "Inquiry regarding pre-placement training modules and mock technical simulations for 4th year college batch.",
    status: "ARCHIVED",
    created_at: "2026-09-15T09:00:00Z"
  }
];

export const DEMO_TESTIMONIALS = [
  // 5 Stars - Placed in Tech
  {
    id: "test-1",
    name: "Shiva Sai Jakka",
    role: "Candidate – Placed Associate",
    company: "Cognizant",
    content: "Great support throughout the interview process. The Contact Team guided me at every round and ensured complete clarity on communication and technical panel expectations.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    is_published: true,
    created_at: "2026-09-20T10:00:00Z"
  },

  // 5 Stars - US Healthcare
  {
    id: "test-2",
    name: "Afrid Fareed",
    role: "Candidate – Placed Executive",
    company: "R1 RCM",
    content: "Helped me get placed smoothly with prompt coordination, mock voice rounds, and transparent guidance. Highly recommended for US Healthcare and Non-IT careers!",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    is_published: true,
    created_at: "2026-09-22T10:00:00Z"
  },

  // 4 Stars - BPO CX
  {
    id: "test-3",
    name: "A. Sadhana",
    role: "Candidate – Placed Specialist",
    company: "Teleperformance",
    content: "TrainingAndPlacements provided direct client mapping and made the entire onboarding hassle-free. The Contact Team was always reachable on call whenever I had doubts.",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 4,
    is_published: true,
    created_at: "2026-09-25T10:00:00Z"
  },

  // 5 Stars - Operations
  {
    id: "test-4",
    name: "Rohit Nambiar",
    role: "Candidate – KYC Operations",
    company: "Concentrix",
    content: "Zero intermediary charges and 100% genuine corporate slots. The mock round gave me high confidence for the client scenario test.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    is_published: true,
    created_at: "2026-09-28T10:00:00Z"
  },

  // Draft review pending moderation (Admin test case)
  {
    id: "test-5",
    name: "Pravallika K.",
    role: "Candidate – Under Final Onboarding",
    company: "Capgemini",
    content: "Mock interview practice was directly aligned with client technical questions. Awaiting DOJ confirmation.",
    avatar_url: null,
    rating: 5,
    is_published: false,
    created_at: "2026-10-05T10:00:00Z"
  }
];
