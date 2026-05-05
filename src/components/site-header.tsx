'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

export function SiteHeader({ session }: { session: Session | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="border-b border-black/10 bg-white/70 backdrop-blur sticky top-0 z-50 dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🌏</span>
            <span className="hidden sm:inline">CatchMyDream</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
            <Link href="/countries" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Country
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-48 rounded-full border border-black/10 bg-black/5 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5"
              />
            </form>
            <Link href="/accommodation" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Accommodation
            </Link>
            <Link href="/support" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Support
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 text-amber-700 font-medium text-xs hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin
                      </Link>
                    )}
                <span className="hidden sm:inline text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-700 font-medium text-xs hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500"
                    >
                      Login or Sign up
                    </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-black/5 rounded-lg dark:hover:bg-white/10"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-black/10 space-y-3 dark:border-white/10">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/countries"
              className="block px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Country
            </Link>
            <Link
              href="/search"
              className="block px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/accommodation"
              className="block px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Accommodation
            </Link>
            <Link
              href="/support"
              className="block px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              Support
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block px-3 py-2 rounded-lg bg-amber-100 text-amber-700 font-medium dark:bg-amber-900/30 dark:text-amber-400"
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {session && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg bg-red-100 text-red-700 font-medium dark:bg-red-900/30 dark:text-red-400"
              >
                Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

