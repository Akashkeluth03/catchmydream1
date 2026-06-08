const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const universities = await prisma.university.findMany({
    include: {
      accommodations: true,
      jobs: true
    }
  });

  let accCount = 0;
  let jobCount = 0;

  for (const uni of universities) {
    if (uni.accommodations.length === 0) {
      const accommodationsToCreate = [
        {
          slug: `${uni.slug}-premium-residence`,
          name: "Premium Student Residence",
          type: "DORMITORY",
          address: "123 Campus Road",
          distanceKm: 0.5,
          monthlyRentUsd: 450,
          furnished: true,
          safetyScore: 92,
          universityId: uni.id,
        },
        {
          slug: `${uni.slug}-central-apartments`,
          name: "City Central Apartments",
          type: "APARTMENT",
          address: "45 Downtown Avenue",
          distanceKm: 2.1,
          monthlyRentUsd: 650,
          furnished: true,
          safetyScore: 85,
          universityId: uni.id,
        },
        {
          slug: `${uni.slug}-budget-housing`,
          name: "Budget Shared Housing",
          type: "SHARED_ROOM",
          address: "88 Suburb Lane",
          distanceKm: 4.5,
          monthlyRentUsd: 250,
          furnished: false,
          safetyScore: 78,
          universityId: uni.id,
        }
      ];

      for (const accData of accommodationsToCreate) {
        await prisma.accommodation.create({ data: accData });
        accCount++;
      }
    }

    if (uni.jobs.length === 0) {
      const jobsToCreate = [
        {
          slug: `${uni.slug}-it-support`,
          title: "Campus IT Support Assistant",
          companyName: "University Tech Services",
          employmentType: "PART_TIME",
          salaryNote: "$12 - $15 / hr",
          distanceKm: 0.1,
          visaSponsorship: false,
          universityId: uni.id,
          city: uni.city,
        },
        {
          slug: `${uni.slug}-data-analyst`,
          title: "Junior Data Analyst",
          companyName: "Global Tech Inc",
          employmentType: "FULL_TIME",
          salaryNote: "$45k - $55k / yr",
          distanceKm: 3.2,
          visaSponsorship: true,
          universityId: uni.id,
          city: uni.city,
        }
      ];

      for (const jobData of jobsToCreate) {
        await prisma.job.create({ data: jobData });
        jobCount++;
      }
    }
  }

  console.log(`Seeding complete! Added ${accCount} accommodations and ${jobCount} jobs.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
