-- ====================================================================
-- TRAININGANDPLACEMENTS Seed Data
-- ====================================================================

-- 1. Insert Categories
insert into public.categories (id, name, slug, description, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'IT & Engineering', 'it-engineering', 'Enterprise software development, full stack engineering, test automation, and Guidewire insurance systems.', true),
  ('22222222-2222-2222-2222-222222222222', 'Non-IT & Operations', 'non-it-operations', 'High-volume customer experience, Google project mapping, non-voice transactions, and enterprise ticketing.', true),
  ('33333333-3333-3333-3333-333333333333', 'Medical & Healthcare RCM', 'medical-healthcare-rcm', 'Recession-proof US healthcare revenue cycle pipelines, medical billing, AR calling, and clinical coordination.', true),
  ('44444444-4444-4444-4444-444444444444', 'Mock Interview & Mentorship', 'mock-interview-prep', '1-on-1 interview prep, communication clarity drills, and client panel readiness.', true)
on conflict (slug) do nothing;

-- 2. Insert Companies
insert into public.companies (id, name, slug, industry, location, website, is_active)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Capgemini', 'capgemini', 'IT Consulting & Services', 'Hyderabad / Pan India', 'https://www.capgemini.com', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Teleperformance', 'teleperformance', 'Customer Experience & BPO', 'Hyderabad', 'https://www.teleperformance.com', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Cognizant', 'cognizant', 'Digital & Technology Solutions', 'Hyderabad', 'https://www.cognizant.com', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Tech Mahindra', 'tech-mahindra', 'Enterprise ITES & Telecom', 'Hyderabad', 'https://www.techmahindra.com', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Wipro', 'wipro', 'Cloud & IT Services', 'Hyderabad', 'https://www.wipro.com', true),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'R1 RCM', 'r1-rcm', 'US Healthcare Revenue Operations', 'Hyderabad', 'https://www.r1rcm.com', true),
  ('12121212-1212-1212-1212-121212121212', 'Deloitte', 'deloitte', 'Consulting & Audit Advisory', 'Bangalore', 'https://www.deloitte.com', true),
  ('34343434-3434-3434-3434-343434343434', 'Virtusa', 'virtusa', 'Software Engineering & Cloud', 'Hyderabad', 'https://www.virtusa.com', true)
on conflict (slug) do nothing;

-- 3. Insert Hiring Drives (Dynamic Jobs)
insert into public.hiring_drives (
  id, title, slug, company_id, category_id,
  location, experience, salary_min, salary_max, salary_text,
  work_mode, skills, eligibility, responsibilities,
  application_url, featured, status, views, posted_at, short_description, description
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Capgemini Engineering Hiring Drive (Aeronautical & Mechanical)',
    'capgemini-engineering-hiring-drive',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Pan India',
    'Freshers (2025 / 2026 Batch Passouts)',
    550000, 550000, '₹5.50 LPA',
    'Hybrid',
    ARRAY['CATIA V5/V6', 'Parametric 3D Modeling', 'Assembly Design', 'GD&T', 'Engineering Tolerances'],
    ARRAY['BE / B.Tech in Mechanical, Aerospace, Aeronautical or Allied Engineering', '2025 & 2026 graduating batches with minimum 60% throughout academics', 'No active backlogs at the time of final onboarding'],
    ARRAY['Working knowledge of CATIA V5 / V6 3D modeling, parametric part modeling, and assembly concepts', 'Understanding of mechanical engineering drawings, GD&T, and engineering tolerance specifications', 'Collaborate with global aerospace and industrial engineering design teams'],
    'https://wa.me/918309740722?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20Capgemini%20Engineering%20Hiring%20Drive',
    true, 'PUBLISHED', 142, current_date,
    'Direct off-campus engineering hiring drive for fresh graduates with specialized CAD modeling tracks.',
    'Capgemini Engineering is conducting a direct campus and off-campus recruitment drive for engineering graduates in mechanical, aeronautical, and related technical disciplines.'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Teleperformance Google Process Hiring Drive (Customer Care & Ops)',
    'teleperformance-google-process-hiring-drive',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'Hyderabad',
    'Freshers (2020 – 2025 Graduates)',
    220000, 250000, '₹2.20 LPA + ₹30K Allowances',
    'Work From Office',
    ARRAY['Customer Communication', 'Email & Chat Etiquette', 'Problem Solving', 'SLA Compliance'],
    ARRAY['Any Graduate / Undergraduate (Batch 2020 - 2025)', 'Excellent verbal and written English communication skills', 'Comfortable with rotational shift timings and office cab radius'],
    ARRAY['Handling customer support inquiries and workflow operations for Google client services', 'Maintaining top-tier service quality, accuracy, and client compliance standards', 'Logging and resolving real-time account and service requests'],
    'https://wa.me/918309740722?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20Teleperformance%20Google%20Process',
    true, 'PUBLISHED', 289, current_date,
    'Urgent hiring drive for Google client enterprise operations with 2-way cab and free food provided.',
    'Exclusive corporate customer support & digital workflow operation roles for premier global tech search giant services.'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Cognizant Google Mapping Associate – Non-Voice (Work From Home)',
    'cognizant-google-mapping-associate-non-voice',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'Hyderabad',
    'Freshers (2021 – 2026 Passouts)',
    270000, 270000, '₹2.70 LPA',
    'Work From Home',
    ARRAY['Geographic Data Analysis', 'Quality Assurance', 'Web Navigation', 'Attention to Detail'],
    ARRAY['Any Degree / Diploma / Post-Graduation (2021 - 2026 batches)', 'Good comprehension and computer literacy', 'Reliable home internet infrastructure after office onboarding training'],
    ARRAY['Reviewing, validating, and updating spatial geographic data for Google Mapping non-voice domain', 'Quality assurance of road networks, address points, and location metadata', 'Adhering to project quality matrices and strict compliance protocols'],
    'https://wa.me/918309740722?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20Cognizant%20Google%20Mapping',
    true, 'PUBLISHED', 315, current_date,
    'Remote work opportunity analyzing geographic spatial information and digital road maps.',
    'Specialized spatial data validation project reviewing mapping information, transit paths, and landmark verification.'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'R1 RCM Medical Billing & RCM Associate (US Healthcare Process)',
    'r1-rcm-medical-billing-and-rcm-associate',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '33333333-3333-3333-3333-333333333333',
    'Hyderabad',
    'Freshers & Trainees (2023 – 2026 Passouts)',
    240000, 280000, '₹2.40 LPA – ₹2.80 LPA + Performance Incentives',
    'Work From Office',
    ARRAY['Medical Billing', 'Charge Entry', 'Claim Submission', 'US Healthcare Basics'],
    ARRAY['Freshers from B.Sc, B.Com, B.Pharmacy, B.Tech, or any stream (2023-2026)', 'Willingness to work night shifts with 2-way cab provided', 'Clear English reading & comprehension'],
    ARRAY['Managing US healthcare patient registration and insurance claim submissions', 'Validating medical claim billing accuracy and resolving initial rejections', 'Collaborating with hospital billing teams to expedite claim collections'],
    'https://wa.me/918309740722?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20R1%20RCM%20Drive',
    true, 'PUBLISHED', 201, current_date,
    'Recession-proof US Healthcare Revenue Cycle Management drive with fast 10-day process.',
    'Launch your career in the recession-proof US Healthcare Revenue Cycle Management (RCM) sector with R1 RCM.'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'Virtusa Software Engineer Hiring Drive (ONLY 2026 B.Tech / BE)',
    'virtusa-software-engineer-hiring-drive-2026',
    '34343434-3434-3434-3434-343434343434',
    '11111111-1111-1111-1111-111111111111',
    'Hyderabad, Telangana, India',
    'Freshers (ONLY 2026 B.Tech / BE Passouts)',
    500000, 600000, 'Up to 5 - 6 LPA',
    'Hybrid',
    ARRAY['Data Structures & Algorithms', 'Java / Python', 'React / Node.js', 'SQL Databases', 'Git'],
    ARRAY['ONLY 2026 Batch passing out B.Tech / BE (CSE, IT, ECE, EEE)', 'Minimum 65% aggregate throughout 10th, 12th, and Engineering', 'Clear programming fundamentals and problem solving acumen'],
    ARRAY['Full-stack Application Development (Backend & Frontend)', 'Codebase Maintenance, Unit Testing, and Debugging', 'Participate in agile sprint delivery and client technical demos'],
    'https://wa.me/918309740722?text=Hi%20Sandru%20Anudeep,%20I%20am%20interested%20in%20Virtusa%202026%20Drive',
    true, 'PUBLISHED', 178, current_date,
    'Campus off-drive for 2026 engineering graduates with direct technical interviews.',
    'Premier entry-level campus recruitment drive for final-year engineering graduates across core development tracks.'
  )
on conflict (slug) do nothing;

-- 4. Insert Testimonials
insert into public.testimonials (name, role, company, content, rating, is_published)
values
  ('Shiva Sai Jakka', 'Placed Candidate', 'Teleperformance', 'Great support throughout the interview process. Sandru Anudeep sir guided me at every round and ensured complete clarity on communication expectations.', 5, true),
  ('Afrid Fareed', 'Placed Candidate', 'Cognizant', 'Helped me get placed smoothly with prompt coordination, mock interview rounds, and transparent guidance. Highly recommended for Non-IT jobs!', 5, true),
  ('A. Sadhana', 'Placed Candidate', 'WNS Global', 'TrainingAndPlacements provided direct client mapping and made the entire onboarding hassle-free. Sandru Anudeep was always reachable on call.', 5, true),
  ('Allanki Vara Prasad', 'Placed Candidate', 'Tech Mahindra', 'Transparent process and genuine job assistance. TrainingAndPlacements gave me the right platform and continuous support during my Non-IT placement.', 5, true)
on conflict do nothing;
