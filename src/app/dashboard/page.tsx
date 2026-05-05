import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { getSavedUniversities, getApplications, getChecklist } from '@/actions/user';
import { BookmarkX } from 'lucide-react';
import { MapPin, Bookmark, ClipboardList, Briefcase, GraduationCap, ExternalLink, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { removeSavedUniversity, toggleChecklistItem } from '@/actions/user';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT:      { bg: 'bg-zinc-100',   text: 'text-zinc-600',   label: 'Draft'      },
  APPLIED:    { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Applied'    },
  OFFER:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Offer'      },
  REJECTED:   { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Rejected'   },
  WAITLISTED: { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Waitlisted' },
};

const CHECKLIST_LABELS: Record<string, { label: string; icon: string }> = {
  PASSPORT:        { label: 'Valid Passport',          icon: '🛂' },
  TRANSCRIPT:      { label: 'Academic Transcripts',    icon: '📄' },
  SOP:             { label: 'Statement of Purpose',    icon: '✍️'  },
  LOR:             { label: 'Letters of Recommendation', icon: '📨' },
  IELTS:           { label: 'IELTS / TOEFL Score',     icon: '🗣️'  },
  RESUME:          { label: 'Updated Resume/CV',       icon: '📋' },
  VISA_FORM:       { label: 'Visa Application Form',   icon: '📝' },
  FINANCIAL_PROOF: { label: 'Financial Proof / Funds', icon: '💰' },
};

async function UnsaveButton({ universityId }: { universityId: string }) {
  async function action() {
    'use server';
    await removeSavedUniversity(universityId);
  }
  return (
    <form action={action}>
      <button
        type="submit"
        className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition"
        title="Remove from saved"
      >
        <BookmarkX className="w-4 h-4" />
      </button>
    </form>
  );
}

async function ChecklistToggle({ type, done }: { type: string; done: boolean }) {
  async function action() {
    'use server';
    await toggleChecklistItem(type, !done);
  }
  return (
    <form action={action}>
      <button type="submit" className="flex-shrink-0">
        {done
          ? <CheckCircle2 className="w-5 h-5 text-green-500" />
          : <Circle className="w-5 h-5 text-zinc-300 hover:text-indigo-400 transition" />
        }
      </button>
    </form>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const [savedUniversities, applications, checklist] = await Promise.all([
    getSavedUniversities(),
    getApplications(),
    getChecklist(),
  ]);

  const allChecklistTypes = Object.keys(CHECKLIST_LABELS);
  const checklistMap = new Map(checklist.map(c => [c.type, c.done]));
  const completedCount = checklist.filter(c => c.done).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#212121]">
              Welcome back, {session.user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="mt-1 text-zinc-500 text-sm">
              {session.user?.role === 'ADMIN' ? 'Administrator Account' : 'Student Dashboard'}
            </p>
          </div>
          <div className="flex gap-3">
            {session.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition"
              >
                Admin Panel →
              </Link>
            )}
            <Link
              href="/search"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
            >
              <GraduationCap className="w-4 h-4" /> Browse Universities
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Saved Universities', value: savedUniversities.length, icon: '🔖', color: 'bg-indigo-50 border-indigo-100' },
            { label: 'Applications', value: applications.length, icon: '📋', color: 'bg-blue-50 border-blue-100' },
            { label: 'Docs Completed', value: `${completedCount}/${allChecklistTypes.length}`, icon: '✅', color: 'bg-green-50 border-green-100' },
            { label: 'Offers Received', value: applications.filter(a => a.status === 'OFFER').length, icon: '🎉', color: 'bg-amber-50 border-amber-100' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border ${stat.color} bg-white p-5 shadow-sm`}>
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold text-[#212121]">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Saved Universities — spans 2 cols */}
          <div className="md:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100">
                  <Bookmark className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-[#212121]">Saved Universities</h2>
              </div>
              <Link href="/search" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                Browse more <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {savedUniversities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-4xl mb-3">📌</p>
                <p className="font-semibold text-[#212121]">No saved universities yet</p>
                <p className="text-sm text-zinc-500 mt-1 mb-4">Search and bookmark universities to view them here.</p>
                <Link
                  href="/search"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Start Searching
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedUniversities.map((uni) => (
                  <div
                    key={uni.id}
                    className="flex items-start justify-between gap-3 p-4 rounded-2xl border border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#212121] truncate">{uni.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        <span>{uni.city}, {uni.country.name}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {uni.rankingGlobal && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs border border-amber-100">
                            ⭐ #{uni.rankingGlobal}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">
                          {uni.courses.length} courses
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {uni.websiteUrl && (
                        <a
                          href={uni.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition"
                          title="Official Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/universities/${uni.slug}`}
                        className="p-1.5 rounded-lg hover:bg-indigo-100 text-zinc-400 hover:text-indigo-600 transition"
                        title="View details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <UnsaveButton universityId={uni.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Application Tracker */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-xl bg-blue-100">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-[#212121]">Applications</h2>
              </div>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">📝</p>
                  <p className="text-sm text-zinc-500">No applications yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {applications.map((app) => {
                    const s = STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT;
                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-100">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#212121] truncate">
                            {app.targetUniversitySlug || 'University'}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">{app.targetCourseSlug || 'Course TBD'}</p>
                        </div>
                        <span className={`flex-shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Document Checklist */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-green-100">
                    <Briefcase className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[#212121]">Doc Checklist</h2>
                </div>
                <span className="text-xs font-semibold text-green-600">
                  {completedCount}/{allChecklistTypes.length}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-zinc-100 mb-5">
                <div
                  className="h-1.5 rounded-full bg-green-500 transition-all"
                  style={{ width: `${Math.round((completedCount / allChecklistTypes.length) * 100)}%` }}
                />
              </div>
              <div className="space-y-2">
                {allChecklistTypes.map((type) => {
                  const done = checklistMap.get(type as any) ?? false;
                  const info = CHECKLIST_LABELS[type];
                  return (
                    <div
                      key={type}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition ${done ? 'opacity-60' : ''}`}
                    >
                      <ChecklistToggle type={type} done={done} />
                      <span className="text-sm">
                        <span className="mr-1.5">{info.icon}</span>
                        <span className={done ? 'line-through text-zinc-400' : 'text-[#212121]'}>
                          {info.label}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Profile Row */}
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#212121] mb-4">Profile</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {session.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                {(session.user?.name || session.user?.email || 'S')[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-500 text-xs">Name</p>
                <p className="font-semibold text-[#212121]">{session.user?.name || '—'}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Email</p>
                <p className="font-semibold text-[#212121]">{session.user?.email || '—'}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Role</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${
                  session.user?.role === 'ADMIN'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {session.user?.role === 'ADMIN' ? 'Administrator' : 'Student'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
