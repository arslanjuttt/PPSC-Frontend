'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Trophy, BookOpen, Target, Loader2 } from 'lucide-react';
import { testApi, getApiErrorMessage } from '@/lib/api';
import type { MockTest } from '@/lib/api/types';

export default function MockTestPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    testApi
      .getAll()
      .then(({ data }) => setTests(data.tests || []))
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to load mock tests')))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Mock Tests</h1>
            <p className="text-white/90">Full-length PPSC exam simulations from the backend</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          Loading mock tests...
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{test.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{test.subject}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {test.duration} min
                </span>
              </div>
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                <Target className="w-4 h-4" />
                Start practice while mock launches
              </Link>
            </div>
          ))}
        </div>
      )}

      {!isLoading && tests.length === 0 && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No mock tests available</h2>
          <p className="text-gray-600 dark:text-gray-400">Check back later or practice by subject.</p>
          <Link href="/subjects" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg">
            Browse subjects
          </Link>
        </div>
      )}
    </div>
  );
}
