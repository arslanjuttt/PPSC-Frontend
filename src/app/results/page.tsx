'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Play,
  CheckCircle2,
  XCircle,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import type { TestHistoryItem } from '@/lib/api/types';
import {
  testResultStorage,
  type LatestPracticeDetail,
} from '@/lib/localStorage';
import { cn } from '@/lib/utils';

const OPTIONS = ['A', 'B', 'C', 'D'] as const;

function LatestPracticeReview({
  detail,
  onClear,
}: {
  detail: LatestPracticeDetail;
  onClear: () => void;
}) {
  const { subjectName, subjectSlug, mcqs, answers, score, correctCount } = detail;
  const isMockTest = subjectSlug.startsWith('mock-');
  const mockTestId = isMockTest ? subjectSlug.replace('mock-', '') : null;

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{subjectName} — {isMockTest ? 'Mock Test Complete' : 'Quiz Complete'}</h1>
            <p className="text-white/90">Here’s how you did.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-lg">
          <span className="font-bold text-3xl">{score}%</span>
          <span>
            {correctCount} / {mcqs.length} correct
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review</h2>
        <div className="space-y-6">
          {mcqs.map((mcq, index) => {
            const userAnswer = answers[index] as (typeof OPTIONS)[number] | null;
            const correctKey = mcq.correct_answer;
            const isCorrect = userAnswer === correctKey;
            const correctText = mcq.options[correctKey];
            const userText = userAnswer ? mcq.options[userAnswer] : '—';

            return (
              <article
                key={mcq.question_number}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex gap-3 mb-4">
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-semibold text-sm',
                      isCorrect
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white pt-0.5">
                    {mcq.question}
                  </h3>
                </div>
                <ul className="space-y-2 ml-11 mb-4">
                  {OPTIONS.map((key) => {
                    const label = mcq.options[key];
                    const isCorrectOpt = key === correctKey;
                    const isUserWrong = !isCorrect && userAnswer === key;
                    return (
                      <li
                        key={key}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                          isCorrectOpt &&
                            'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
                          isUserWrong &&
                            'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
                          !isCorrectOpt && !isUserWrong && 'bg-gray-50 dark:bg-gray-800/80'
                        )}
                      >
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          {key}.
                        </span>
                        <span className="text-gray-900 dark:text-white">{label}</span>
                        {isCorrectOpt && (
                          <CheckCircle2 className="ml-auto w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                        {isUserWrong && (
                          <XCircle className="ml-auto w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="ml-11 flex flex-wrap gap-4 text-sm">
                  <span
                    className={
                      isCorrect
                        ? 'text-green-600 dark:text-green-400 font-medium'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  {!isCorrect && (
                    <span className="text-gray-600 dark:text-gray-400">
                      Your answer: <strong>{userAnswer ?? '—'}</strong> {userText}
                    </span>
                  )}
                  <span className="text-primary font-medium">
                    Correct answer: <strong>{correctKey}</strong> — {correctText}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href={isMockTest ? `/mock-test/${mockTestId}` : `/practice?subject=${subjectSlug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
        >
          <Play className="w-4 h-4" />
          {isMockTest ? 'Retake mock test' : 'Retake quiz'}
        </Link>
        <Link
          href={isMockTest ? '/mock-test' : '/subjects'}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {isMockTest ? 'Choose another mock test' : 'Choose another subject'}
        </Link>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-600 dark:text-gray-400"
        >
          Dismiss review
        </button>
      </div>
    </div>
  );
}

function ResultsList({ results }: { results: TestHistoryItem[] }) {
  return (
    <div className="space-y-4">
      {results.map((r) => (
        <div
          key={r._id}
          className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-lg',
                r.score >= 70
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : r.score >= 50
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {r.score}%
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {r.subject || (r.source === 'mock' ? 'Mock test' : 'Practice quiz')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {r.correctAnswers} / {r.totalQuestions} correct
                {r.source === 'practice' && ' · Practice'}
                {r.source === 'mock' && ' · Mock test'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            {new Date(r.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const { user } = useAuth();
  const [latestPractice, setLatestPractice] = useState<LatestPracticeDetail | null>(null);
  const [results, setResults] = useState<TestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detail = testResultStorage.getLatestPracticeDetail();
    if (detail) setLatestPractice(detail);
  }, []);

  const displayedResults = useMemo(() => {
    if (!latestPractice) return results;

    const latestSource = latestPractice.subjectSlug.startsWith('mock-') ? 'mock' : 'practice';
    let removedDuplicate = false;

    return results.filter((result) => {
      if (removedDuplicate) return true;

      const isDuplicate =
        result.subject === latestPractice.subjectName &&
        result.source === latestSource &&
        result.score === latestPractice.score &&
        result.correctAnswers === latestPractice.correctCount &&
        result.totalQuestions === latestPractice.mcqs.length;

      if (isDuplicate) {
        removedDuplicate = true;
        return false;
      }

      return true;
    });
  }, [latestPractice, results]);

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

  const dismissReview = () => {
    testResultStorage.clearLatestPracticeDetail();
    setLatestPractice(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Results</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your quiz and mock test results.
        </p>
      </div>

      {latestPractice && (
        <LatestPracticeReview detail={latestPractice} onClear={dismissReview} />
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {latestPractice ? 'All results' : 'Your results'}
        </h2>
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading results...</p>
        ) : displayedResults.length > 0 ? (
          <ResultsList results={displayedResults} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No results yet. Complete a practice quiz or mock test to see your scores here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
              >
                <Play className="w-4 h-4" />
                Practice quiz
              </Link>
              <Link
                href="/mock-test"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
              >
                Mock test
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
