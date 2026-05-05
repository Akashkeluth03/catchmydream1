/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Countries (MVP)
  const countries = [
    {
      name: "Singapore",
      iso2: "SG",
      capital: "Singapore",
      currency: "SGD",
      officialLanguages: ["English", "Malay", "Mandarin", "Tamil"],
      overview:
        "Singapore is a global education and innovation hub with world-ranked universities, strong safety, and excellent career outcomes in tech, finance, and research.",
      costOfLivingNote:
        "High cost of living in central areas; students often budget for housing, transport, meals, and mandatory insurance. Shared housing reduces monthly costs significantly.",
      tuitionAvgNote:
        "Tuition varies widely by program and university; government-subsidized options may require service obligations for some students.",
      visaProcess:
        "Most students apply for a Student's Pass after receiving an offer. Universities typically guide the process; timelines vary by intake and nationality.",
      workPermitRules:
        "International students may work part-time during term and full-time during vacations if eligible and approved; rules depend on institution and pass type.",
      topStudentCities: ["Singapore"],
    },
    {
      name: "Malaysia",
      iso2: "MY",
      capital: "Kuala Lumpur",
      currency: "MYR",
      officialLanguages: ["Malay", "English"],
      overview:
        "Malaysia offers strong value-for-money education, many English-taught programs, and an established pathway ecosystem for international students.",
      costOfLivingNote:
        "Moderate cost of living; major cities are pricier than suburban areas. Students commonly budget for rent, utilities, commuting, and meals.",
      tuitionAvgNote:
        "Generally affordable compared to many global destinations, with private universities offering extensive international programs.",
      visaProcess:
        "Student passes are issued via Education Malaysia Global Services (EMGS) for most institutions; required documents vary by nationality and program.",
      workPermitRules:
        "Part-time work may be permitted under conditions (e.g., hours and sectors) and is subject to approvals and current regulations.",
      topStudentCities: ["Kuala Lumpur", "Penang", "Johor Bahru"],
    },
    {
      name: "United Arab Emirates",
      iso2: "AE",
      capital: "Abu Dhabi",
      currency: "AED",
      officialLanguages: ["Arabic", "English"],
      overview:
        "The UAE hosts international branch campuses and fast-growing universities, with strong industry linkages and a multicultural student experience.",
      costOfLivingNote:
        "Higher living costs in Dubai and central districts; student housing options and shared apartments can meaningfully reduce budgets.",
      tuitionAvgNote:
        "Tuition depends on institution type (local vs branch campus) and program; scholarships are common for merit and need-based profiles.",
      visaProcess:
        "Student residence visas are typically sponsored by the university; biometric, medical checks, and insurance requirements may apply.",
      workPermitRules:
        "Part-time work may be possible with appropriate permits; internships are common. Always verify campus and emirate-specific rules.",
      topStudentCities: ["Dubai", "Abu Dhabi", "Sharjah"],
    },
    {
      name: "Japan",
      iso2: "JP",
      capital: "Tokyo",
      currency: "JPY",
      officialLanguages: ["Japanese"],
      overview:
        "Japan offers top-tier research, engineering, and design education with strong industry connections and a rich cultural environment.",
      costOfLivingNote:
        "Tokyo is expensive; regional cities are more affordable. Students budget for rent, transit, insurance, and utilities.",
      tuitionAvgNote:
        "National universities are often more affordable than private ones; many programs have additional admission and facility fees.",
      visaProcess:
        "Students typically receive a Certificate of Eligibility (CoE) via the institution, then apply for a student visa at the embassy/consulate.",
      workPermitRules:
        "Students can apply for permission to engage in activities outside their status (part-time work) with hour limits and sector restrictions.",
      topStudentCities: ["Tokyo", "Osaka", "Kyoto", "Fukuoka"],
    },
    {
      name: "South Korea",
      iso2: "KR",
      capital: "Seoul",
      currency: "KRW",
      officialLanguages: ["Korean"],
      overview:
        "South Korea is known for strong STEM and business education, vibrant student cities, and growing English-taught offerings at top universities.",
      costOfLivingNote:
        "Seoul is costlier than other cities; many students reduce costs via dorms, shared housing, and student meal plans.",
      tuitionAvgNote:
        "Tuition varies by field; scholarships for international students are common, including government and university-funded awards.",
      visaProcess:
        "After admission, students apply for a D-2 visa (degree) or relevant category. Requirements vary by institution and nationality.",
      workPermitRules:
        "Part-time work is possible with prior permission and eligibility (including language level in some cases), with hour limits during term.",
      topStudentCities: ["Seoul", "Busan", "Daejeon", "Daegu"],
    },
    {
      name: "Thailand",
      iso2: "TH",
      capital: "Bangkok",
      currency: "THB",
      officialLanguages: ["Thai", "English"],
      overview:
        "Thailand offers a welcoming student experience, affordable living, and a growing catalog of international programs across major cities.",
      costOfLivingNote:
        "Affordable compared to many destinations; Bangkok is more expensive than regional cities. Students budget for rent, transport, food, and insurance.",
      tuitionAvgNote:
        "Tuition depends on program and university; international programs can be higher. Scholarships are available for strong academic profiles.",
      visaProcess:
        "Students apply for a Non-Immigrant ED visa with documentation from the university; extensions and reporting may be required after arrival.",
      workPermitRules:
        "Work permissions are restrictive; some internships may be possible with approvals. Verify the latest regulations before planning employment.",
      topStudentCities: ["Bangkok", "Chiang Mai", "Phuket"],
    },
    {
      name: "India",
      iso2: "IN",
      capital: "New Delhi",
      currency: "INR",
      officialLanguages: ["English", "Hindi"],
      overview:
        "India offers diverse education options with growing top-ranked universities and affordable tuition, making it accessible for many international students.",
      costOfLivingNote:
        "Very affordable cost of living; cities like Bangalore and Delhi offer good student infrastructure with budget accommodations.",
      tuitionAvgNote:
        "Highly affordable tuition compared to Western countries; scholarships available through government and private institutions.",
      visaProcess:
        "Student visas require admission letter, financial documents, and application through Indian embassy. Processing usually takes 2-4 weeks.",
      workPermitRules:
        "Limited work permissions during studies; internships may be allowed with university approval in specific sectors.",
      topStudentCities: ["Bangalore", "Delhi", "Mumbai", "Pune", "Hyderabad"],
    },
    {
      name: "China",
      iso2: "CN",
      capital: "Beijing",
      currency: "CNY",
      officialLanguages: ["Mandarin Chinese"],
      overview:
        "China hosts hundreds of universities with growing international programs, offering scholarships and affordable education in major cities.",
      costOfLivingNote:
        "Affordable cost of living in most cities; Beijing and Shanghai are exceptions. Students often find good value in student accommodation.",
      tuitionAvgNote:
        "Competitive tuition rates; Chinese government offers numerous scholarships for international students covering tuition and living costs.",
      visaProcess:
        "X visa for students; apply through Chinese university or embassy. Requires admission letter and financial proof.",
      workPermitRules:
        "Very limited work permissions; students are discouraged from employment during studies.",
      topStudentCities: ["Beijing", "Shanghai", "Xi'an", "Wuhan"],
    },
    {
      name: "Vietnam",
      iso2: "VN",
      capital: "Hanoi",
      currency: "VND",
      officialLanguages: ["Vietnamese", "English"],
      overview:
        "Vietnam offers emerging educational opportunities with very affordable tuition and living costs, attracting budget-conscious international students.",
      costOfLivingNote:
        "One of the most affordable destinations in Asia; excellent value for accommodation, food, and transport.",
      tuitionAvgNote:
        "Very low tuition compared to regional peers; private universities offer more programs in English.",
      visaProcess:
        "Student visas available through universities. Relatively straightforward process with admission documents.",
      workPermitRules:
        "Limited work opportunities; usually restricted to university-approved internships.",
      topStudentCities: ["Hanoi", "Ho Chi Minh City", "Da Nang"],
    },
    {
      name: "Philippines",
      iso2: "PH",
      capital: "Manila",
      currency: "PHP",
      officialLanguages: ["English", "Filipino"],
      overview:
        "The Philippines offers English-medium education at affordable rates with friendly student atmosphere and diverse programs.",
      costOfLivingNote:
        "Affordable cost of living; Manila is more expensive than provincial cities. Good value for accommodation.",
      tuitionAvgNote:
        "Reasonable tuition rates with many private universities offering international programs at competitive prices.",
      visaProcess:
        "Temporary Resident Visa for students through the Bureau of Immigration with university endorsement.",
      workPermitRules:
        "Limited work permissions; some teaching opportunities available off-campus.",
      topStudentCities: ["Manila", "Cebu", "Davao"],
    },
    {
      name: "Indonesia",
      iso2: "ID",
      capital: "Jakarta",
      currency: "IDR",
      officialLanguages: ["Indonesian", "English"],
      overview:
        "Indonesia provides affordable education with improving international university programs and a rich cultural experience for students.",
      costOfLivingNote:
        "Very affordable living costs; Jakarta is pricier but still reasonable compared to other Asian hubs.",
      tuitionAvgNote:
        "Competitive tuition rates, especially at private universities with English-taught programs.",
      visaProcess:
        "Student visa sponsored by university; valid for duration of studies with possible extensions.",
      workPermitRules:
        "Work permissions limited; internships through university may be arranged.",
      topStudentCities: ["Jakarta", "Surabaya", "Bandung"],
    },
    {
      name: "Pakistan",
      iso2: "PK",
      capital: "Islamabad",
      currency: "PKR",
      officialLanguages: ["Urdu", "English"],
      overview:
        "Pakistan offers affordable higher education with several universities establishing international programs and competitive tuition.",
      costOfLivingNote:
        "Very affordable cost of living; major cities have student-friendly accommodation options.",
      tuitionAvgNote:
        "Low tuition rates with growing scholarship opportunities for international students.",
      visaProcess:
        "Student visas available through Pakistani missions with university sponsorship and financial documents.",
      workPermitRules:
        "Work permissions are limited; mainly through university-affiliated internship programs.",
      topStudentCities: ["Islamabad", "Lahore", "Karachi", "Peshawar"],
    },
    {
      name: "Bangladesh",
      iso2: "BD",
      capital: "Dhaka",
      currency: "BDT",
      officialLanguages: ["Bengali", "English"],
      overview:
        "Bangladesh offers affordable education with growing university programs and an increasingly student-friendly environment.",
      costOfLivingNote:
        "Among the most affordable destinations in Asia with low accommodation and living costs.",
      tuitionAvgNote:
        "Highly competitive tuition rates, especially at private universities.",
      visaProcess:
        "Student visa through Bangladeshi missions with admission letter and financial proof.",
      workPermitRules:
        "Work permissions are restricted; mainly university-approved activities.",
      topStudentCities: ["Dhaka", "Chittagong"],
    },
  ];

  const countryRows = await Promise.all(
    countries.map((c) =>
      prisma.country.upsert({
        where: { iso2: c.iso2 },
        update: {
          ...c,
          slug: slugify(c.name),
        },
        create: {
          ...c,
          slug: slugify(c.name),
          region: "Asia",
        },
      })
    )
  );

  const byIso2 = Object.fromEntries(countryRows.map((c) => [c.iso2, c]));

  // Universities (sample but realistic)
  const universities = [
    {
      countryIso2: "SG",
      name: "National University of Singapore (NUS)",
      rankingGlobal: 8,
      type: "PUBLIC",
      city: "Singapore",
      englishTaught: true,
      websiteUrl: "https://www.nus.edu.sg/",
      description:
        "A leading global university known for computing, engineering, business, and interdisciplinary research, with strong employer outcomes and industry partnerships.",
      lat: 1.2966,
      lng: 103.7764,
    },
    {
      countryIso2: "SG",
      name: "Nanyang Technological University (NTU)",
      rankingGlobal: 15,
      type: "PUBLIC",
      city: "Singapore",
      englishTaught: true,
      websiteUrl: "https://www.ntu.edu.sg/",
      description:
        "A top-ranked research university with strengths in engineering, AI, materials science, and entrepreneurship, offering modern campus facilities and global exchange options.",
      lat: 1.3483,
      lng: 103.6831,
    },
    {
      countryIso2: "MY",
      name: "University of Malaya (UM)",
      rankingGlobal: 60,
      type: "PUBLIC",
      city: "Kuala Lumpur",
      englishTaught: true,
      websiteUrl: "https://www.um.edu.my/",
      description:
        "Malaysia’s flagship university offering a broad range of programs with strong research output and international collaborations.",
      lat: 3.1203,
      lng: 101.6544,
    },
    {
      countryIso2: "AE",
      name: "Khalifa University",
      rankingGlobal: 200,
      type: "PUBLIC",
      city: "Abu Dhabi",
      englishTaught: true,
      websiteUrl: "https://www.ku.ac.ae/",
      description:
        "A research-intensive institution focused on engineering and technology with strong ties to national innovation and industry.",
      lat: 24.4239,
      lng: 54.4419,
    },
    {
      countryIso2: "JP",
      name: "The University of Tokyo",
      rankingGlobal: 28,
      type: "PUBLIC",
      city: "Tokyo",
      englishTaught: true,
      websiteUrl: "https://www.u-tokyo.ac.jp/",
      description:
        "Japan’s premier public research university with world-class programs across science, engineering, economics, and humanities.",
      lat: 35.7126,
      lng: 139.7610,
    },
    {
      countryIso2: "KR",
      name: "Seoul National University (SNU)",
      rankingGlobal: 41,
      type: "PUBLIC",
      city: "Seoul",
      englishTaught: true,
      websiteUrl: "https://en.snu.ac.kr/",
      description:
        "A top Korean university with strong research and global programs across engineering, business, and social sciences.",
      lat: 37.4599,
      lng: 126.9519,
    },
    {
      countryIso2: "TH",
      name: "Chulalongkorn University",
      rankingGlobal: 220,
      type: "PUBLIC",
      city: "Bangkok",
      englishTaught: true,
      websiteUrl: "https://www.chula.ac.th/en/",
      description:
        "Thailand’s leading university offering international programs and strong regional reputation in business, engineering, and public health.",
      lat: 13.7383,
      lng: 100.5337,
    },
  ];

  const universityRows = [];
  for (const u of universities) {
    const slug = slugify(u.name);
    const row = await prisma.university.upsert({
      where: { slug },
      update: {
        name: u.name,
        rankingGlobal: u.rankingGlobal,
        description: u.description,
        type: u.type,
        city: u.city,
        websiteUrl: u.websiteUrl,
        englishTaught: u.englishTaught,
        lat: u.lat,
        lng: u.lng,
        countryId: byIso2[u.countryIso2].id,
      },
      create: {
        slug,
        name: u.name,
        rankingGlobal: u.rankingGlobal,
        description: u.description,
        type: u.type,
        city: u.city,
        websiteUrl: u.websiteUrl,
        englishTaught: u.englishTaught,
        lat: u.lat,
        lng: u.lng,
        countryId: byIso2[u.countryIso2].id,
      },
    });
    universityRows.push(row);
  }

  // Courses
  const courseTemplates = [
    {
      name: "Computer Science",
      degreeType: "MASTERS",
      durationMonths: 18,
      intakeMonths: ["Jan", "Aug"],
      tuitionFeeUsd: 42000,
      eligibility:
        "Bachelor’s degree in CS/IT or related field; strong GPA; relevant coursework in algorithms and systems.",
      ieltsMin: 6.5,
      toeflMin: 90,
      languageNote: "English proficiency requirements vary by program and nationality.",
      applicationDeadlines: "Rolling with priority deadlines by intake.",
    },
    {
      name: "Business Administration",
      degreeType: "MASTERS",
      durationMonths: 16,
      intakeMonths: ["Sep"],
      tuitionFeeUsd: 38000,
      eligibility:
        "Bachelor’s degree; some programs prefer work experience; GMAT/GRE may be optional depending on profile.",
      ieltsMin: 6.5,
      toeflMin: 90,
      languageNote: "May waive English tests for prior English-medium education.",
      applicationDeadlines: "Typically 4–8 months before intake.",
    },
    {
      name: "Electrical Engineering",
      degreeType: "MASTERS",
      durationMonths: 24,
      intakeMonths: ["Mar", "Sep"],
      tuitionFeeUsd: 36000,
      eligibility:
        "Bachelor’s in EE/ECE or adjacent engineering discipline; strong math background.",
      ieltsMin: 6.5,
      toeflMin: 85,
      languageNote: "Some tracks may require interviews or research proposals.",
      applicationDeadlines: "Set by faculty/department; confirm per intake.",
    },
  ];

  for (const uni of universityRows) {
    for (const t of courseTemplates) {
      const slug = slugify(`${uni.slug}-${t.degreeType}-${t.name}`);
      await prisma.course.upsert({
        where: { slug },
        update: {
          ...t,
          universityId: uni.id,
        },
        create: {
          slug,
          ...t,
          universityId: uni.id,
        },
      });
    }
  }

  // Accommodations
  const accommodations = [
    // NUS Singapore
    {
      universitySlug: "national-university-of-singapore-nus",
      name: "NUS Kent Ridge Hall",
      type: "STUDENT_HALL",
      address: "120 Kent Ridge, Singapore 119275",
      distanceKm: 0.5,
      monthlyRentUsd: 350,
      furnished: true,
      safetyScore: 95,
      lat: 1.2980,
      lng: 103.7780,
    },
    {
      universitySlug: "national-university-of-singapore-nus",
      name: "Pinnacle@Duxton",
      type: "PRIVATE_APARTMENT",
      address: "10 Duxton Hill, Singapore 089591",
      distanceKm: 2.1,
      monthlyRentUsd: 1200,
      furnished: true,
      safetyScore: 92,
      lat: 1.2890,
      lng: 103.8445,
    },
    {
      universitySlug: "national-university-of-singapore-nus",
      name: "Shared Apartment in Clementi",
      type: "SHARED_FLAT",
      address: "Clementi Avenue 1, Singapore",
      distanceKm: 3.5,
      monthlyRentUsd: 550,
      furnished: false,
      safetyScore: 90,
      lat: 1.3325,
      lng: 103.7624,
    },

    // NTU Singapore
    {
      universitySlug: "nanyang-technological-university-ntu",
      name: "NTU Hall 1",
      type: "STUDENT_HALL",
      address: "50 Nanyang Avenue, Singapore 639798",
      distanceKm: 0.3,
      monthlyRentUsd: 300,
      furnished: true,
      safetyScore: 94,
      lat: 1.3490,
      lng: 103.6835,
    },
    {
      universitySlug: "nanyang-technological-university-ntu",
      name: "Yung Ho Road Apartment",
      type: "PRIVATE_APARTMENT",
      address: "Yung Ho Road, Singapore 608615",
      distanceKm: 1.8,
      monthlyRentUsd: 900,
      furnished: true,
      safetyScore: 89,
      lat: 1.3298,
      lng: 103.6815,
    },

    // UM Malaysia
    {
      universitySlug: "university-of-malaya-um",
      name: "UM Kolej Tun Dr. Ismail",
      type: "STUDENT_HALL",
      address: "University of Malaya, Kuala Lumpur",
      distanceKm: 0.2,
      monthlyRentUsd: 150,
      furnished: true,
      safetyScore: 85,
      lat: 3.1210,
      lng: 101.6550,
    },
    {
      universitySlug: "university-of-malaya-um",
      name: "Midvalley Apartment",
      type: "PRIVATE_APARTMENT",
      address: "Mid Valley, Kuala Lumpur",
      distanceKm: 3.2,
      monthlyRentUsd: 400,
      furnished: false,
      safetyScore: 82,
      lat: 3.1159,
      lng: 101.6880,
    },

    // Khalifa University UAE
    {
      universitySlug: "khalifa-university",
      name: "KU Student Housing",
      type: "STUDENT_HALL",
      address: "Khalifa University Campus, Abu Dhabi",
      distanceKm: 0.1,
      monthlyRentUsd: 400,
      furnished: true,
      safetyScore: 96,
      lat: 24.4245,
      lng: 54.4420,
    },
    {
      universitySlug: "khalifa-university",
      name: "Marina Apartments Dubai",
      type: "PRIVATE_APARTMENT",
      address: "Marina, Dubai",
      distanceKm: 85,
      monthlyRentUsd: 1800,
      furnished: true,
      safetyScore: 93,
      lat: 25.2048,
      lng: 55.2708,
    },

    // University of Tokyo
    {
      universitySlug: "the-university-of-tokyo",
      name: "Komaba Student Dormitory",
      type: "STUDENT_HALL",
      address: "3-8-1 Komaba, Meguro-ku, Tokyo",
      distanceKm: 1.2,
      monthlyRentUsd: 250,
      furnished: true,
      safetyScore: 95,
      lat: 35.6587,
      lng: 139.7039,
    },
    {
      universitySlug: "the-university-of-tokyo",
      name: "Roppongi Shared House",
      type: "SHARED_FLAT",
      address: "Roppongi, Minato-ku, Tokyo",
      distanceKm: 5.5,
      monthlyRentUsd: 700,
      furnished: true,
      safetyScore: 91,
      lat: 35.6627,
      lng: 139.7308,
    },

    // SNU Seoul
    {
      universitySlug: "seoul-national-university-snu",
      name: "SNU Gwanak Hall",
      type: "STUDENT_HALL",
      address: "Gwanak-gu, Seoul",
      distanceKm: 0.5,
      monthlyRentUsd: 200,
      furnished: true,
      safetyScore: 94,
      lat: 37.4610,
      lng: 126.9530,
    },
    {
      universitySlug: "seoul-national-university-snu",
      name: "Gangnam Officetel",
      type: "PRIVATE_APARTMENT",
      address: "Gangnam-gu, Seoul",
      distanceKm: 8.3,
      monthlyRentUsd: 550,
      furnished: false,
      safetyScore: 90,
      lat: 37.4979,
      lng: 127.0276,
    },

    // Chulalongkorn University Bangkok
    {
      universitySlug: "chulalongkorn-university",
      name: "Chula Dormitory",
      type: "STUDENT_HALL",
      address: "Phyathai Road, Bangkok",
      distanceKm: 0.3,
      monthlyRentUsd: 120,
      furnished: true,
      safetyScore: 88,
      lat: 13.7390,
      lng: 100.5340,
    },
    {
      universitySlug: "chulalongkorn-university",
      name: "Thonglor Apartment",
      type: "PRIVATE_APARTMENT",
      address: "Thonglor, Bangkok",
      distanceKm: 2.8,
      monthlyRentUsd: 350,
      furnished: false,
      safetyScore: 85,
      lat: 13.7373,
      lng: 100.5568,
    },
  ];

  for (const acc of accommodations) {
    const uni = universityRows.find((u) => u.slug === acc.universitySlug);
    if (!uni) continue;

    const slug = slugify(`${uni.slug}-${acc.name}`);
    await prisma.accommodation.upsert({
      where: { slug },
      update: {
        name: acc.name,
        type: acc.type,
        address: acc.address,
        distanceKm: acc.distanceKm,
        monthlyRentUsd: acc.monthlyRentUsd,
        furnished: acc.furnished,
        safetyScore: acc.safetyScore,
        lat: acc.lat,
        lng: acc.lng,
      },
      create: {
        slug,
        name: acc.name,
        type: acc.type,
        address: acc.address,
        distanceKm: acc.distanceKm,
        monthlyRentUsd: acc.monthlyRentUsd,
        furnished: acc.furnished,
        safetyScore: acc.safetyScore,
        lat: acc.lat,
        lng: acc.lng,
        universityId: uni.id,
      },
    });
  }

  // Jobs
  const jobs = [
    // Singapore Jobs
    {
      universitySlug: "national-university-of-singapore-nus",
      city: "Singapore",
      title: "Software Engineer Intern",
      companyName: "Google Singapore",
      employmentType: "INTERNSHIP",
      salaryNote: "SGD 3,500 - 4,500 per month",
      distanceKm: 8.2,
      visaSponsorship: false,
      applyUrl: "https://careers.google.com",
    },
    {
      universitySlug: "national-university-of-singapore-nus",
      city: "Singapore",
      title: "Data Analyst",
      companyName: "Goldman Sachs Singapore",
      employmentType: "FULL_TIME",
      salaryNote: "SGD 6,000 - 8,000 per month",
      distanceKm: 4.5,
      visaSponsorship: true,
      applyUrl: "https://careers.gs.com",
    },
    {
      universitySlug: "nanyang-technological-university-ntu",
      city: "Singapore",
      title: "Business Development Executive",
      companyName: "Grab Singapore",
      employmentType: "FULL_TIME",
      salaryNote: "SGD 4,500 - 6,000 per month",
      distanceKm: 6.3,
      visaSponsorship: true,
      applyUrl: "https://grab.careers",
    },

    // Malaysia Jobs
    {
      universitySlug: "university-of-malaya-um",
      city: "Kuala Lumpur",
      title: "Marketing Coordinator",
      companyName: "Petronas",
      employmentType: "PART_TIME",
      salaryNote: "RM 2,000 - 2,500 per month",
      distanceKm: 12.5,
      visaSponsorship: true,
      applyUrl: "https://www.petronas.com/careers",
    },
    {
      universitySlug: "university-of-malaya-um",
      city: "Kuala Lumpur",
      title: "Software Developer",
      companyName: "Axiata Group",
      employmentType: "FULL_TIME",
      salaryNote: "RM 3,500 - 4,500 per month",
      distanceKm: 5.8,
      visaSponsorship: true,
      applyUrl: "https://axiata.taleo.net",
    },

    // UAE Jobs
    {
      universitySlug: "khalifa-university",
      city: "Abu Dhabi",
      title: "Junior Engineer",
      companyName: "ADNOC",
      employmentType: "FULL_TIME",
      salaryNote: "AED 4,000 - 5,500 per month",
      distanceKm: 22.3,
      visaSponsorship: true,
      applyUrl: "https://adnoc.ae/careers",
    },

    // Japan Jobs
    {
      universitySlug: "the-university-of-tokyo",
      city: "Tokyo",
      title: "English Tutor",
      companyName: "Nova English Schools",
      employmentType: "PART_TIME",
      salaryNote: "JPY 2,500 - 3,500 per hour",
      distanceKm: 3.2,
      visaSponsorship: false,
      applyUrl: "https://nova.co.jp",
    },
    {
      universitySlug: "the-university-of-tokyo",
      city: "Tokyo",
      title: "Research Scientist",
      companyName: "Sony Research",
      employmentType: "FULL_TIME",
      salaryNote: "JPY 3,500,000 - 4,500,000 per year",
      distanceKm: 9.8,
      visaSponsorship: true,
      applyUrl: "https://sony.com/careers",
    },

    // South Korea Jobs
    {
      universitySlug: "seoul-national-university-snu",
      city: "Seoul",
      title: "English Instructor",
      companyName: "EF English",
      employmentType: "PART_TIME",
      salaryNote: "KRW 25,000 - 35,000 per hour",
      distanceKm: 4.1,
      visaSponsorship: false,
      applyUrl: "https://ef.co.kr",
    },
    {
      universitySlug: "seoul-national-university-snu",
      city: "Seoul",
      title: "Software Engineer",
      companyName: "Naver",
      employmentType: "FULL_TIME",
      salaryNote: "KRW 35,000,000 - 50,000,000 per year",
      distanceKm: 6.5,
      visaSponsorship: true,
      applyUrl: "https://recruit.naver.com",
    },

    // Thailand Jobs
    {
      universitySlug: "chulalongkorn-university",
      city: "Bangkok",
      title: "Social Media Manager",
      companyName: "AirAsia",
      employmentType: "FULL_TIME",
      salaryNote: "THB 30,000 - 40,000 per month",
      distanceKm: 7.2,
      visaSponsorship: true,
      applyUrl: "https://airasia.com/careers",
    },
    {
      universitySlug: "chulalongkorn-university",
      city: "Bangkok",
      title: "Customer Service Specialist",
      companyName: "CMMC",
      employmentType: "PART_TIME",
      salaryNote: "THB 300 - 400 per hour",
      distanceKm: 2.1,
      visaSponsorship: false,
      applyUrl: "https://cmmc.co.th",
    },
  ];

  for (const job of jobs) {
    const uni = universityRows.find((u) => u.slug === job.universitySlug);
    if (!uni) continue;

    const slug = slugify(`${uni.slug}-${job.companyName}-${job.title}`);
    await prisma.job.upsert({
      where: { slug },
      update: {
        title: job.title,
        companyName: job.companyName,
        employmentType: job.employmentType,
        salaryNote: job.salaryNote,
        distanceKm: job.distanceKm,
        visaSponsorship: job.visaSponsorship,
        applyUrl: job.applyUrl,
        city: job.city,
      },
      create: {
        slug,
        title: job.title,
        companyName: job.companyName,
        employmentType: job.employmentType,
        salaryNote: job.salaryNote,
        distanceKm: job.distanceKm,
        visaSponsorship: job.visaSponsorship,
        applyUrl: job.applyUrl,
        city: job.city,
        universityId: uni.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

