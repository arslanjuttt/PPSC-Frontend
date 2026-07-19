'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Copy, Download, Loader2, Map, Send } from 'lucide-react';
import { chatApi } from '@/lib/api';

const PLAN_OPTIONS = ['daily', 'weekly', 'monthly'] as const;
const SYSTEM_PROMPT = `You are a roadmap generator for PPSC exam preparation. Only output a study roadmap in a clear, structured format. Do not answer unrelated questions or provide general chat. Use the user details to build a personalized roadmap that includes study blocks, weak-subject focus, revision cycles, and exam countdown planning.`;

function buildRoadmapPrompt(values: {
  planType: string;
  examDate: string;
  weakSubjects: string;
  strongSubjects: string;
  studyHours: string;
  extraDetails: string;
}) {
  return `Generate a personalized PPSC study roadmap using the information below.

Plan type: ${values.planType}
Exam date: ${values.examDate}
Weak subjects: ${values.weakSubjects || 'none specified'}
Strong subjects: ${values.strongSubjects || 'none specified'}
Preferred study hours per day: ${values.studyHours || 'not specified'}
Additional details: ${values.extraDetails || 'none'}

Produce a study roadmap only. Use numbered steps, weekly/daily milestones, and clear subject priorities. Do not answer any other questions or add unrelated explanations.`;
}

export default function RoadmapGeneratorPage() {
  const [planType, setPlanType] = useState<typeof PLAN_OPTIONS[number]>('weekly');
  const [examDate, setExamDate] = useState('');
  const [weakSubjects, setWeakSubjects] = useState('');
  const [strongSubjects, setStrongSubjects] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [extraDetails, setExtraDetails] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!examDate) {
      setError('Please enter your exam date to generate an accurate roadmap.');
      return;
    }

    setError(null);
    setRoadmap('');
    setIsLoading(true);

    const prompt = buildRoadmapPrompt({
      planType,
      examDate,
      weakSubjects,
      strongSubjects,
      studyHours,
      extraDetails,
    });

    try {
      const response = await chatApi.send({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      });
      setRoadmap(response.data.text?.trim() || 'No roadmap could be generated.');
    } catch (err) {
      setError('Unable to generate the roadmap right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRoadmap = async () => {
    if (!roadmap) return;
    try {
      await navigator.clipboard.writeText(roadmap);
      setCopySuccess('Copied to clipboard');
      window.setTimeout(() => setCopySuccess(null), 2500);
    } catch {
      setCopySuccess('Copy failed.');
    }
  };

  const handleDownloadRoadmap = () => {
    if (!roadmap) return;
    const file = new Blob([roadmap], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ppsc-roadmap-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

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
          <Map className="w-6 h-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roadmap Generator</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Generate a focused PPSC study roadmap. Answer the quick questions and get a tailored plan for weak subjects, strong subjects, and your exam timeline.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form
          className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Roadmap type</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {PLAN_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPlanType(option)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      planType === option
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)} plan
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exam date <span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  value={examDate}
                  onChange={(event) => setExamDate(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  required
                  aria-required="true"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study hours per day</span>
                <input
                  type="text"
                  value={studyHours}
                  onChange={(event) => setStudyHours(event.target.value)}
                  placeholder="e.g. 3-4 hours"
                  className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weak subjects</span>
              <input
                type="text"
                value={weakSubjects}
                onChange={(event) => setWeakSubjects(event.target.value)}
                placeholder="e.g. English, Pak Studies"
                className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Strong subjects</span>
              <input
                type="text"
                value={strongSubjects}
                onChange={(event) => setStrongSubjects(event.target.value)}
                placeholder="e.g. Current Affairs, History"
                className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional details</span>
              <textarea
                value={extraDetails}
                onChange={(event) => setExtraDetails(event.target.value)}
                rows={4}
                placeholder="Any exam target, study preferences, or special constraints"
                className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Generate roadmap
          </button>
        </form>

        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-sm min-h-80">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400 font-semibold">Output</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated roadmap</h2>
            </div>
          </div>

          {roadmap ? (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyRoadmap}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:text-primary"
                  >
                    <Copy className="w-4 h-4" />
                    Copy roadmap
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadRoadmap}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    <Download className="w-4 h-4" />
                    Download roadmap
                  </button>
                </div>
                {copySuccess && <span className="text-sm text-emerald-600 dark:text-emerald-300">{copySuccess}</span>}
              </div>
              <div className="whitespace-pre-wrap rounded-3xl border border-gray-200 bg-gray-50 p-6 text-sm leading-7 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                {roadmap}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 p-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <p className="text-sm">Fill in the details and generate a tailored PPSC roadmap here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
