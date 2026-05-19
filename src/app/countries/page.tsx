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
            className="group rounded-3xl border border-black/5 bg-gradient-to-br from-white/95 to-zinc-50 p-6 shadow-sm transition-transform hover:scale-105 hover:shadow-lg dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
          >
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Official languages: {c.officialLanguages.slice(0, 3).join(", ")}
              {c.officialLanguages.length > 3 ? "…" : ""}
            </p>
            <div className="mt-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-medium text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 group-hover:bg-indigo-100 dark:bg-indigo-600 dark:text-white dark:border-indigo-500">
                View details
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

