'use client';

import Link from 'next/link';
import { Clock, Trophy, Target, BookOpen, Layers } from 'lucide-react';
import { MOCK_TESTS } from '@/lib/mockTests';

export default function MockTestPage() {
  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Mock Test Simulator</h1>
            <p className="text-white/90">
              Full-length mixed-subject PPSC exam simulations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_TESTS.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:border-primary dark:hover:border-primary transition-colors flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-primary mb-1">Mock Test {test.id}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{test.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{test.description}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span className="inline-flex items-center gap-1">
                <Layers className="w-4 h-4" />
                {test.questionCount} MCQs
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {test.duration} minutes
              </span>
              <span className="inline-flex items-center gap-1 text-primary font-medium">
                All subjects mixed
              </span>
            </div>

            <Link
              href={`/mock-test/${test.id}`}
              className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium w-fit"
            >
              <Target className="w-4 h-4" />
              Start {test.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
