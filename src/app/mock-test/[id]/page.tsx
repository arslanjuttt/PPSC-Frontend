'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Timer,
} from 'lucide-react';
import { getMcqsForMockTest } from '@/lib/mcqs';
import { getMockTestById } from '@/lib/mockTests';
import type { JsonMcq } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import { testResultStorage } from '@/lib/localStorage';

const OPTIONS = ['A', 'B', 'C', 'D'] as const;
type AnswerKey = (typeof OPTIONS)[number];

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function StartMockScreen({
  title,
  questionCount,
  duration,
  onStart,
}: {
  title: string;
  questionCount: number;
  duration: number;
  onStart: () => void;
}) {
  return (
    <div className="space-y-8">
      <Link
        href="/mock-test"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to mock tests
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center max-w-lg mx-auto">
        <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {questionCount} MCQs · Mixed from all subjects
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-6 inline-flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          {duration} minutes time limit
        </p>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Play className="w-5 h-5" />
          Start mock test
        </button>
      </div>
    </div>
  );
}

function MockTestContent() {
  const params = useParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const testId = Number(params.id);
  const test = getMockTestById(testId);
  const submittedRef = useRef(false);

  const mcqs = useMemo(
    () => (test ? getMcqsForMockTest(test.questionCount) : []),
    [test]
  );

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerKey | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const correctCount = useMemo(
    () => mcqs.reduce((acc, mcq, index) => (answers[index] === mcq.correct_answer ? acc + 1 : acc), 0),
    [mcqs, answers]
  );
  const score = mcqs.length ? Math.round((correctCount / mcqs.length) * 100) : 0;

  const submitQuiz = useCallback(async () => {
    if (submittedRef.current || !test) return;
    submittedRef.current = true;

    const wrongCount = mcqs.length - correctCount;
    const unattempted = answers.filter((answer) => answer === null).length;

    testResultStorage.setLatestPracticeDetail({
      subjectName: test.title,
      subjectSlug: `mock-${test.id}`,
      mcqs: mcqs.map((mcq) => ({
        question_number: mcq.question_number,
        question: mcq.question,
        options: mcq.options,
        correct_answer: mcq.correct_answer,
      })),
      answers: answers.map((answer) => answer),
      score,
      correctCount,
    });

    if (user?.id) {
      try {
        await userApi.recordTestResult({
          correctAnswers: correctCount,
          incorrectAnswers: wrongCount,
          score,
          totalQuestions: mcqs.length,
          unattempted,
          subject: test.title,
          source: 'mock',
        });
        await refreshUser();
      } catch {
        // Local review still works if backend sync fails
      }
    }

    router.push('/results');
  }, [answers, correctCount, mcqs, refreshUser, router, score, test, user?.id]);

  const startQuiz = useCallback(() => {
    if (!test) return;
    submittedRef.current = false;
    setQuizStarted(true);
    setCurrentIndex(0);
    setAnswers(new Array(mcqs.length).fill(null));
    setSecondsLeft(test.duration * 60);
  }, [mcqs.length, test]);

  useEffect(() => {
    if (!quizStarted || secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quizStarted, secondsLeft]);

  useEffect(() => {
    if (quizStarted && secondsLeft === 0) {
      submitQuiz();
    }
  }, [quizStarted, secondsLeft, submitQuiz]);

  const selectAnswer = useCallback((key: AnswerKey) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = key;
      return next;
    });
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(mcqs.length - 1, index + 1));
  }, [mcqs.length]);

  if (!test) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock test not found</h1>
        <Link href="/mock-test" className="text-primary hover:underline">
          Back to mock tests
        </Link>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <StartMockScreen
        title={test.title}
        questionCount={test.questionCount}
        duration={test.duration}
        onStart={startQuiz}
      />
    );
  }

  if (mcqs.length === 0) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">No questions available</h1>
        <Link href="/mock-test" className="text-primary hover:underline">
          Back to mock tests
        </Link>
      </div>
    );
  }

  const mcq = mcqs[currentIndex];
  const timerClass =
    secondsLeft <= 300
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-700 dark:text-gray-300';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">{test.title}</span>
          <span className="mx-2">·</span>
          Mixed subjects
        </div>
        <div className={cn('inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold', timerClass, secondsLeft <= 300 ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800')}>
          <Timer className="w-4 h-4" />
          {formatTime(secondsLeft)}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Question {currentIndex + 1} of {mcqs.length}
        </span>
        <Link href="/mock-test" className="hover:text-gray-700 dark:hover:text-white">
          Exit mock test
        </Link>
      </div>

      <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {mcq.question}
        </h2>
        <ul className="space-y-3">
          {OPTIONS.map((key) => {
            const label = mcq.options[key];
            const isSelected = answers[currentIndex] === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => selectAnswer(key)}
                  className={cn(
                    'w-full text-left flex items-center gap-3 rounded-lg px-4 py-3 border text-sm transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10 dark:bg-primary/20 text-primary'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-medium',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {key}
                  </span>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </article>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        {currentIndex < mcqs.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submitQuiz}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Submit mock test
          </button>
        )}
      </div>
    </div>
  );
}

export default function MockTestRunPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-9 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      }
    >
      <MockTestContent />
    </Suspense>
  );
}
