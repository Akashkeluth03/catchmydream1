'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { loginUser } from '@/actions/auth';


export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginUser, { error: '' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
            <p className="mt-2 text-indigo-200">Sign in to your Study in Asia account</p>
          </div>

          {/* Email & Password Form */}
          <form action={formAction} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-indigo-100 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-100 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur transition"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-100 text-sm">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold transition hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 active:scale-95"
            >
              {pending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-sm text-indigo-200">or continue with</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button 
              onClick={() => signIn('google')}
              type="button"
              className="p-3 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center gap-2">
              <span className="text-lg">🔍</span>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              onClick={() => signIn('apple')}
              type="button"
              className="p-3 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center gap-2">
              <span className="text-lg">🍎</span>
              <span className="text-sm font-medium">Apple</span>
            </button>
            <button 
              onClick={() => signIn('github')}
              type="button"
              className="p-3 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center gap-2">
              <span className="text-lg">⚫</span>
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-sm text-indigo-200">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-cyan-300 font-semibold hover:text-cyan-200 transition">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
