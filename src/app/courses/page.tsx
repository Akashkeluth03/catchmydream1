import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const university = typeof sp.university === "string" ? sp.university : undefined;
  const country = typeof sp.country === "string" ? sp.country : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim() : undefined;
  const budgetRaw = typeof sp.budget === "string" ? sp.budget.trim() : undefined;
  const budget = budgetRaw ? Number.parseInt(budgetRaw.replace(/[^0-9]/g, ""), 10) : undefined;

  const courses = await prisma.course.findMany({
    where: {
      AND: [
        university ? { university: { slug: university } } : {},
        country ? { university: { country: { slug: country } } } : {},
        q ? { name: { contains: q, mode: "insensitive" } } : {},
        Number.isFinite(budget) ? { tuitionFeeUsd: { lte: budget as number } } : {},
      ],
    },
    include: { university: { include: { country: true } } },
    orderBy: [{ tuitionFeeUsd: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Courses</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Compare tuition, duration, intake months, and English test requirements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <div
            key={c.id}
            className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-lg font-semibold">{c.name}</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {c.university.name} • {c.university.city},{" "}
              {c.university.country.name}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 dark:border-white/10 dark:bg-black/20">
                <p className="text-zinc-600 dark:text-zinc-400">Degree</p>
                <p className="font-semibold">{c.degreeType}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 dark:border-white/10 dark:bg-black/20">
                <p className="text-zinc-600 dark:text-zinc-400">Tuition</p>
                <p className="font-semibold">${c.tuitionFeeUsd.toLocaleString()}/yr</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 dark:border-white/10 dark:bg-black/20">
                <p className="text-zinc-600 dark:text-zinc-400">Duration</p>
                <p className="font-semibold">{c.durationMonths} months</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3 dark:border-white/10 dark:bg-black/20">
                <p className="text-zinc-600 dark:text-zinc-400">Intakes</p>
                <p className="font-semibold">{c.intakeMonths.join(", ")}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              IELTS: {c.ieltsMin ?? "—"} • TOEFL: {c.toeflMin ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

