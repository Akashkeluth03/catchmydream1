'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';


export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/dashboard'
      });
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-4xl font-bold text-white">Create Account</h1>
            <p className="mt-2 text-indigo-200">Join Study in Asia today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-indigo-100 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-100 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-100 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-100 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold transition hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-sm text-indigo-200">or sign up with</span>
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

          {/* Sign In Link */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-sm text-indigo-200">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-300 font-semibold hover:text-cyan-200 transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
