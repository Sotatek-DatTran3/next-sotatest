'use client';

import { authAPI } from '@/lib/strapi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ResetPasswordFormProps {
  code: string;
}

export function ResetPasswordForm({ code }: ResetPasswordFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword({
        code,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      });
      setSuccess(true);

      setTimeout(() => {
        router.push('/auth');
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
        err.message ||
        'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Password reset successful!</p>
          <p className="text-sm mt-1">
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/auth')}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
          >
            Go to login now →
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your new password"
          />
        </div>
      </div>

      <div>
        <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <div className="mt-1">
          <input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            required
            value={formData.passwordConfirmation}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Confirm your new password"
          />
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <ul className="list-disc list-inside space-y-1">
          <li>Password must be at least 6 characters long</li>
          <li>Both passwords must match</li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading || !formData.password || !formData.passwordConfirmation}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
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
