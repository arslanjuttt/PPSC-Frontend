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

const MCQ_COUNT = 10;

export function getMcqsForSubject(slug: string): JsonMcq[] {
  const source = SOURCE_MAP[slug];
  if (source) {
    return source.questions.slice(0, MCQ_COUNT);
  }
  const samples = subjectSampleMcqs[slug as keyof typeof subjectSampleMcqs];
  if (samples?.length) {
    return samples.slice(0, MCQ_COUNT);
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
