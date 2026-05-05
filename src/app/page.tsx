import { prisma } from "@/lib/db";
import { HomeSearch } from "@/components/home-search";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const countries = await prisma.country.findMany({
    select: { slug: true, name: true },
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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent">
        <div className="absolute left-1/2 top-[-200px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl opacity-50" />
        <div className="absolute bottom-[-260px] right-[-180px] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl opacity-50" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
              Asia-focused admissions platform • MVP countries live
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl text-zinc-900">
              Study smarter in Asia.
              <span className="block text-zinc-500">
              We make applying to universities in Asia seamless, transparent, and absolutely free.
            </span>
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600">
              Search top universities across Singapore, Malaysia, UAE, Japan,
              South Korea, and Thailand. Compare tuition, eligibility, language
              requirements, and student living costs.
            </p>

            <HomeSearch countries={countries} universities={universities} />

            <div className="flex flex-wrap gap-3">
              {[
                "Singapore",
                "Malaysia",
                "United Arab Emirates",
                "Japan",
                "South Korea",
                "Thailand",
              ].map((c) => (
                <Link
                  key={c}
                  href="/countries"
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-zinc-500">Top universities</p>
              <div className="mt-4 space-y-3">
                {[
                  { name: "NUS", meta: "Singapore • Global rank ~8" },
                  { name: "NTU", meta: "Singapore • Global rank ~15" },
                  { name: "University of Tokyo", meta: "Japan • Global rank ~28" },
                  { name: "SNU", meta: "South Korea • Global rank ~41" },
                ].map((u) => (
                  <div
                    key={u.name}
                    className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">{u.name}</p>
                      <p className="text-sm text-zinc-500">{u.meta}</p>
                    </div>
                    <span className="rounded-full bg-white border px-3 py-1 text-xs text-zinc-600">
                      View
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Visa & documents tracker",
                  desc: "A checklist that stays aligned with your application timeline.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <p className="font-semibold text-zinc-900">{card.title}</p>
                  <h3 className="mb-2 text-xl font-bold text-[#212121]">
                  Official University Partners
                </h3>
                <p className="text-zinc-600">
                  We work directly with 50+ top universities across Asia. No middlemen, no hidden fees.
                </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Country explorer",
              desc: "Visa rules, living costs, scholarships, and best cities.",
            },
            {
              title: "University finder",
              desc: "Filter by city, degree type, fees, English-taught programs.",
            },
            {
              title: "Course finder",
              desc: "Compare duration, intakes, tuition, and language requirements.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-white font-semibold">{f.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </section>
      </section>
    </div>
  );
}
