'use client';

import { useState, useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Play,
  CheckCircle2,
  XCircle,
  Calendar,
  BookOpen,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
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

const COMPULSORY_SUBJECTS = [
  'English',
  'Urdu',
  'Pak Studies',
  'Islamic Studies',
  'General Knowledge',
] as const;

const OPTIONAL_SUBJECTS = [
  'Ecommerce',
  'Physics',
  'History',
  'Agriculture',
  'Sociology',
  'Computer Science',
] as const;

const SUBJECT_FILTER_OPTIONS = [
  ...COMPULSORY_SUBJECTS,
  ...OPTIONAL_SUBJECTS,
  'Mock tests',
] as const;

type SubjectFilterOption = (typeof SUBJECT_FILTER_OPTIONS)[number];

type ResultTab = 'All' | 'Compulsory' | 'Optional' | 'Mock';

const RESULT_TABS: ResultTab[] = ['All', 'Compulsory', 'Optional', 'Mock'];

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

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50] as const;

function ResultsList({
  results,
  selectedTab,
  setSelectedTab,
}: {
  results: TestHistoryItem[];
  selectedTab: ResultTab;
  setSelectedTab: Dispatch<SetStateAction<ResultTab>>;
}) {
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // Applied filters (used for actual filtering)
  const [filterDate, setFilterDate] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterSubjects, setFilterSubjects] = useState<string[]>([]);

  // Draft filters (inside modal before Apply)
  const [draftDate, setDraftDate] = useState('');
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [draftSubjects, setDraftSubjects] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const filterRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!showFilter) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFilter]);

  // Sync draft with applied when opening modal
  const openFilter = () => {
    setDraftDate(filterDate);
    setDraftFrom(filterFrom);
    setDraftTo(filterTo);
    setDraftSubjects(filterSubjects);
    setShowFilter(true);
  };

  const applyFilters = () => {
    setFilterDate(draftDate);
    setFilterFrom(draftFrom);
    setFilterTo(draftTo);
    setFilterSubjects(draftSubjects);
    setPage(1);
    setShowFilter(false);
  };

  const resetDraft = () => {
    setDraftDate('');
    setDraftFrom('');
    setDraftTo('');
    setDraftSubjects([]);
  };

  const clearAllFilters = () => {
    setFilterDate('');
    setFilterFrom('');
    setFilterTo('');
    setFilterSubjects([]);
    setPage(1);
  };

  const allSubjects = useMemo(() => {
    return Array.from(SUBJECT_FILTER_OPTIONS).sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    let list = results;
    if (selectedTab === 'Mock') {
      list = list.filter((r) => r.source === 'mock');
    } else if (selectedTab === 'Compulsory') {
      list = list.filter(
        (r) =>
          r.source === 'practice' &&
          COMPULSORY_SUBJECTS.includes(r.subject as (typeof COMPULSORY_SUBJECTS)[number])
      );
    } else if (selectedTab === 'Optional') {
      list = list.filter(
        (r) =>
          r.source === 'practice' &&
          OPTIONAL_SUBJECTS.includes(r.subject as (typeof OPTIONAL_SUBJECTS)[number])
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => (r.subject || '').toLowerCase().includes(q));
    }
    if (filterDate) {
      list = list.filter((r) => new Date(r.createdAt).toLocaleDateString('en-CA') === filterDate);
    }
    if (filterFrom) {
      list = list.filter((r) => new Date(r.createdAt).toLocaleDateString('en-CA') >= filterFrom);
    }
    if (filterTo) {
      list = list.filter((r) => new Date(r.createdAt).toLocaleDateString('en-CA') <= filterTo);
    }
    if (filterSubjects.length > 0) {
      list = list.filter((r) => {
        const label = r.source === 'mock' ? 'Mock tests' : r.subject || '';
        return filterSubjects.includes(label);
      });
    }
    return list;
  }, [results, selectedTab, search, filterDate, filterFrom, filterTo, filterSubjects]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const hasActiveFilters = !!(filterDate || filterFrom || filterTo || filterSubjects.length > 0);
  const hasDraftChanges = !!(draftDate || draftFrom || draftTo || draftSubjects.length > 0);

  // Active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [
    ...(filterDate ? [{ label: `Date: ${filterDate}`, onRemove: () => { setFilterDate(''); setPage(1); } }] : []),
    ...(filterFrom || filterTo ? [{ label: `Range: ${filterFrom || '…'} → ${filterTo || '…'}`, onRemove: () => { setFilterFrom(''); setFilterTo(''); setPage(1); } }] : []),
    ...filterSubjects.map((s) => ({ label: s, onRemove: () => { setFilterSubjects((prev) => prev.filter((x) => x !== s)); setPage(1); } })),
  ];

  return (
    <div className="space-y-4">
      {/* Search + Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by subject..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={openFilter}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors',
              hasActiveFilters
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs">
                {activeChips.length}
              </span>
            )}
          </button>

          {showFilter && (
            <div className="absolute right-0 top-full mt-2 z-30 w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl">
              {/* Modal header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Filters</span>
                <button type="button" onClick={() => setShowFilter(false)}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Filter by Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Filter by Date</label>
                  <input
                    type="date"
                    value={draftDate}
                    onChange={(e) => { setDraftDate(e.target.value); setDraftFrom(''); setDraftTo(''); }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Filter by Date Range */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Filter by Date Range</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start</span>
                      <input
                        type="date"
                        value={draftFrom}
                        onChange={(e) => { setDraftFrom(e.target.value); setDraftDate(''); }}
                        className="w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End</span>
                      <input
                        type="date"
                        value={draftTo}
                        onChange={(e) => { setDraftTo(e.target.value); setDraftDate(''); }}
                        className="w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter by Subject — dropdown */}
                {allSubjects.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Filter by Subject</label>
                    <select
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !draftSubjects.includes(val)) {
                          setDraftSubjects((prev) => [...prev, val]);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a subject...</option>
                      {allSubjects.filter((s) => !draftSubjects.includes(s)).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {draftSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {draftSubjects.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {s}
                            <button type="button" onClick={() => setDraftSubjects((prev) => prev.filter((x) => x !== s))}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal footer — Reset + Apply */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={resetDraft}
                  disabled={!hasDraftChanges}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 rounded-full bg-gray-100 dark:bg-gray-800 p-1">
          {RESULT_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedTab === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {chip.label}
              <button type="button" onClick={chip.onRemove}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 underline transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* List */}
      {paginated.length === 0 ? (
        <p className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">No results match your search or filters.</p>
      ) : (
        <div className="max-h-[520px] overflow-y-auto space-y-3 pr-1">
          {paginated.map((r) => (
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
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-0 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {safePage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { user } = useAuth();
  const [latestPractice, setLatestPractice] = useState<LatestPracticeDetail | null>(null);
  const [results, setResults] = useState<TestHistoryItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<ResultTab>('All');
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

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading results...</p>
      ) : (
        <ResultsList
          results={displayedResults}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </div>
  );
}
