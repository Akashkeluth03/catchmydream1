import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const country = await prisma.country.findUnique({
    where: { slug },
    include: {
      universities: {
        orderBy: { rankingGlobal: "asc" },
        include: { 
          courses: { orderBy: { tuitionFeeUsd: "asc" } },
          accommodations: true
        },
      },
      scholarships: { take: 6, orderBy: { createdAt: "desc" } },
    },
  });

  if (!country) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Country explorer
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {country.name}
        </h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          {country.overview}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold">Cost of living</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {country.costOfLivingNote}
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold">Tuition (average)</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {country.tuitionAvgNote}
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold">Visa process</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {country.visaProcess}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold">Work permit rules</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {country.workPermitRules}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {country.topStudentCities.map((city) => (
              <span
                key={city}
                className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold">Official languages</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {country.officialLanguages.map((l) => (
              <span
                key={l}
                className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Universities and Course Offers
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Explore all available courses with exact budget calculations including tuition and accommodation costs.
          </p>
        </div>

        <div className="space-y-8">
          {country.universities.map((u) => {
            const avgAccommodation = u.accommodations.length > 0 
              ? u.accommodations.reduce((sum, a) => sum + a.monthlyRentUsd, 0) / u.accommodations.length 
              : 0;
            return (
              <div
                key={u.id}
                className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <a href={`/universities/${u.slug}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">{u.name}</p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {u.city} •{" "}
                        {u.rankingGlobal ? `Global rank ~${u.rankingGlobal}` : "—"}
                      </p>
                    </div>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                      {u.englishTaught ? "English taught" : "Local language"}
                    </span>
                  </div>
                </a>

                <div className="mt-4 space-y-3">
                  {u.courses.map((c) => {
                    const totalTuition = Math.ceil(c.tuitionFeeUsd * (c.durationMonths / 12));
                    const totalAccommodation = Math.ceil(avgAccommodation * c.durationMonths);
                    const totalBudget = totalTuition + totalAccommodation;
                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-black/20"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                              {c.name} ({c.degreeType})
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Duration: {c.durationMonths} months • Intakes: {c.intakeMonths.join(", ")}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              IELTS: {c.ieltsMin ?? "—"} • TOEFL: {c.toeflMin ?? "—"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                              ${totalBudget.toLocaleString()}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Total budget
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <div>Tuition: ${totalTuition.toLocaleString()}</div>
                          <div>Accommodation: ${totalAccommodation.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

