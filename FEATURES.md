# Study in Asia - Features & How to Use

## Overview

A comprehensive platform for international students to explore universities, housing, jobs, and scholarships across Asia.

---

## Features

### 1. **Browse Universities by Country**
- Navigate to `/universities` to see all universities
- Filter by country using query parameters: `/universities?country=singapore`
- Click on any university card to view detailed information

### 2. **University Detail Pages**
When you click on a university, you'll see:

#### Programs & Courses
- All available degree programs (Undergraduate, Masters, PhD)
- Tuition fees in USD
- Duration and intake months
- Language requirements (IELTS, TOEFL)
- Eligibility criteria

#### Nearby Accommodations
- Student halls/dormitories
- Private apartments
- Shared flats
- **Distance from campus** (in kilometers)
- Monthly rent in local currency
- Safety scores (1-100)
- Furnished/unfurnished status
- Full address

#### Nearby Job Opportunities
- Part-time and full-time positions
- Companies recruiting near the university
- **Distance from campus** (in kilometers)
- Employment type and salary information
- Visa sponsorship availability
- Direct application links

### 3. **Search & Discovery**
- Home page search bar for quick university lookup
- Country-specific pages with overview information
  - Visa requirements
  - Cost of living
  - Work permit rules
  - Top student cities
  - Official languages

### 4. **Accommodation Filtering**
Features visible on university pages:
- **Budget filtering**: Sort by monthly rent (lowest to highest)
- **Distance-based**: See closest accommodations first
- **Type filtering**: Student halls, private apartments, shared flats
- **Safety ratings**: Choose safe neighborhoods

### 5. **Job Listing & Details**
Features on university pages:
- **Employment type**: Full-time, part-time, internships
- **Visa sponsorship**: See which jobs support visa sponsorship
- **Distance information**: Know how far jobs are from campus
- **Salary ranges**: In local currency
- **Company names**: See which companies are hiring
- **Direct apply**: Links to application portals

---

## How to Navigate

### From Home Page
1. Click on a featured country (Singapore, Malaysia, UAE, Japan, South Korea, Thailand)
2. Or use the search bar to find a specific university

### Browse All Universities
1. Go to `/universities`
2. See all 7 universities with basic info
3. Click any university card to expand details

### View University Details
1. Click on any university card
2. Scroll through sections:
   - **Programs & Courses** - See available programs
   - **Nearby Accommodations** - Find housing within 0-85 km
   - **Nearby Job Opportunities** - Discover employment
   - **Location** - See exact coordinates

### Filter & Sort
- Accommodations are sorted by rent (lowest first)
- Jobs are sorted by distance (closest first)
- Each card shows key metrics (price, distance, salary)

---

## Data Points Available

### For Each University
- ✓ Global ranking
- ✓ Location (city, country)
- ✓ University type (public/private)
- ✓ English-taught programs
- ✓ Latitude/Longitude coordinates
- ✓ Official website link

### For Each Accommodation
- ✓ Type (hall, apartment, shared)
- ✓ Distance from campus (km)
- ✓ Monthly rent (USD)
- ✓ Furnished status
- ✓ Safety score
- ✓ Address
- ✓ GPS coordinates

### For Each Job
- ✓ Job title
- ✓ Company name
- ✓ Distance from campus (km)
- ✓ Employment type
- ✓ Salary/compensation
- ✓ Visa sponsorship info
- ✓ Application URL
- ✓ City location

---

## Sample Universities

### Singapore
- **National University of Singapore (NUS)** - Global rank #8
  - 3 accommodations nearby
  - 2 job opportunities
- **Nanyang Technological University (NTU)** - Global rank #15
  - 2 accommodations nearby
  - 1 job opportunity

### Malaysia
- **University of Malaya (UM)** - Global rank #60
  - 2 accommodations nearby
  - 2 job opportunities

### UAE
- **Khalifa University** - Global rank #200
  - 2 accommodations nearby
  - 1 job opportunity

### Japan
- **The University of Tokyo** - Global rank #28
  - 2 accommodations nearby
  - 2 job opportunities

### South Korea
- **Seoul National University (SNU)** - Global rank #41
  - 2 accommodations nearby
  - 2 job opportunities

### Thailand
- **Chulalongkorn University** - Global rank #220
  - 2 accommodations nearby
  - 2 job opportunities

---

## Distance-Based Discovery

### How Distances Are Calculated
- Uses Haversine formula for geographic accuracy
- Based on GPS coordinates (latitude/longitude)
- Displayed in kilometers with 1 decimal precision

### Use Cases
1. **Finding close housing**: Look at "Nearby Accommodations" sorted by distance
2. **Campus jobs**: See opportunities 0-9km from campus
3. **Travel time**: Calculate commute using the distances shown

### Distance Range
- **Closest accommodations**: 0.1 km (on campus)
- **Farthest accommodations**: 85 km (may require transit)
- **Closest jobs**: 2.1 km walk-able distance
- **Farthest jobs**: 22.3 km (requires transportation)

---

## Interactive Features

### Card Design
- Color-coded sections:
  - 🟩 **Accommodations** - Emerald/green cards
  - 🟦 **Jobs** - Blue cards
  - ⚪ **Programs** - Neutral white cards

### Visual Indicators
- 💵 Price information
- 📍 Location/distance
- 🔒 Safety scores
- 💼 Employment type
- ✓ Feature availability (visa sponsorship, furnished, etc.)

### Direct Actions
- 📱 Apply to jobs (external links)
- 🌐 Visit university websites
- 📋 View all details on detail pages

---

## Future Features (Roadmap)

- 🗺️ Interactive map view with markers
- 🔍 Advanced filtering (budget range, distance radius)
- ⭐ Save favorites to dashboard
- 💬 User reviews on accommodations
- 📊 Comparison tools (university vs university)
- 🎯 Personalized recommendations
- 🏦 Scholarship information
- 📝 Visa requirement checklist

---

## Tips for Using the Platform

1. **Start with countries**: Browse country pages for visa/work rules
2. **Compare universities**: Check multiple universities to compare costs
3. **Check accommodations**: View multiple options sorted by budget
4. **Explore jobs**: See salary ranges and visa sponsorship early
5. **Plan accommodation**: Budget 10-15% extra for transport to jobs/campus
6. **Plan timeline**: Check program intakes and visa processing times

---

## Contact & Support

For questions about:
- **Universities**: Check official website links on detail pages
- **Accommodations**: Contact hosts directly (contact info coming soon)
- **Jobs**: Use "Apply now" links to connect with employers
- **Visas**: Consult country-specific pages for requirements

---

## Data Sources

- University rankings: Academic rankings database
- Geographic data: GPS coordinates of institutions
- Accommodation data: Student housing databases
- Job listings: Company career pages
- Pricing: Current market rates by location

---

**Last Updated**: April 2026
**Version**: 1.0
