'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Healthcare Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.email} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Patient Profile Card */}
            <Link href="/patient-profile">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">👤</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Patient Profile
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {user.role === 'patient' ? 'My Profile' : 'Manage Patients'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      {user.role === 'patient' 
                        ? 'Update your personal and insurance information'
                        : 'View and manage patient profiles'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Insurance Verification Card */}
            <Link href="/insurance-verification">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">🛡️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Insurance Verification
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Check Coverage
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      Verify insurance coverage and view verification history
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Encounter Documentation Card */}
            <Link href="/encounters">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Medical Encounters
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {user.role === 'patient' ? 'My Records' : 'Document Care'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      {user.role === 'patient' 
                        ? 'View your medical encounter history'
                        : 'Document patient encounters and diagnoses'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats for Admin/Provider */}
          {(user.role === 'admin' || user.role === 'provider') && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">--</div>
                      <div className="text-sm text-gray-500">Total Patients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">--</div>
                      <div className="text-sm text-gray-500">Active Insurances</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">--</div>
                      <div className="text-sm text-gray-500">Total Encounters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">--</div>
                      <div className="text-sm text-gray-500">This Month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role-specific information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800">
              {user.role === 'patient' && 'Patient Portal'}
              {user.role === 'provider' && 'Provider Portal'}
              {user.role === 'admin' && 'Administrator Portal'}
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              {user.role === 'patient' && 'Manage your health information, view insurance status, and access your medical records.'}
              {user.role === 'provider' && 'Document patient encounters, verify insurance, and manage patient care.'}
              {user.role === 'admin' && 'Full system access to manage patients, providers, and system settings.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
