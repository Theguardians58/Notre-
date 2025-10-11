'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleTryNow = () => {
    // Create a guest note and redirect to editor
    router.push('/note/new?guest=true');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">CogniNote</h1>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600 dark:text-blue-400">CogniNote</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered note-taking that thinks with you. Start writing immediately—no account required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleTryNow}
              className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <PencilSquareIcon className="w-6 h-6 mr-2" />
              Try Now - No Signup
            </Button>
            <Button
              onClick={handleSignUp}
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold"
            >
              Create Free Account
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={handleLogin}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Log in
            </button>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <PencilSquareIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Instantly
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Begin taking notes immediately. No signup, no barriers. Try all features before committing.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Summarize, improve, translate, and brainstorm with AI. Powered by Gemini, GPT-4, and Claude.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <CloudArrowUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Save & Sync
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create a free account to save your notes and sync across all your devices.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
              <DocumentTextIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Rich Editor
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Block-based editor with markdown, code highlighting, tables, and media embeds.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <LockClosedIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              End-to-End Encryption
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your notes are encrypted with AES-256. Optional biometric unlock for extra security.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your Data, Your Control
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose between Supabase, Firebase, or Appwrite. Self-host option available.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Try CogniNote now with zero commitment. Create an account when you're ready to save your work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleTryNow}
              className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            >
              Start Writing Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={handleSignUp}
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
