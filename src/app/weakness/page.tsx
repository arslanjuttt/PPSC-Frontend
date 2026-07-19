'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, BookOpen, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import type { TestHistoryItem } from '@/lib/api/types';
import { cn } from '@/lib/utils';

const SUBJECT_WEAKNESS_LABELS: Record<string, string> = {
  English: 'English',
  Urdu: 'Urdu',
  'Pak Studies': 'Pakistan Studies',
  'Islamic Studies': 'Islamic Studies',
  'General Knowledge': 'Current Affairs',
  Ecommerce: 'Ecommerce',
  Physics: 'Physics',
  History: 'History',
  Agriculture: 'Agriculture',
  Sociology: 'Sociology',
  'Computer Science': 'Computer Science',
};

const PRACTICE_RECOMMENDATIONS: Record<string, string[]> = {
  English: [
    'Grammar drills: tenses and sentence structure',
    'Vocabulary practice for comprehension',
    'Error correction exercises',
  ],
  Urdu: [
    'Essay writing practice',
    'Vocabulary and comprehension quizzes',
    'Grammar revision tests',
  ],
  'Pak Studies': [
    'History of Pakistan quizzes',
    'Current affairs and civic practice',
    'Map and constitution questions',
  ],
  'Islamic Studies': [
    'Quranic verse understanding practice',
    'Islamic history review',
    'Principles and ethics exercises',
  ],
  'General Knowledge': [
    'Current affairs mock tests',
    'Pakistan affairs question sets',
    'World affairs quiz rounds',
  ],
  Ecommerce: [
    'Business scenario MCQs',
    'Marketing and commerce practice',
    'Economic fundamentals exercises',
  ],
  Physics: [
    'Mechanics and optics practice',
    'Numerical problem drills',
    'Concept review quizzes',
  ],
  History: [
    'Civilization timeline questions',
    'Event cause-and-effect practice',
    'Historical personalities quiz',
  ],
  Agriculture: [
    'Crop and livestock MCQs',
    'Soil and irrigation practice',
    'Modern farming techniques quiz',
  ],
  Sociology: [
    'Social theory practice',
    'Group behavior MCQs',
    'Research methods review',
  ],
  'Computer Science': [
    'Programming logic exercises',
    'Data structures quiz questions',
    'Computer fundamentals practice',
  ],
};

const WEAKNESS_THRESHOLD = 70;

const SUBJECT_SLUGS: Record<string, string> = {
  English: 'english',
  Urdu: 'urdu',
  'Pak Studies': 'pak-studies',
  'Islamic Studies': 'islamic-studies',
  'General Knowledge': 'general-knowledge',
  Ecommerce: 'ecommerce',
  Physics: 'physics',
  History: 'history',
  Agriculture: 'agriculture',
  Sociology: 'sociology',
  'Computer Science': 'computer-science',
};

function getSubjectScoreMap(results: TestHistoryItem[]) {
  const subjectMap: Record<string, { entries: { score: number; date: number }[] }> = {};

  results.forEach((result) => {
    if (!result.subject || result.source === 'mock') return;
    const subject = SUBJECT_WEAKNESS_LABELS[result.subject] || result.subject;
    const createdAt = result.createdAt ? new Date(result.createdAt).getTime() : 0;

    if (!subjectMap[subject]) {
      subjectMap[subject] = { entries: [] };
    }

    subjectMap[subject].entries.push({
      score: result.score,
      date: createdAt,
    });
  });

  return Object.entries(subjectMap).map(([subject, data]) => {
    const entries = data.entries.sort((a, b) => a.date - b.date);
    const latestEntry = entries[entries.length - 1];
    const latestDate = latestEntry?.date ?? 0;
    const latestScore = latestEntry?.score ?? 0;
    const average = Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length);

    const weights = entries.map((entry) => {
      const ageDays = latestDate === 0 ? 0 : (latestDate - entry.date) / (1000 * 60 * 60 * 24);
      return Math.exp(-ageDays / 10);
    });

    const weightedScore = Math.round(
      entries.reduce((sum, entry, index) => sum + entry.score * weights[index], 0) /
        weights.reduce((sum, weight) => sum + weight, 0)
    );

    return {
      subject,
      average,
      latestScore,
      weightedScore,
      attemptCount: entries.length,
    };
  });
}

function WeaknessPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<TestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    userApi
      .getTestHistory()
      .then(({ data }) => setResults(data.results || []))
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [user]);

  const subjectScores = useMemo(() => getSubjectScoreMap(results), [results]);

  const weaknesses = useMemo(
    () => subjectScores
      .filter((item) => item.weightedScore < WEAKNESS_THRESHOLD)
      .sort((a, b) => a.weightedScore - b.weightedScore),
    [subjectScores]
  );

  const recommendationCards = useMemo(() => {
    if (weaknesses.length === 0) return [];

    return weaknesses.map((item) => ({
      subject: item.subject,
      subjectSlug: SUBJECT_SLUGS[item.subject] || '',
      weightedScore: item.weightedScore,
      latestScore: item.latestScore,
      average: item.average,
      attemptCount: item.attemptCount,
      recommendations: PRACTICE_RECOMMENDATIONS[item.subject] || [
        'Review practice questions for this topic',
        'Try mixed subject quizzes',
      ],
    }));
  }, [weaknesses]);

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const selectedRecommendation = useMemo(
    () => recommendationCards.find((item) => item.subject === selectedSubject) ?? null,
    [recommendationCards, selectedSubject]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to dashboard
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-primary">
          <Activity className="w-6 h-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personalized Weakness Detection</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Track your performance by subject and get tailored practice test recommendations for the topics where you need the most improvement.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">Loading your results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">No results available yet. Complete practice quizzes or mock tests to generate your weakness profile.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-semibold">Weak subjects</p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Focus on what needs improvement</h2>
                </div>
                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-primary font-semibold">{weaknesses.length} weak subjects</div>
              </div>
              <div className="space-y-3">
                {weaknesses.length === 0 ? (
                  <div className="rounded-3xl border border-gray-200 dark:border-gray-700 p-6">
                    <p className="text-gray-600 dark:text-gray-400">Great job — all practice subject averages are above {WEAKNESS_THRESHOLD}%.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Keep practicing to maintain your strengths.</p>
                  </div>
                ) : (
                  weaknesses.map((item) => {
                    const subjectSlug = SUBJECT_SLUGS[item.subject] || '';
                    const isSelected = selectedSubject === item.subject;
                    return (
                      <div key={item.subject} className={`rounded-3xl border p-4 ${isSelected ? 'border-primary/40 bg-primary/5 dark:border-primary/30 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{item.subject}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recency-weighted score: {item.weightedScore}%</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Latest: {item.latestScore}% · Overall average: {item.average}% ({item.attemptCount} attempts)</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedSubject(item.subject)}
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <BookOpen className="w-4 h-4" />
                              Focus
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              item.weightedScore >= 80
                                ? 'bg-emerald-500'
                                : item.weightedScore >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            )}
                            style={{ width: `${item.weightedScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-semibold">Focus recommendations</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subject-specific guidance</h2>
              </div>
              {recommendationCards.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">You are performing well across subjects. Keep practicing to maintain your strengths.</p>
              ) : selectedRecommendation ? (
                <div className="rounded-3xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedRecommendation.subject}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Recency-weighted score: {selectedRecommendation.weightedScore}%</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Latest: {selectedRecommendation.latestScore}% · Overall average: {selectedRecommendation.average}%</p>
                    </div>
                    <Link
                      href={`/practice?subject=${selectedRecommendation.subjectSlug}`}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Practice {selectedRecommendation.subject}
                    </Link>
                  </div>
                  <ul className="space-y-2">
                    {selectedRecommendation.recommendations.map((recommendation) => (
                      <li key={recommendation} className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-300">
                        • {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-3xl border border-gray-200 dark:border-gray-700 p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Select a weak subject to see focused recommendations.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Then click “Practice” to start a quiz for that subject.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeaknessPage;
