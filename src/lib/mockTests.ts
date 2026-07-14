export interface MockTestConfig {
  id: number;
  title: string;
  questionCount: number;
  duration: number;
  description: string;
}

/** 100 MCQs = 120 minutes; other tests scale proportionally (1.2 min per MCQ). */
export const MOCK_TESTS: MockTestConfig[] = [
  {
    id: 1,
    title: 'Mock Test 1',
    questionCount: 50,
    duration: 60,
    description: '50 MCQs mixed from English, Urdu, Pak Studies, Islamic Studies, GK, and all optional subjects',
  },
  {
    id: 2,
    title: 'Mock Test 2',
    questionCount: 100,
    duration: 120,
    description: '100 MCQs mixed from English, Urdu, Pak Studies, Islamic Studies, GK, and all optional subjects',
  },
  {
    id: 3,
    title: 'Mock Test 3',
    questionCount: 150,
    duration: 180,
    description: '150 MCQs mixed from English, Urdu, Pak Studies, Islamic Studies, GK, and all optional subjects',
  },
  {
    id: 4,
    title: 'Mock Test 4',
    questionCount: 200,
    duration: 240,
    description: '200 MCQs mixed from English, Urdu, Pak Studies, Islamic Studies, GK, and all optional subjects',
  },
];

export function getMockTestById(id: number): MockTestConfig | undefined {
  return MOCK_TESTS.find((test) => test.id === id);
}
