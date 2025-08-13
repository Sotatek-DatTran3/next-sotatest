'use client';

import { useAuth } from '@/contexts/AuthContext';

function DashboardContent() {
  const { user, loading } = useAuth();


  const userInfo = [
    { label: 'Email', value: user?.email },
    { label: 'Username', value: user?.username },
    { label: 'User ID', value: user?.id },
    { label: 'Confirmed', value: user?.confirmed ? 'Yes' : 'No' },
    { label: 'Provider', value: user?.provider },
    {
      label: 'Member since',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        : 'N/A'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  {userInfo.map((info, index) => (
                    <p key={index}>
                      <strong>{info.label}:</strong> {info.value}
                    </p>
                  ))}
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
  return <DashboardContent />;
}
