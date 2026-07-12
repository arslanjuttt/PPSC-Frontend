'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Loader2 } from 'lucide-react';
import { userApi, getApiErrorMessage } from '@/lib/api';
import type { LeaderboardEntry } from '@/lib/api/types';

interface DisplayEntry {
  rank: number;
  name: string;
  score: number;
  testsCompleted: number;
  streak: number;
  accuracy: number;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
  return <span className="text-gray-500 dark:text-gray-400 font-bold">#{rank}</span>;
};

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return 'bg-linear-to-r from-yellow-400 to-yellow-600';
  if (rank === 2) return 'bg-linear-to-r from-gray-300 to-gray-500';
  if (rank === 3) return 'bg-linear-to-r from-amber-500 to-amber-700';
  return 'bg-gray-200 dark:bg-gray-700';
};

const mapLeaderboard = (entries: LeaderboardEntry[]): DisplayEntry[] =>
  entries.map((entry, index) => ({
    rank: index + 1,
    name: entry.name,
    score: entry.stats?.lastScore ?? 0,
    testsCompleted: entry.stats?.testsTaken ?? 0,
    streak: entry.stats?.streak ?? 0,
    accuracy: entry.stats?.accuracy ?? 0,
  }));

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<DisplayEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await userApi.getLeaderboard();
        setLeaderboard(mapLeaderboard(data.leaderboard || []));
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load leaderboard'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const topScore = leaderboard[0]?.score ?? 0;
  const averageScore =
    leaderboard.length > 0
      ? Math.round(leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length)
      : 0;

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-white/90">Top performers in PPSC preparation</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          Loading leaderboard...
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!isLoading && !error && leaderboard.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No leaderboard data yet. Complete a quiz to appear here!</p>
        </div>
      )}

      {!isLoading && leaderboard.length > 0 && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Score</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Streak</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.rank}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        entry.rank <= 3 ? 'bg-linear-to-r from-transparent to-primary/5 dark:to-primary/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-10 h-10 rounded-full ${getRankBadgeColor(entry.rank)} flex items-center justify-center`}>
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{entry.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${
                            entry.score >= 90 ? 'text-green-600 dark:text-green-400' :
                            entry.score >= 80 ? 'text-blue-600 dark:text-blue-400' :
                            entry.score >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-gray-600 dark:text-gray-400'
                          }`}>
                            {entry.score}%
                          </span>
                          {entry.rank <= 3 && <TrendingUp className="w-4 h-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{entry.testsCompleted}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white font-medium">{entry.streak}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">days</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{entry.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{topScore}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{leaderboard.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
