import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CountriesPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Countries</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Explore visa process, cost of living, work rules, scholarships, and top
          student cities across Asia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <a
            key={c.id}
            href={`/countries/${c.slug}`}
            className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-lg font-semibold">{c.name}</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Official languages: {c.officialLanguages.slice(0, 3).join(", ")}
              {c.officialLanguages.length > 3 ? "…" : ""}
            </p>
            <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 dark:border-white/10 dark:bg-white/10">
                View details
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

