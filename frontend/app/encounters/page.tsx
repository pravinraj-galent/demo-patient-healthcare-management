'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, apiCall } from '@/lib/auth';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

interface Encounter {
  id: number;
  patient_id: number;
  provider_name: string;
  encounter_date: string;
  diagnosis_code: string;
  notes: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

export default function EncountersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEncounter, setEditingEncounter] = useState<Encounter | null>(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    provider_name: '',
    encounter_date: '',
    diagnosis_code: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        // For patients, load their own encounters
        const profile = await apiCall('/patients/profile');
        if (profile.id) {
          const encountersData = await apiCall(`/encounters/patient/${profile.id}`);
          setEncounters(encountersData);
        }
      } else {
        // For providers/admins, load all patients and encounters
        const [patientsData, encountersData] = await Promise.all([
          apiCall('/patients/all'),
          apiCall('/encounters/all')
        ]);
        setPatients(patientsData);
        setEncounters(encountersData);
      }
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (editingEncounter) {
        // Update existing encounter
        await apiCall(`/encounters/${editingEncounter.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        setSuccess('Encounter updated successfully');
      } else {
        // Create new encounter
        await apiCall('/encounters', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSuccess('Encounter created successfully');
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save encounter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (encounter: Encounter) => {
    setEditingEncounter(encounter);
    setFormData({
      patient_id: encounter.patient_id.toString(),
      provider_name: encounter.provider_name,
      encounter_date: encounter.encounter_date,
      diagnosis_code: encounter.diagnosis_code || '',
      notes: encounter.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (encounterId: number) => {
    if (!confirm('Are you sure you want to delete this encounter?')) {
      return;
    }

    try {
      await apiCall(`/encounters/${encounterId}`, {
        method: 'DELETE'
      });
      setSuccess('Encounter deleted successfully');
      await loadData();
    } catch (err) {
      setError('Failed to delete encounter');
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      provider_name: '',
      encounter_date: '',
      diagnosis_code: '',
      notes: ''
    });
    setEditingEncounter(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.role === 'patient' ? 'My Medical Records' : 'Patient Encounters'}
            </h1>
            {user.role !== 'patient' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                New Encounter
              </button>
            )}
          </div>

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

          {/* Encounter Form Modal */}
          {showForm && user.role !== 'patient' && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    {editingEncounter ? 'Edit Encounter' : 'New Encounter'}
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                  <div>
                    <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700">
                      Patient *
                    </label>
                    <select
                      name="patient_id"
                      id="patient_id"
                      required
                      value={formData.patient_id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name} (DOB: {formatDate(patient.date_of_birth)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="provider_name" className="block text-sm font-medium text-gray-700">
                        Provider Name *
                      </label>
                      <input
                        type="text"
                        name="provider_name"
                        id="provider_name"
                        required
                        value={formData.provider_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dr. Smith"
                      />
                    </div>

                    <div>
                      <label htmlFor="encounter_date" className="block text-sm font-medium text-gray-700">
                        Encounter Date *
                      </label>
                      <input
                        type="date"
                        name="encounter_date"
                        id="encounter_date"
                        required
                        value={formData.encounter_date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="diagnosis_code" className="block text-sm font-medium text-gray-700">
                      ICD-10 Diagnosis Code
                    </label>
                    <input
                      type="text"
                      name="diagnosis_code"
                      id="diagnosis_code"
                      value={formData.diagnosis_code}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Z00.00, J45.9, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Clinical Notes
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Patient complained of... Examination revealed... Treatment plan..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : editingEncounter ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Encounters List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {encounters.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-gray-500">
                    {user.role === 'patient' 
                      ? 'No medical encounters found.'
                      : 'No encounters recorded yet.'
                    }
                  </div>
                  {user.role !== 'patient' && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-2 text-blue-600 hover:text-blue-500 text-sm"
                    >
                      Create First Encounter →
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {encounters.map((encounter) => (
                    <div key={encounter.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          {user.role !== 'patient' && (
                            <h3 className="text-lg font-medium text-gray-900">
                              {encounter.first_name} {encounter.last_name}
                            </h3>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span><strong>Provider:</strong> {encounter.provider_name}</span>
                            <span><strong>Date:</strong> {formatDate(encounter.encounter_date)}</span>
                            {encounter.diagnosis_code && (
                              <span><strong>ICD-10:</strong> {encounter.diagnosis_code}</span>
                            )}
                          </div>
                        </div>
                        {user.role !== 'patient' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(encounter)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(encounter.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {encounter.notes && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Clinical Notes:</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{encounter.notes}</p>
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Created: {formatDateTime(encounter.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats for Admin/Provider */}
          {user.role !== 'patient' && encounters.length > 0 && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Encounter Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {encounters.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Encounters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(encounters.map(e => e.patient_id)).size}
                    </div>
                    <div className="text-sm text-gray-500">Unique Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(encounters.map(e => e.provider_name)).size}
                    </div>
                    <div className="text-sm text-gray-500">Providers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {encounters.filter(e => {
                        const encounterDate = new Date(e.encounter_date);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return encounterDate >= thirtyDaysAgo;
                      }).length}
                    </div>
                    <div className="text-sm text-gray-500">Last 30 Days</div>
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
