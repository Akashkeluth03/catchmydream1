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
  const extraUnis = [
    // India
    { iso2: "IN", city: "Bangalore", name: "Indian Institute of Science" },
    { iso2: "IN", city: "Bangalore", name: "Bangalore University" },
    { iso2: "IN", city: "Delhi", name: "University of Delhi" },
    { iso2: "IN", city: "Delhi", name: "Jawaharlal Nehru University" },
    { iso2: "IN", city: "Mumbai", name: "Indian Institute of Technology Bombay" },
    { iso2: "IN", city: "Mumbai", name: "University of Mumbai" },
    { iso2: "IN", city: "Pune", name: "Savitribai Phule Pune University" },
    { iso2: "IN", city: "Pune", name: "Symbiosis International University" },
    { iso2: "IN", city: "Hyderabad", name: "University of Hyderabad" },
    { iso2: "IN", city: "Hyderabad", name: "Osmania University" },
    // China
    { iso2: "CN", city: "Beijing", name: "Tsinghua University" },
    { iso2: "CN", city: "Beijing", name: "Peking University" },
    { iso2: "CN", city: "Shanghai", name: "Fudan University" },
    { iso2: "CN", city: "Shanghai", name: "Shanghai Jiao Tong University" },
    { iso2: "CN", city: "Xi'an", name: "Xi'an Jiaotong University" },
    { iso2: "CN", city: "Xi'an", name: "Northwestern Polytechnical University" },
    { iso2: "CN", city: "Wuhan", name: "Wuhan University" },
    { iso2: "CN", city: "Wuhan", name: "Huazhong University of Science and Technology" },
    // Vietnam
    { iso2: "VN", city: "Hanoi", name: "Vietnam National University, Hanoi" },
    { iso2: "VN", city: "Hanoi", name: "Hanoi University of Science and Technology" },
    { iso2: "VN", city: "Ho Chi Minh City", name: "Vietnam National University, Ho Chi Minh City" },
    { iso2: "VN", city: "Ho Chi Minh City", name: "RMIT University Vietnam" },
    { iso2: "VN", city: "Da Nang", name: "The University of Da Nang" },
    { iso2: "VN", city: "Da Nang", name: "Duy Tan University" },
    // Philippines
    { iso2: "PH", city: "Manila", name: "University of the Philippines Diliman" },
    { iso2: "PH", city: "Manila", name: "Ateneo de Manila University" },
    { iso2: "PH", city: "Cebu", name: "University of San Carlos" },
    { iso2: "PH", city: "Cebu", name: "Cebu Normal University" },
    { iso2: "PH", city: "Davao", name: "Ateneo de Davao University" },
    { iso2: "PH", city: "Davao", name: "University of Southeastern Philippines" },
    // Indonesia
    { iso2: "ID", city: "Jakarta", name: "Universitas Indonesia" },
    { iso2: "ID", city: "Jakarta", name: "Universitas Negeri Jakarta" },
    { iso2: "ID", city: "Surabaya", name: "Airlangga University" },
    { iso2: "ID", city: "Surabaya", name: "Sepuluh Nopember Institute of Technology" },
    { iso2: "ID", city: "Bandung", name: "Bandung Institute of Technology" },
    { iso2: "ID", city: "Bandung", name: "Padjadjaran University" },
    // Pakistan
    { iso2: "PK", city: "Islamabad", name: "Quaid-i-Azam University" },
    { iso2: "PK", city: "Islamabad", name: "National University of Sciences and Technology (NUST)" },
    { iso2: "PK", city: "Lahore", name: "Lahore University of Management Sciences (LUMS)" },
    { iso2: "PK", city: "Lahore", name: "University of the Punjab" },
    { iso2: "PK", city: "Karachi", name: "University of Karachi" },
    { iso2: "PK", city: "Karachi", name: "Institute of Business Administration (IBA)" },
    { iso2: "PK", city: "Peshawar", name: "University of Peshawar" },
    { iso2: "PK", city: "Peshawar", name: "Institute of Management Sciences (IMSciences)" },
    // Bangladesh
    { iso2: "BD", city: "Dhaka", name: "University of Dhaka" },
    { iso2: "BD", city: "Dhaka", name: "Bangladesh University of Engineering and Technology (BUET)" },
    { iso2: "BD", city: "Chittagong", name: "University of Chittagong" },
    { iso2: "BD", city: "Chittagong", name: "Chittagong University of Engineering & Technology (CUET)" }
  ];

  for (const item of extraUnis) {
    const country = await prisma.country.findUnique({ where: { iso2: item.iso2 } });
    if (!country) {
      console.log(`Country ${item.iso2} not found, skipping ${item.name}`);
      continue;
    }

    const slug = slugify(item.name);
    await prisma.university.upsert({
      where: { slug },
      update: {
        name: item.name,
        type: "PUBLIC",
        city: item.city,
        countryId: country.id,
        englishTaught: true,
        description: `A well-known university located in ${item.city}, offering various programs.`
      },
      create: {
        slug,
        name: item.name,
        type: "PUBLIC",
        city: item.city,
        countryId: country.id,
        englishTaught: true,
        description: `A well-known university located in ${item.city}, offering various programs.`
      }
    });
    console.log(`Added ${item.name} in ${item.city}`);
  }
  console.log("Done!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
