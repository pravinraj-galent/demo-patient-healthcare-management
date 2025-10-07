'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Healthcare Management System&nbsp;
          <code className="font-mono font-bold">Demo</code>
        </p>
        <div className="fixed right-0 top-0 flex space-x-4 p-4 lg:static lg:p-0">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Healthcare Management System
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Complete patient healthcare management solution
            </p>
            
            {/* Demo Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 font-medium mb-2">🎯 Demo Ready!</p>
              <p className="text-xs text-blue-700 mb-3">
                Pre-loaded with 5 patients, insurance verifications, and medical records
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-blue-600">
                <div><strong>👨‍💼 Admin:</strong> admin@demo.com</div>
                <div><strong>👩‍⚕️ Provider:</strong> provider@demo.com</div>
                <div><strong>👤 Patient:</strong> patient@demo.com</div>
              </div>
              <p className="text-xs text-blue-500 mt-2">Password: <strong>password</strong> (for all accounts)</p>
            </div>

            <div className="space-x-4">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Try Demo
              </Link>
              <Link
                href="/register"
                className="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Patient Registration
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Complete intake forms with demographic and insurance information
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Insurance Verification
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Real-time insurance coverage verification and history tracking
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Encounter Documentation
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Document medical encounters with ICD-10 codes and clinical notes
          </p>
        </div>
      </div>
    </main>
  )
}
