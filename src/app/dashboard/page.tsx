'use client';

import { useEffect, useState } from 'react';
import { Calendar, Target, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import type { TestHistoryItem } from '@/lib/api/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentResults, setRecentResults] = useState<TestHistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    userApi
      .getTestHistory()
      .then(({ data }) => setRecentResults((data.results || []).slice(0, 5)))
      .catch(() => setRecentResults([]));
  }, [user]);

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
