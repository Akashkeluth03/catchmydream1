# Study in Asia - Sitemap & Navigation Guide

## User Journey

```
Home (/)
├── Search Bar → University Quick Search
├── Featured Countries → Country Pages
└── "View all" → Universities Listing

Countries (/countries)
└── [Singapore, Malaysia, UAE, Japan, South Korea, Thailand]
    └── Click any country → Country Detail Page
        ├── Visa requirements
        ├── Cost of living
        ├── Work permit rules
        └── Top student cities

Universities (/universities)
├── Filter by country (?country=singapore)
└── [List of 7 universities with basic info]
    └── Click any university → University Detail Page

🎯 University Detail Page (/universities/[slug])
├── 📚 Programs & Courses Section
│   ├── Course name & degree type
│   ├── Tuition fee (USD)
│   ├── Duration & intakes
│   └── Language requirements (IELTS/TOEFL)
│
├── 🏠 Nearby Accommodations Section
│   ├── [Card for each accommodation]
│   │   ├── Name & type
│   │   ├── Distance from campus (KM)
│   │   ├── Monthly rent (USD/local)
│   │   ├── Address & coordinates
│   │   ├── Safety score
│   │   └── Furnished/unfurnished
│   │
│   └── Sorted by: Distance (closest first)
│
├── 💼 Nearby Jobs Section
│   ├── [Card for each job]
│   │   ├── Job title
│   │   ├── Company name
│   │   ├── Distance from campus (KM)
│   │   ├── Employment type (Full-time/Part-time/Internship)
│   │   ├── Salary information
│   │   ├── Visa sponsorship: Yes/No
│   │   └── Apply link
│   │
│   └── Sorted by: Distance (closest first)
│
└── 📍 Location Section
    ├── City & country
    └── GPS coordinates
```

## Page Matrix

| Page | URL | Data Shown | Clickable Elements |
|------|-----|-----------|------------------|
| Home | `/` | Countries, Search Bar | Country links, Search |
| Countries | `/countries` | All 6 countries with overview | Country detail links |
| Country Detail | `/countries/[slug]` | Country info, visa, jobs | - |
| Universities | `/universities` | 7 universities basic info | University detail links |
| University Detail ⭐ | `/universities/[slug]` | **Full campus ecosystem** | Job apply links |
| Accommodation | `/accommodation` | All accommodations | - |
| Jobs | `/jobs` | All jobs | Job apply links |
| Courses | `/courses` | All courses | - |
| Admin | `/admin` | Dashboard (if logged in) | - |
| Dashboard | `/dashboard` | User profile & saved items | - |

## Data Flow for University Detail Page

```
University Detail Page
│
├─→ GET /universities/[slug]
│   │
│   └─→ Query Database:
│       ├── University (name, description, ranking, etc.)
│       ├── Country (name, currency, visa info, etc.)
│       ├── Courses (all courses for this university)
│       ├── Accommodations (all accommodations linked to university)
│       │   └── Sort by: monthlyRentUsd (ascending)
│       ├── Jobs (all jobs linked to university)
│       │   └── Sort by: distanceKm (ascending)
│       └── Scholarships (up to 6, ordered by creation date)
│
└─→ Display:
    ├── Header with university info
    ├── Programs section (all courses)
    ├── Accommodations section (all accommodations with colors)
    ├── Jobs section (all jobs with cards)
    └── Location info (coordinates)
```

## Component Hierarchy

```
Layout
└── Page
    ├── Header
    │   ├── Country/City/Type
    │   ├── University Name (h1)
    │   ├── Description
    │   └── Badges (Ranking, English-taught, Website)
    │
    ├── Section: Programs & Courses
    │   └── Grid of Course Cards
    │       ├── Name & Degree Type
    │       ├── Tuition & Duration
    │       └── Language Requirements
    │
    ├── Section: Nearby Accommodations
    │   ├── Title & Count
    │   └── Grid of Accommodation Cards
    │       ├── Name & Type Badge
    │       ├── Distance Badge (km)
    │       ├── Price & Address
    │       ├── Safety Score
    │       └── Furnished Status
    │
    ├── Section: Nearby Job Opportunities
    │   ├── Title & Count
    │   └── Grid of Job Cards
    │       ├── Job Title & Company
    │       ├── Distance Badge (km)
    │       ├── Employment Type
    │       ├── Salary
    │       ├── Visa Sponsorship
    │       └── Apply Link
    │
    └── Section: Location
        ├── City & Country
        └── GPS Coordinates
```

## Navigation Patterns

### Pattern 1: Browse All → View Details
```
/universities → Click Card → /universities/[slug]
                              ↓
                         See accommodations & jobs
```

### Pattern 2: Find by Country Filter
```
/universities?country=singapore → Shows NUS, NTU
                                  ↓
                             Click university
                                  ↓
                         /universities/national-university-of-singapore-nus
```

### Pattern 3: Discover Opportunities
```
/universities/[slug]
├── Find housing in "Nearby Accommodations"
├── Find jobs in "Nearby Job Opportunities"
└── See requirements in "Programs & Courses"
```

## Data Visibility

### What's Visible on Each University Detail Page

#### Accommodations
- ✓ Name, type, full address
- ✓ Distance from campus (calculated)
- ✓ Monthly rent (in USD)
- ✓ Safety score (0-100)
- ✓ Furnished/unfurnished
- ✓ GPS coordinates
- ✓ Count of options

#### Jobs
- ✓ Job title, company name
- ✓ Distance from campus (calculated)
- ✓ Employment type (full-time, part-time, internship)
- ✓ Salary/compensation information
- ✓ Visa sponsorship availability
- ✓ Direct apply link
- ✓ Count of options

#### Courses
- ✓ Program name, degree type
- ✓ Tuition fee (USD)
- ✓ Duration (months)
- ✓ Intake months (when you can start)
- ✓ Language requirements (IELTS, TOEFL)
- ✓ Eligibility criteria

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Stacked cards
- Touch-friendly spacing
- Bottom navigation

### Tablet (768px - 1024px)
- 2 column grid for accommodations/jobs
- Larger readable text
- Optimized touch targets

### Desktop (> 1024px)
- 3 column grid for accommodations
- 2 column grid for jobs
- Full-width utilization
- Hover effects enabled

## Key Features on University Detail Page

### 1. Quick Overview
- At-a-glance university ranking
- English-taught availability
- Direct link to university website
- City and country information

### 2. Academic Information
- All degree types offered
- Exact tuition costs
- Program duration
- Language test requirements
- Intake schedules

### 3. Housing Discovery
- Multiple accommodation types
- Price range visible immediately
- Safety ratings for neighborhoods
- Distance information for commuting
- Address and coordinates for mapping

### 4. Career Opportunities
- Entry-level and professional roles
- Companies actively recruiting
- Visa sponsorship information
- Salary expectations
- Direct application links

### 5. Location Intelligence
- GPS coordinates for mapping
- Distance calculations from campus
- City-based context
- Commute time estimation

## Sorting & Ordering

| Section | Sorted By | Order |
|---------|-----------|-------|
| Courses | Tuition fee | Low to high |
| Accommodations | Monthly rent | Low to high |
| Jobs | Distance from campus | Close to far |
| Countries | Alphabetical | A to Z |
| Universities | Ranking | Best to worst |

## Color Coding

- 🟩 **Green/Emerald** - Accommodation cards (housing)
- 🟦 **Blue** - Job cards (employment)
- ⚪ **White** - Course cards (education)
- 🟪 **Purple** - Country/university cards (general info)

## SEO & URLs

### University Pages
- `/universities` - All universities
- `/universities/national-university-of-singapore-nus` - NUS details
- `/universities/nanyang-technological-university-ntu` - NTU details
- `/universities/university-of-malaya-um` - UM details
- `/universities/khalifa-university` - Khalifa details
- `/universities/the-university-of-tokyo` - UTokyo details
- `/universities/seoul-national-university-snu` - SNU details
- `/universities/chulalongkorn-university` - Chula details

### Country Pages
- `/countries` - All countries
- `/countries/singapore` - Singapore details
- `/countries/malaysia` - Malaysia details
- `/countries/united-arab-emirates` - UAE details
- `/countries/japan` - Japan details
- `/countries/south-korea` - South Korea details
- `/countries/thailand` - Thailand details

---

**Last Updated**: April 2026
