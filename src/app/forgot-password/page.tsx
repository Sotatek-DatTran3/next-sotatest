'use client';

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import ClientOnly from '@/components/ClientOnly';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {code ? 'Reset your password' : 'Forgot your password?'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {code
            ? 'Enter your new password below to complete the reset process.'
            : 'No problem! Enter your email address and we\'ll send you a link to reset it.'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {code ? (
            <ResetPasswordForm code={code} />
          ) : (
            <ForgotPasswordForm />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <ForgotPasswordContent />
      </Suspense>
    </ClientOnly>
  );
}
