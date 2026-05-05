'use server';

import { redirect } from 'next/navigation';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const tab = params.tab || 'dashboard';
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login');
  }

  const universities = await prisma.university.findMany({
    include: {
      country: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage all content and users
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-black/10 dark:border-white/10">
          {(['dashboard', 'universities', 'accommodations', 'jobs', 'users'] as const).map((t) => (
            <Link
              href={`?tab=${t}`}
              key={t}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                tab === t
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Link>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Universities</p>
              <p className="text-3xl font-bold">{universities.length}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Accommodations</p>
              <p className="text-3xl font-bold">50+</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Jobs</p>
              <p className="text-3xl font-bold">30+</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Users</p>
              <p className="text-3xl font-bold">N/A</p>
            </div>
          </div>
        )}

        {/* Universities Tab */}
        {tab === 'universities' && (
          <div>
            <button className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Add University
            </button>
            <div className="bg-white rounded-lg shadow dark:bg-gray-800 overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Country</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ranking</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((uni) => (
                    <tr key={uni.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-3 font-medium">{uni.name}</td>
                      <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">{uni.city}</td>
                      <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">{uni.country.name}</td>
                      <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                        {uni.rankingGlobal ? `#${uni.rankingGlobal}` : '-'}
                      </td>
                      <td className="px-6 py-3 text-right flex justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-100 text-red-600 rounded dark:hover:bg-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {['accommodations', 'jobs', 'users'].includes(tab) && (
          <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              {tab.charAt(0).toUpperCase() + tab.slice(1)} management coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

