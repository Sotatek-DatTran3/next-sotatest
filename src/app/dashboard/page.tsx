'use client';

import ClientOnly from '@/components/ClientOnly';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DashboardContent() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.username}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your Dashboard!
              </h2>
              <p className="text-gray-600 mb-8">
                You have successfully logged in. This is your protected dashboard area.
              </p>

              <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
                <div className="space-y-2 text-left">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Username:</strong> {user?.username}</p>
                  <p><strong>User ID:</strong> {user?.id}</p>
                  <p><strong>Confirmed:</strong> {user?.confirmed ? 'Yes' : 'No'}</p>
                  <p><strong>Provider:</strong> {user?.provider}</p>
                  <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <DashboardContent />
    </ClientOnly>
  );
}
