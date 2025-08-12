'use client';

import { authAPI } from '@/lib/strapi';
import Link from 'next/link';
import { useState } from 'react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
        err.message ||
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Password reset email sent!</p>
          <p className="text-sm mt-1">
            Please check your email for instructions on how to reset your password.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <button
            onClick={() => setSuccess(false)}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
          >
            Send another email
          </button>

          <div className="pt-4">
            <Link
              href="/auth"
              className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email address"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          We'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading || !email}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send reset email'}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/auth"
          className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
        >
          ← Back to sign in
        </Link>
      </div>
    </form>
  );
}
