'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, apiCall } from '@/lib/auth';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  insurance_provider: string;
  insurance_policy_number: string;
}

interface Verification {
  id: number;
  patient_id: number;
  status: string;
  coverage_type: string;
  verification_date: string;
  notes: string;
  first_name?: string;
  last_name?: string;
  insurance_provider?: string;
}

export default function InsuranceVerificationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      if (user?.role === 'patient') {
        // For patients, load their own verification history
        const profile = await apiCall('/patients/profile');
        if (profile.id) {
          const history = await apiCall(`/insurance/history/${profile.id}`);
          setVerifications(history);
        }
      } else {
        // For providers/admins, load all patients and verifications
        const [patientsData, verificationsData] = await Promise.all([
          apiCall('/patients/all'),
          apiCall('/insurance/all')
        ]);
        setPatients(patientsData);
        setVerifications(verificationsData);
      }
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleVerifyInsurance = async (patientId: number) => {
    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiCall(`/insurance/verify/${patientId}`, {
        method: 'POST'
      });

      setSuccess(`Insurance verification completed for ${result.patient.name}`);
      await loadData(); // Reload verification data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                Healthcare Management
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.email} ({user.role})
              </span>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Insurance Verification</h1>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="text-green-800">{success}</div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Selection / Verification Trigger */}
            {user.role !== 'patient' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Verify Patient Insurance</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700">
                        Select Patient
                      </label>
                      <select
                        id="patient-select"
                        value={selectedPatient || ''}
                        onChange={(e) => setSelectedPatient(Number(e.target.value) || null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose a patient...</option>
                        {patients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name} - {patient.insurance_provider}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => selectedPatient && handleVerifyInsurance(selectedPatient)}
                      disabled={!selectedPatient || isVerifying}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Insurance'}
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Verification Process</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Connects to insurance provider API</li>
                      <li>• Validates policy status and coverage</li>
                      <li>• Returns coverage details and notes</li>
                      <li>• Stores verification history</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Verification History */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {user.role === 'patient' ? 'My Insurance Status' : 'Recent Verifications'}
                </h2>
                
                {verifications.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-gray-500">
                      {user.role === 'patient' 
                        ? 'No insurance verifications found. Complete your profile first.'
                        : 'No insurance verifications performed yet.'
                      }
                    </div>
                    {user.role === 'patient' && (
                      <Link
                        href="/patient-profile"
                        className="mt-2 inline-block text-blue-600 hover:text-blue-500 text-sm"
                      >
                        Complete Profile →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {verifications.map((verification) => (
                      <div key={verification.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            {user.role !== 'patient' && (
                              <h4 className="font-medium text-gray-900">
                                {verification.first_name} {verification.last_name}
                              </h4>
                            )}
                            <p className="text-sm text-gray-600">
                              {verification.insurance_provider || 'Insurance Provider'}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                            {verification.status?.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Coverage:</span> {verification.coverage_type}
                          </div>
                          <div>
                            <span className="font-medium">Verified:</span> {formatDate(verification.verification_date)}
                          </div>
                        </div>
                        
                        {verification.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {verification.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section for Admin/Provider */}
          {user.role !== 'patient' && verifications.length > 0 && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Verification Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {verifications.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Verifications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {verifications.filter(v => v.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-500">Active Policies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {verifications.filter(v => v.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {verifications.filter(v => v.status === 'inactive').length}
                    </div>
                    <div className="text-sm text-gray-500">Inactive</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
