'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react';
import {
  getMcqsForSubject,
  getSubjectDisplayName,
  getTargetedPracticeMcqs,
  PRACTICE_MCQ_COUNT,
} from '@/lib/mcqs';
import type { JsonMcq } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import { testResultStorage } from '@/lib/localStorage';

const OPTIONS = ['A', 'B', 'C', 'D'] as const;
type AnswerKey = (typeof OPTIONS)[number];

function SubjectSelectPrompt() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Practice Quiz</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <Play className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Select a subject to start a {PRACTICE_MCQ_COUNT}-question quiz. Choose from the Subjects page.
        </p>
        <Link
          href="/subjects"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse subjects
        </Link>
      </div>
    </div>
  );
}

function StartQuizScreen({
  subjectName,
  questionCount,
  wrongCount,
  onStart,
}: {
  subjectName: string;
  questionCount: number;
  wrongCount: number;
  onStart: () => void;
}) {
  return (
    <div className="space-y-8">
      <Link
        href="/subjects"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to subjects
      </Link>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center max-w-lg mx-auto">
        <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{subjectName}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {questionCount} MCQs · Select your answers and submit when done.
        </p>
        {wrongCount > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-300 mb-4">
            This quiz prioritizes {wrongCount} questions you answered incorrectly last time.
          </p>
        )}
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Play className="w-5 h-5" />
          Start quiz
        </button>
      </div>
    </div>
  );
}

function QuizQuestion({
  mcq,
  index,
  total,
  selected,
  onSelect,
  onPrev,
  onNext,
  onSubmit,
}: {
  mcq: JsonMcq;
  index: number;
  total: number;
  selected: AnswerKey | null;
  onSelect: (key: AnswerKey) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Question {index + 1} of {total}
        </span>
        <Link href="/subjects" className="hover:text-gray-700 dark:hover:text-white">
          Exit quiz
        </Link>
      </div>

      <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {mcq.question}
        </h2>
        <ul className="space-y-3">
          {OPTIONS.map((key) => {
            const label = mcq.options[key];
            const isSelected = selected === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect(key)}
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
          onClick={onPrev}
          disabled={index === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        {index < total - 1 ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Submit quiz
          </button>
        )}
      </div>
    </div>
  );
}

function PracticeContent() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const subjectSlug = searchParams.get('subject');

  const latestPractice = useMemo(() => testResultStorage.getLatestPracticeDetail(), []);

  const wrongQuestionsForSubject = useMemo(() => {
    if (!latestPractice || latestPractice.subjectSlug !== subjectSlug) return [] as string[];
    return latestPractice.mcqs
      .filter((mcq, index) => latestPractice.answers[index] !== mcq.correct_answer)
      .map((mcq) => mcq.question);
  }, [latestPractice, subjectSlug]);

  const { mcqs, subjectName, hasSubject } = useMemo(() => {
    if (!subjectSlug) return { mcqs: [], subjectName: '', hasSubject: false };
    const list = wrongQuestionsForSubject.length
      ? getTargetedPracticeMcqs(subjectSlug, wrongQuestionsForSubject)
      : getMcqsForSubject(subjectSlug);
    return {
      mcqs: list,
      subjectName: getSubjectDisplayName(subjectSlug),
      hasSubject: true,
    };
  }, [subjectSlug, wrongQuestionsForSubject]);

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerKey | null)[]>([]);

  const correctCount = useMemo(
    () =>
      mcqs.reduce((acc, m, i) => (answers[i] === m.correct_answer ? acc + 1 : acc), 0),
    [mcqs, answers]
  );
  const score = mcqs.length ? Math.round((correctCount / mcqs.length) * 100) : 0;

  const startQuiz = useCallback(() => {
    setQuizStarted(true);
    setCurrentIndex(0);
    setAnswers(new Array(mcqs.length).fill(null));
  }, [mcqs.length]);

  const selectAnswer = useCallback((key: AnswerKey) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = key;
      return next;
    });
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(mcqs.length - 1, i + 1));
  }, [mcqs.length]);

  const submitQuiz = useCallback(async () => {
    const wrongCount = mcqs.length - correctCount;
    const unattempted = answers.filter((a) => a === null).length;

    testResultStorage.setLatestPracticeDetail({
      subjectName,
      subjectSlug: subjectSlug!,
      mcqs: mcqs.map((m) => ({
        question_number: m.question_number,
        question: m.question,
        options: m.options,
        correct_answer: m.correct_answer,
      })),
      answers: answers.map((a) => a),
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
          subject: subjectName,
          source: 'practice',
        });
        await refreshUser();
      } catch {
        // Local review still works if backend sync fails
      }
    }

    router.push('/results');
  }, [user?.id, mcqs, answers, correctCount, score, subjectName, subjectSlug, router, refreshUser]);

  if (!hasSubject || !subjectSlug) {
    return <SubjectSelectPrompt />;
  }

  if (!quizStarted) {
    return (
      <StartQuizScreen
        subjectName={subjectName}
        questionCount={mcqs.length}
        wrongCount={wrongQuestionsForSubject.length}
        onStart={startQuiz}
      />
    );
  }

  if (mcqs.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Practice Quiz</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No questions available for this subject.
          </p>
          <Link href="/subjects" className="text-primary hover:underline">
            Browse subjects
          </Link>
        </div>
      </div>
    );
  }

  const mcq = mcqs[currentIndex];
  return (
    <QuizQuestion
      mcq={mcq}
      index={currentIndex}
      total={mcqs.length}
      selected={answers[currentIndex]}
      onSelect={selectAnswer}
      onPrev={goPrev}
      onNext={goNext}
      onSubmit={submitQuiz}
    />
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-9 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
