'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Target, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import type { TestHistoryItem } from '@/lib/api/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestHistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    userApi
      .getTestHistory()
      .then(({ data }) => setTestResults(data.results || []))
      .catch(() => setTestResults([]));
  }, [user]);

  const recentResults = useMemo(() => testResults.slice(0, 5), [testResults]);

  const subjectAverages = useMemo(() => {
    const subjectMap = new Map<string, { totalScore: number; count: number }>();

    testResults.forEach((result) => {
      const subject = result.subject?.trim();
      if (!subject) return;
      const current = subjectMap.get(subject) || { totalScore: 0, count: 0 };
      current.totalScore += result.score;
      current.count += 1;
      subjectMap.set(subject, current);
    });

    const averages = Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject,
      average: Math.round(data.totalScore / data.count),
      count: data.count,
    }));

    const strongSubjects = averages
      .filter((item) => item.average >= 50)
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);

    const weakSubjects = averages
      .filter((item) => item.average < 50)
      .sort((a, b) => a.average - b.average)
      .slice(0, 3);

    return { strongSubjects, weakSubjects };
  }, [testResults]);

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statsCards = [
    {
      title: 'Current Streak',
      value: `${user.profile?.streak || 0} days`,
      icon: Zap,
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      title: 'Tests Completed',
      value: user.profile?.totalTests || 0,
      icon: Target,
      gradient: 'from-primary to-primary/80',
    },
    {
      title: 'Last Score',
      value: `${user.profile?.lastScore ?? 0}%`,
      icon: Trophy,
      gradient: 'from-primary to-primary/80',
    },
    {
      title: 'Accuracy',
      value: `${user.profile?.accuracy ?? 0}%`,
      icon: Calendar,
      gradient: 'from-accent to-accent/80',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {user.name}! 👋</h1>
            <p className="text-white/90 text-lg">Ready to continue your PPSC preparation journey?</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold">Level {user.profile?.level || 1}</div>
            <div className="text-white/80">{user.profile?.totalTests || 0} tests taken</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className={`p-3 bg-linear-to-r ${card.gradient} rounded-lg w-fit mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
              <p className={`text-3xl font-bold bg-linear-to-r ${card.gradient} bg-clip-text text-transparent`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/practice" className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:border-primary">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg"><Target className="w-6 h-6 text-primary" /></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Start Practice</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Practice questions by subject</p>
              </div>
            </div>
          </Link>
          <Link href="/mock-test" className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:border-accent">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/10 rounded-lg"><Trophy className="w-6 h-6 text-accent" /></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Mock Test</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Take a full mock exam</p>
              </div>
            </div>
          </Link>
          <Link href="/results" className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:border-primary">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg"><Calendar className="w-6 h-6 text-primary" /></div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">View Results</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check your progress</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400 font-semibold">Subject strengths</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top strong and weak topics</h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Based on your recent subject averages</span>
          </div>

          {testResults.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Complete some practice or mock tests to see your subject strengths and weaknesses here.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Strong topics</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subjects with average ≥ 50%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {subjectAverages.strongSubjects.length > 0 ? (
                    subjectAverages.strongSubjects.map((item) => (
                      <div key={item.subject} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span>{item.subject}</span>
                          <span>{item.average}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.average}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No strong subjects yet.</p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Weak topics</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subjects with average &lt; 50%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {subjectAverages.weakSubjects.length > 0 ? (
                    subjectAverages.weakSubjects.map((item) => (
                      <div key={item.subject} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span>{item.subject}</span>
                          <span>{item.average}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${item.average}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No weak subjects yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400 font-semibold">Streak overview</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Exam focus summary</h2>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Your current streak and recent topic performance show the areas where you should keep practicing.</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Strongest subject</p>
              <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                {subjectAverages.strongSubjects[0]?.subject ?? 'N/A'} · {subjectAverages.strongSubjects[0]?.average ?? '--'}%
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Weakest subject</p>
              <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                {subjectAverages.weakSubjects[0]?.subject ?? 'N/A'} · {subjectAverages.weakSubjects[0]?.average ?? '--'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Test Results</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          {recentResults.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentResults.map((result) => (
                <div key={result._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.subject || (result.source === 'mock' ? 'Mock Test' : 'Practice Quiz')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(result.createdAt).toLocaleDateString()} · {result.correctAnswers}/{result.totalQuestions} correct
                      </p>
                    </div>
                    <p className={`font-bold text-2xl ${result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {result.score}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No test results yet. Start practicing!</p>
              <Link href="/practice" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">Start Practice</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
