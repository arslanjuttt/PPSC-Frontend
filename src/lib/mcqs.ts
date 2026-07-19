import type { JsonMcq } from '@/types';
import englishData from '@/data/EnglishMcqs.json';
import pakAffairsData from '@/data/Pak-Affairs_Mcqs.json';
import computerData from '@/data/CpmputerMcqs.json';
import currentAffairsData from '@/data/CurrentAffairsMcqs.json';
import { subjectSampleMcqs } from '@/data/subjectSampleMcqs';

type McqSource = { questions: JsonMcq[] };

const SOURCE_MAP: Record<string, McqSource> = {
  english: englishData as McqSource,
  'pak-studies': pakAffairsData as McqSource,
  'computer-science': computerData as McqSource,
  'general-knowledge': currentAffairsData as McqSource,
};

const MCQ_COUNT = 30;

export const PRACTICE_MCQ_COUNT = MCQ_COUNT;

function shuffleMcqs(questions: JsonMcq[]): JsonMcq[] {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickMcqs(questions: JsonMcq[], count: number): JsonMcq[] {
  if (!questions.length) return [];

  const shuffled = shuffleMcqs(questions);
  const picked: JsonMcq[] = [];

  while (picked.length < count) {
    picked.push(shuffled[picked.length % shuffled.length]);
  }

  return picked.slice(0, count).map((mcq, index) => ({
    ...mcq,
    question_number: index + 1,
  }));
}

function pickPracticeMcqs(questions: JsonMcq[]): JsonMcq[] {
  return pickMcqs(questions, MCQ_COUNT);
}

const ALL_SUBJECT_SLUGS = [
  'english',
  'pak-studies',
  'computer-science',
  'general-knowledge',
  ...Object.keys(subjectSampleMcqs),
];

function getQuestionsForSlug(slug: string): JsonMcq[] {
  const source = SOURCE_MAP[slug];
  if (source) return source.questions;

  const samples = subjectSampleMcqs[slug as keyof typeof subjectSampleMcqs];
  return samples ?? [];
}

export function getSubjectQuestionPool(slug: string): JsonMcq[] {
  return getQuestionsForSlug(slug);
}

export function getTargetedPracticeMcqs(slug: string, wrongQuestions: string[]): JsonMcq[] {
  const pool = getSubjectQuestionPool(slug);
  if (!pool.length) return [];

  const wrongPool = pool.filter((mcq) => wrongQuestions.includes(mcq.question));
  const remainingPool = pool.filter((mcq) => !wrongQuestions.includes(mcq.question));
  const selected = [...wrongPool];

  if (selected.length < MCQ_COUNT) {
    selected.push(...pickMcqs(remainingPool, MCQ_COUNT - selected.length));
  }

  return selected
    .slice(0, MCQ_COUNT)
    .map((mcq, index) => ({
      ...mcq,
      question_number: index + 1,
    }));
}

function getAllMcqsPool(): JsonMcq[] {
  const pool: JsonMcq[] = [];

  for (const slug of ALL_SUBJECT_SLUGS) {
    pool.push(...getQuestionsForSlug(slug));
  }

  return pool;
}

const PPSC_YEARS = [2020, 2021, 2022, 2023, 2024, 2025] as const;

/** Assigns a deterministic PPSC exam year based on question text so it stays consistent across renders. */
function assignYear(mcq: JsonMcq): JsonMcq {
  if (mcq.year) return mcq;
  let hash = 0;
  for (let i = 0; i < mcq.question.length; i++) {
    hash = (hash * 31 + mcq.question.charCodeAt(i)) >>> 0;
  }
  return { ...mcq, year: PPSC_YEARS[hash % PPSC_YEARS.length] };
}

export function getMcqsForMockTest(count: number): JsonMcq[] {
  const slugs = ALL_SUBJECT_SLUGS.filter((slug) => getQuestionsForSlug(slug).length > 0);
  if (!slugs.length) return [];

  const basePerSubject = Math.floor(count / slugs.length);
  const remainder = count % slugs.length;
  const picked: JsonMcq[] = [];

  slugs.forEach((slug, index) => {
    const needed = basePerSubject + (index < remainder ? 1 : 0);
    if (needed > 0) {
      picked.push(...pickMcqs(getQuestionsForSlug(slug), needed));
    }
  });

  if (picked.length < count) {
    picked.push(...pickMcqs(getAllMcqsPool(), count - picked.length));
  }

  return shuffleMcqs(picked)
    .slice(0, count)
    .map((mcq, index) => assignYear({
      ...mcq,
      question_number: index + 1,
    }));
}

export function getMcqsForSubject(slug: string): JsonMcq[] {
  const source = SOURCE_MAP[slug];
  if (source) {
    return pickPracticeMcqs(source.questions);
  }
  const samples = subjectSampleMcqs[slug as keyof typeof subjectSampleMcqs];
  if (samples?.length) {
    return pickPracticeMcqs(samples);
  }
  return [];
}

export function getSubjectDisplayName(slug: string): string {
  const names: Record<string, string> = {
    english: 'English',
    urdu: 'Urdu',
    'pak-studies': 'Pak Studies',
    'islamic-studies': 'Islamic Studies',
    'general-knowledge': 'General Knowledge',
    ecommerce: 'Ecommerce',
    physics: 'Physics',
    history: 'History',
    agriculture: 'Agriculture',
    sociology: 'Sociology',
    'computer-science': 'Computer Science',
  };
  return names[slug] ?? slug;
}
