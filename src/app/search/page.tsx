import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { MapPin, DollarSign, Briefcase, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SaveButton } from '@/components/save-button';
import { getSavedUniversityIds } from '@/actions/user';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const country = typeof sp.country === 'string' ? sp.country : undefined;
  const city = typeof sp.city === 'string' ? sp.city : undefined;
  const universitySlug = typeof sp.university === 'string' ? sp.university : undefined;
  const courseSlug = typeof sp.course === 'string' ? sp.course : undefined;
  const budgetRaw = typeof sp.budget === 'string' ? sp.budget.trim() : undefined;
  const budget = budgetRaw ? Number.parseInt(budgetRaw.replace(/[^0-9]/g, ''), 10) : undefined;
  const genericQuery = typeof sp.q === 'string' ? sp.q : undefined;

  const session = await auth();
  const savedIds = session ? await getSavedUniversityIds() : [];

  const universities = await prisma.university.findMany({
    where: {
      AND: [
        country ? { country: { slug: country } } : {},
        city ? { city: city } : {},
        universitySlug ? { slug: universitySlug } : {},
        genericQuery ? { name: { contains: genericQuery, mode: 'insensitive' } } : {},
        courseSlug
          ? { courses: { some: { slug: courseSlug } } }
          : budget
          ? { courses: { some: { tuitionFeeUsd: { lte: budget } } } }
          : {},
      ],
    },
    include: {
      country: true,
      courses: true,
      accommodations: true,
      jobs: true,
    },
  });

  const accommodations = await prisma.accommodation.findMany({
    where: {
      AND: [
        country ? { university: { country: { slug: country } } } : {},
        city ? { university: { city: city } } : {},
        universitySlug ? { university: { slug: universitySlug } } : {},
      ],
    },
    include: { university: { include: { country: true } } },
  });

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        country ? { university: { country: { slug: country } } } : {},
        city ? { city: city } : {},
        universitySlug ? { university: { slug: universitySlug } } : {},
      ],
    },
    include: { university: { include: { country: true } } },
  });

  const hasResults = universities.length > 0 || accommodations.length > 0 || jobs.length > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#212121]">Search Results</h1>
          <p className="mt-2 text-zinc-500 text-sm">
            {[
              genericQuery && `Search: "${genericQuery}"`,
              country && `Country: ${country}`,
              city && `City: ${city}`,
              universitySlug && `University: ${universities[0]?.name || universitySlug}`,
              courseSlug && `Course: ${courseSlug}`,
              budget && `Budget: $${budget.toLocaleString()}/year`,
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
        </div>

        {/* Universities */}
        {universities.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-indigo-100">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-[#212121]">Universities ({universities.length})</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {universities.map((uni) => (
                <div
                  key={uni.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-[#212121] leading-tight">{uni.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-zinc-500">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{uni.city}, {uni.country.name}</span>
                      </div>
                    </div>
                    <SaveButton
                      universityId={uni.id}
                      initialSaved={savedIds.includes(uni.id)}
                      isLoggedIn={!!session}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {uni.rankingGlobal && (
                      <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                        ⭐ Rank #{uni.rankingGlobal}
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                      📚 {uni.courses.length} course{uni.courses.length !== 1 ? 's' : ''}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-zinc-50 text-zinc-600 text-xs font-medium border border-zinc-200">
                      {uni.type}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      href={`/universities/${uni.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                      View Details →
                    </Link>
                    {uni.websiteUrl && (
                      <a
                        href={uni.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Accommodations */}
        {accommodations.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-green-100">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-[#212121]">Accommodations ({accommodations.length})</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {accommodations.map((acc) => {
                const distance = calculateDistance(
                  acc.lat || 0, acc.lng || 0,
                  acc.university.lat || 0, acc.university.lng || 0
                );
                return (
                  <div key={acc.id} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h3 className="font-bold text-[#212121]">{acc.name}</h3>
                    <p className="text-sm text-zinc-500 mt-0.5">Near {acc.university.name}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 text-green-700">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">${acc.monthlyRentUsd}/mo</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 text-blue-700">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{distance.toFixed(1)} km away</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded-md bg-zinc-100 text-zinc-600">{acc.type}</span>
                      {acc.furnished && <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">Furnished</span>}
                      <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700">Safety: {acc.safetyScore}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Jobs */}
        {jobs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-cyan-100">
                <Briefcase className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="text-xl font-bold text-[#212121]">Jobs ({jobs.length})</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-[#212121]">{job.title}</h3>
                  <p className="text-sm text-zinc-500 mt-0.5">{job.companyName} • {job.city}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-zinc-100 text-zinc-700">{job.employmentType}</span>
                    {job.salaryNote && (
                      <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />{job.salaryNote}
                      </span>
                    )}
                    {job.visaSponsorship && (
                      <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">✓ Visa Sponsorship</span>
                    )}
                  </div>
                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition"
                    >
                      Apply Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!hasResults && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-16 text-center shadow-sm">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-[#212121] mb-2">No results found</h3>
            <p className="text-zinc-500 mb-6">Try adjusting your search criteria or explore all countries.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              ← Back to Search
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
