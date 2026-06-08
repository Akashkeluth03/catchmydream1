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
  // Find India and China
  const india = await prisma.country.findUnique({ where: { iso2: "IN" } });
  const china = await prisma.country.findUnique({ where: { iso2: "CN" } });

  const extraUniversities = [];

  if (india) {
    extraUniversities.push(
      {
        countryId: india.id,
        name: "Indian Institute of Technology Bombay",
        type: "PUBLIC",
        city: "Mumbai",
        englishTaught: true,
        description: "A premier engineering and research institution in India.",
      },
      {
        countryId: india.id,
        name: "University of Delhi",
        type: "PUBLIC",
        city: "Delhi",
        englishTaught: true,
        description: "One of India's largest and most prestigious public universities.",
      },
      {
        countryId: india.id,
        name: "Indian Institute of Science",
        type: "PUBLIC",
        city: "Bangalore",
        englishTaught: true,
        description: "Leading institute for advanced scientific and technological research.",
      }
    );
  }

  if (china) {
    extraUniversities.push(
      {
        countryId: china.id,
        name: "Tsinghua University",
        type: "PUBLIC",
        city: "Beijing",
        englishTaught: true,
        description: "One of the most prestigious universities in China and Asia.",
      },
      {
        countryId: china.id,
        name: "Peking University",
        type: "PUBLIC",
        city: "Beijing",
        englishTaught: true,
        description: "A major research university in Beijing.",
      },
      {
        countryId: china.id,
        name: "Fudan University",
        type: "PUBLIC",
        city: "Shanghai",
        englishTaught: true,
        description: "A comprehensive university located in Shanghai.",
      }
    );
  }

  for (const u of extraUniversities) {
    const slug = slugify(u.name);
    await prisma.university.upsert({
      where: { slug },
      update: { ...u },
      create: { slug, ...u },
    });
    console.log(`Upserted ${u.name}`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
