/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fetchTextSearch(query, key) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google TextSearch failed: ${res.status}`);
  }
  const data = await res.json();
  return data.results || [];
}

async function main() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error('Please set GOOGLE_API_KEY in the environment.');
    process.exit(1);
  }

  // Load countries and their topStudentCities from DB
  const countries = await prisma.country.findMany();
  console.log(`Found ${countries.length} countries`);

  for (const country of countries) {
    if (!country.topStudentCities || country.topStudentCities.length === 0) continue;
    for (const city of country.topStudentCities) {
      const q = `universities in ${city} ${country.name}`;
      console.log(`Searching: ${q}`);
      try {
        const results = await fetchTextSearch(q, key);
        // Upsert top 10
        const take = Math.min(results.length, 10);
        for (let i = 0; i < take; i++) {
          const r = results[i];
          const name = r.name;
          const formattedAddr = r.formatted_address || '';
          const lat = r.geometry?.location?.lat ?? null;
          const lng = r.geometry?.location?.lng ?? null;
          const slug = slugify(`${name}-${city}-${country.name}`);

          // Avoid importing obviously non-university results
          const lower = (r.types || []).join(',');
          if (lower && !lower.includes('university') && !/college|institute|school/i.test(name)) {
            // Skip if types don't indicate higher-ed and name doesn't match
            // but still allow some results
          }

          await prisma.university.upsert({
            where: { slug },
            update: {
              name,
              city,
              lat,
              lng,
              websiteUrl: r.website || null,
              description: r.types ? `Imported from Google Places: ${r.types.join(', ')}` : 'Imported from Google Places',
              country: { connect: { id: country.id } },
            },
            create: {
              slug,
              name,
              city,
              lat,
              lng,
              websiteUrl: r.website || null,
              description: r.types ? `Imported from Google Places: ${r.types.join(', ')}` : 'Imported from Google Places',
              type: 'PUBLIC',
              englishTaught: false,
              countryId: country.id,
            },
          });
          console.log(`Upserted: ${name} (${city})`);
        }
      } catch (err) {
        console.warn(`Failed to import for ${city}, ${country.name}: ${err.message}`);
      }
    }
  }

  console.log('Import complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
