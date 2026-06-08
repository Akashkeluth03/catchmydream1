import { prisma } from "@/lib/db";
import { HomeSearch } from "@/components/home-search";
import Link from "next/link";
import { MapPin, Plane, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const countries = await prisma.country.findMany({
    select: { slug: true, name: true, topStudentCities: true },
    orderBy: { name: "asc" },
  });

  const universities = await prisma.university.findMany({
    select: { 
      slug: true, 
      name: true, 
      city: true,
      country: { select: { slug: true } },
      courses: { select: { slug: true, name: true, tuitionFeeUsd: true } }
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-indigo-500/30">
      {/* Animated Dark Gradient Background Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0B0E14] to-[#111827]">
        <div className="absolute left-1/4 top-[-200px] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-100px] right-[-200px] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-transparent blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Hero Copy */}
          <div className="space-y-8 lg:col-span-7 relative z-10 animate-float" style={{ animationDuration: '8s' }}>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2 text-sm text-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all hover:bg-white/10 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping absolute"></span>
              <span className="relative flex h-2 w-2 rounded-full bg-indigo-400"></span>
              Asia-focused admissions platform live
            </div>
            
            <h1 className="text-balance text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl text-white">
              Study smarter in <br/>
              <span className="text-gradient drop-shadow-sm">Asia.</span>
            </h1>
            
            <p className="max-w-xl text-pretty text-lg md:text-xl leading-relaxed text-zinc-300">
              We make applying to universities in Asia seamless, transparent, and absolutely free.
              Search top institutions, compare tuition, and kickstart your future today.
            </p>

            {/* Glassmorphic Search Component */}
            <div className="mt-8">
              <HomeSearch countries={countries} universities={universities} />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="text-zinc-500 text-sm flex items-center mr-2">Popular destinations:</span>
              {[
                "Singapore",
                "Malaysia",
                "United Arab Emirates",
                "Japan",
                "South Korea",
              ].map((c) => (
                <Link
                  key={c}
                  href="/countries"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Cards */}
          <div className="grid gap-6 lg:col-span-5 relative z-10">
            
            {/* Top Universities Glass Card */}
            <div className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <GraduationCap className="text-indigo-400 w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white">Top universities</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "NUS", meta: "Singapore • Rank #8" },
                  { name: "NTU", meta: "Singapore • Rank #15" },
                  { name: "University of Tokyo", meta: "Japan • Rank #28" },
                  { name: "SNU", meta: "South Korea • Rank #41" },
                ].map((u) => (
                  <div
                    key={u.name}
                    className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 transition-all hover:bg-white/10"
                  >
                    <div>
                      <p className="font-medium text-white group-hover:text-indigo-300 transition-colors">{u.name}</p>
                      <p className="text-xs text-zinc-400">{u.meta}</p>
                    </div>
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Card */}
            <div className="glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(236,72,153,0.1)] hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-32 bg-pink-500/10 blur-[50px] rounded-full"></div>
              <p className="font-semibold text-pink-400 text-sm mb-2 uppercase tracking-wider">Verified</p>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Official University Partners
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We work directly with 50+ top universities across Asia. No middlemen, no hidden fees. Guarantee your admission with priority processing.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Feature Grid */}
        <section className="mt-24 grid gap-6 md:grid-cols-3 relative z-10">
          {[
            {
              icon: <Plane className="w-6 h-6 text-cyan-400" />,
              title: "Country explorer",
              desc: "Visa rules, living costs, scholarships, and best cities.",
              gradient: "from-cyan-500/20 to-blue-500/5",
            },
            {
              icon: <MapPin className="w-6 h-6 text-purple-400" />,
              title: "University finder",
              desc: "Filter by city, degree type, fees, English-taught programs.",
              gradient: "from-purple-500/20 to-pink-500/5",
            },
            {
              icon: <GraduationCap className="w-6 h-6 text-amber-400" />,
              title: "Course finder",
              desc: "Compare duration, intakes, tuition, and language requirements.",
              gradient: "from-amber-500/20 to-orange-500/5",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${f.gradient} blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity`}></div>
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/5">
                {f.icon}
              </div>
              <p className="text-white font-bold text-xl mb-3">{f.title}</p>
              <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}
