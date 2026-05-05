import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const country = typeof sp.country === "string" ? sp.country : undefined;

  const universities = await prisma.university.findMany({
    where: country ? { country: { slug: country } } : undefined,
    include: { country: true, courses: { take: 3, orderBy: { tuitionFeeUsd: "asc" } } },
    orderBy: [{ rankingGlobal: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Universities</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Filter and compare universities by country, city, ranking, and English-taught availability.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {universities.map((u) => (
          <a
            key={u.id}
            href={`/universities/${u.slug}`}
            className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">{u.name}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {u.city}, {u.country.name} •{" "}
                  {u.rankingGlobal ? `Global rank ~${u.rankingGlobal}` : "Ranking: —"}
                </p>
              </div>
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {u.type}
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              {u.courses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20"
                >
                  <span className="text-zinc-800 dark:text-zinc-100">
                    {c.name} ({c.degreeType})
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    ${c.tuitionFeeUsd.toLocaleString()}/yr
                  </span>
                </div>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

