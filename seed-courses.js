const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const universitiesWithoutCourses = await prisma.university.findMany({
    where: {
      courses: {
        none: {}
      }
    }
  });

  console.log(`Found ${universitiesWithoutCourses.length} universities without courses.`);

  for (const uni of universitiesWithoutCourses) {
    const coursesToCreate = [
      {
        slug: `${uni.slug}-bsc-computer-science`,
        name: "BSc Computer Science",
        degreeType: "UG",
        durationMonths: 36,
        intakeMonths: ["September", "January"],
        tuitionFeeUsd: 15000,
        eligibility: "High school diploma with mathematics.",
        universityId: uni.id,
      },
      {
        slug: `${uni.slug}-bba-business-admin`,
        name: "BBA Business Administration",
        degreeType: "UG",
        durationMonths: 36,
        intakeMonths: ["September", "January"],
        tuitionFeeUsd: 12000,
        eligibility: "High school diploma.",
        universityId: uni.id,
      },
      {
        slug: `${uni.slug}-msc-data-science`,
        name: "MSc Data Science",
        degreeType: "MASTERS",
        durationMonths: 24,
        intakeMonths: ["September"],
        tuitionFeeUsd: 18000,
        eligibility: "Bachelor's degree in a related field.",
        universityId: uni.id,
      }
    ];

    for (const courseData of coursesToCreate) {
      await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: courseData,
        create: courseData,
      });
    }
    console.log(`Added 3 courses to ${uni.name}`);
  }

  console.log("Course seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
