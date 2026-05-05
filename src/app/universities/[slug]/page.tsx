import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const u = await prisma.university.findUnique({
    where: { slug },
    include: {
      country: true,
      courses: { orderBy: { tuitionFeeUsd: "asc" } },
      accommodations: { orderBy: { monthlyRentUsd: "asc" } },
      jobs: { orderBy: { distanceKm: "asc" } },
      scholarships: { take: 6, orderBy: { createdAt: "desc" } },
    },
  });

  if (!u) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-zinc-500">
          {u.country.name} • {u.city} • {u.type}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#212121]">{u.name}</h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-600">
          {u.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">
            {u.rankingGlobal ? `Global rank ~${u.rankingGlobal}` : "Ranking: —"}
          </span>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {u.englishTaught ? "English-taught available" : "Local language focus"}
          </span>
          {u.websiteUrl ? (
            <a
              className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              href={u.websiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Official website →
            </a>
          ) : null}
        </div>
      </div>

      {/* Courses Section */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#212121]">Programs & Courses</h2>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {u.courses.length} program{u.courses.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {u.courses.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="font-bold text-[#212121]">
                {c.name} <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs ml-2">{c.degreeType}</span>
              </p>
              <div className="mt-4 space-y-2 text-sm text-zinc-600 font-medium">
                <div className="flex items-center gap-2 bg-zinc-50 p-2 rounded-lg">
                  <span>💰</span>
                  <span>${c.tuitionFeeUsd.toLocaleString()}/year • {c.durationMonths} months</span>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <span>📅</span>
                  <span>Intakes: {c.intakeMonths.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <span>🎯</span>
                  <span>IELTS {c.ieltsMin ?? "—"} / TOEFL {c.toeflMin ?? "—"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accommodations Section */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#212121]">Nearby Accommodations</h2>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {u.accommodations.length} accommodation option{u.accommodations.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {u.accommodations.map((acc) => (
            <div
              key={acc.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <p className="font-bold text-[#212121] leading-tight">{acc.name}</p>
                  <p className="text-xs font-semibold text-green-600 mt-1">{acc.type}</p>
                </div>
                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                  {acc.distanceKm.toFixed(1)} km
                </span>
              </div>
              <div className="space-y-2 text-sm font-medium text-zinc-600">
                <div className="flex items-center gap-2 bg-zinc-50 p-2 rounded-lg">
                  <span>💵</span>
                  <span className="font-bold text-[#212121]">${acc.monthlyRentUsd}/mo</span>
                </div>
                <p className="px-2">📍 {acc.address}</p>
                <div className="flex gap-2 text-xs px-2 mt-3">
                  <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md">Safety: {acc.safetyScore}/100</span>
                  {acc.furnished ? (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">Furnished</span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md">Unfurnished</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Jobs Section */}
      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#212121]">Nearby Job Opportunities</h2>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {u.jobs.length} job{u.jobs.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {u.jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1">
                  <p className="font-bold text-[#212121] text-lg leading-tight">{job.title}</p>
                  <p className="text-sm font-medium text-cyan-700 mt-0.5">{job.companyName}</p>
                </div>
                <span className="shrink-0 rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-700">
                  {job.distanceKm.toFixed(1)} km
                </span>
              </div>
              <div className="space-y-2 text-sm font-medium text-zinc-600">
                <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg">
                  <span className="bg-white border border-zinc-200 px-2 py-1 rounded text-xs font-bold text-zinc-700">
                    {job.employmentType.replace("_", " ")}
                  </span>
                  <span className="font-bold text-[#212121]">{job.salaryNote}</span>
                </div>
                <div className="px-2 pt-1 flex justify-between items-center">
                  <span className={job.visaSponsorship ? "text-indigo-600 font-semibold text-xs" : "text-zinc-400 text-xs"}>
                    {job.visaSponsorship ? "✓ Visa sponsorship" : "⊘ No visa sponsorship"}
                  </span>
                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-white bg-[#212121] px-3 py-1.5 rounded-lg transition hover:bg-zinc-800"
                    >
                      Apply now →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* University Location */}
      <section>
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#212121]">Location</h2>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {u.city}, {u.country.name}
          </p>
          <div className="mt-5 rounded-2xl bg-zinc-50 border border-zinc-100 p-5 text-sm text-zinc-700 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#212121]">Map Coordinates</p>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                {u.lat?.toFixed(6) ?? "—"}, {u.lng?.toFixed(6) ?? "—"}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl">
              🗺️
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

