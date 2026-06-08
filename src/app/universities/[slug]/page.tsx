import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { MapPin, Globe, GraduationCap, Building, Briefcase, ChevronRight, DollarSign, Calendar, Target, Shield, LayoutGrid } from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden selection:bg-indigo-500/30">
      {/* Animated Dark Gradient Background Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0B0E14] to-[#111827]">
        <div className="absolute left-[-200px] top-[100px] h-[800px] w-[800px] rounded-full bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent blur-[120px] animate-pulse-slow" />
        <div className="absolute right-[-200px] top-[400px] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-600/10 via-blue-600/5 to-transparent blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 relative z-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-zinc-400 mb-8 font-medium">
          <a href="/search" className="hover:text-white transition-colors">Universities</a>
          <ChevronRight className="w-4 h-4" />
          <a href={`/search?country=${u.country.slug}`} className="hover:text-white transition-colors">{u.country.name}</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-500">{u.city}</span>
        </nav>

        {/* Header Section */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 mb-10 relative overflow-hidden group">
          <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl rounded-full`}></div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {u.type} UNIVERSITY
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-400">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {u.city}, {u.country.name}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                {u.name}
              </h1>
              
              <p className="max-w-3xl text-lg leading-relaxed text-zinc-300">
                {u.description}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  {u.rankingGlobal ? `Global rank ~${u.rankingGlobal}` : "Unranked"}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  <GraduationCap className="w-4 h-4 text-pink-400" />
                  {u.englishTaught ? "English-taught" : "Local language"}
                </div>
                {u.websiteUrl && (
                  <a
                    className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-5 py-2 text-sm font-bold text-indigo-300 transition-all hover:bg-indigo-500/30 hover:text-indigo-200"
                    href={u.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Official website <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Programs & Courses Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <LayoutGrid className="w-6 h-6 text-indigo-400" />
                Programs & Courses
              </h2>
              <p className="mt-1 text-sm font-medium text-zinc-400">
                {u.courses.length} program{u.courses.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2">
            {u.courses.map((c) => (
              <div
                key={c.id}
                className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                    {c.name}
                  </h3>
                  <span className="shrink-0 font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs uppercase tracking-wider">
                    {c.degreeType}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl text-zinc-300">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span><strong className="text-white">${c.tuitionFeeUsd.toLocaleString()}</strong> / year • {c.durationMonths} months</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-1 text-zinc-400">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Intakes: <strong className="text-zinc-200">{c.intakeMonths.join(", ")}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-1 text-zinc-400">
                    <Target className="w-4 h-4 text-pink-400" />
                    <span>IELTS <strong className="text-zinc-200">{c.ieltsMin ?? "—"}</strong> / TOEFL <strong className="text-zinc-200">{c.toeflMin ?? "—"}</strong></span>
                  </div>
                </div>
              </div>
            ))}
            
            {u.courses.length === 0 && (
              <div className="col-span-2 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                <p className="text-zinc-400">No courses listed for this university yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Accommodations Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Building className="w-6 h-6 text-cyan-400" />
              Nearby Accommodations
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-400">
              {u.accommodations.length} accommodation option{u.accommodations.length !== 1 ? "s" : ""} found
            </p>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {u.accommodations.map((acc) => (
              <div
                key={acc.id}
                className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <p className="font-bold text-white text-lg leading-tight">{acc.name}</p>
                    <p className="text-xs font-semibold text-cyan-400 mt-1 uppercase tracking-wider">{acc.type}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-bold text-cyan-300">
                    {acc.distanceKm.toFixed(1)} km
                  </span>
                </div>
                
                <div className="space-y-3 text-sm font-medium text-zinc-400">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span><strong className="text-white text-lg">${acc.monthlyRentUsd}</strong> / mo</span>
                  </div>
                  <div className="flex items-start gap-3 px-2 pt-1">
                    <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <span className="leading-snug text-zinc-300">{acc.address}</span>
                  </div>
                  <div className="flex gap-2 text-xs px-2 pt-2">
                    <span className="flex items-center gap-1 bg-white/10 text-zinc-300 px-2 py-1.5 rounded-lg">
                      <Shield className="w-3 h-3" /> Safety: {acc.safetyScore}/100
                    </span>
                    {acc.furnished ? (
                      <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1.5 rounded-lg border border-indigo-500/20">Furnished</span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-1.5 rounded-lg border border-amber-500/20">Unfurnished</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {u.accommodations.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                <p className="text-zinc-400">No accommodations listed nearby yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Jobs Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-pink-400" />
              Nearby Job Opportunities
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-400">
              {u.jobs.length} job{u.jobs.length !== 1 ? "s" : ""} available
            </p>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2">
            {u.jobs.map((job) => (
              <div
                key={job.id}
                className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,114,182,0.1)] hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2 mb-5">
                  <div className="flex-1">
                    <p className="font-bold text-white text-xl leading-tight">{job.title}</p>
                    <p className="text-sm font-semibold text-pink-400 mt-1">{job.companyName}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 text-xs font-bold text-pink-300">
                    {job.distanceKm.toFixed(1)} km
                  </span>
                </div>
                
                <div className="space-y-3 text-sm font-medium text-zinc-400">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl">
                    <span className="bg-white/10 px-2.5 py-1 rounded border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                      {job.employmentType.replace("_", " ")}
                    </span>
                    <span className="font-bold text-white">{job.salaryNote}</span>
                  </div>
                  
                  <div className="px-2 pt-2 flex justify-between items-center">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${job.visaSponsorship ? "text-green-400" : "text-zinc-500"}`}>
                      {job.visaSponsorship ? (
                        <><Shield className="w-3.5 h-3.5" /> Visa sponsorship available</>
                      ) : (
                        "No visa sponsorship"
                      )}
                    </span>
                    
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-white bg-indigo-500 px-4 py-2 rounded-xl transition hover:bg-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      >
                        Apply now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {u.jobs.length === 0 && (
              <div className="col-span-2 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                <p className="text-zinc-400">No jobs listed nearby yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* University Location */}
        <section>
          <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden group">
            <div className={`absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 blur-3xl rounded-full`}></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                  Campus Location
                </h2>
                <p className="text-zinc-400 font-medium">
                  {u.city}, {u.country.name}
                </p>
                
                <div className="mt-6 inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div>
                    <p className="font-bold text-zinc-300 text-sm">GPS Coordinates</p>
                    <p className="mt-1 font-mono text-xs font-medium text-zinc-500">
                      LAT {u.lat?.toFixed(6) ?? "—"} <br/>
                      LNG {u.lng?.toFixed(6) ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 h-48 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="text-center relative z-10">
                  <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xl mx-auto mb-3 border border-indigo-500/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-400">Map Integration Available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
