export interface MockTestConfig {
  id: number;
  title: string;
  questionCount: number;
  duration: number;
  description: string;
}

export const MOCK_TESTS: MockTestConfig[] = [
  {
    id: 1,
    title: 'Mock Test 1',
    questionCount: 100,
    duration: 120,
    description: '100 MCQs mixed from English, Urdu, Pak Studies, Islamic Studies, GK, and all optional subjects',
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
    questionCount: 100,
    duration: 120,
    description: '100 MCQs mixed from English, Urdu, Pak Studies, Islamic Studies, GK, and all optional subjects',
  },
  {
    id: 4,
    title: 'Mock Test 4',
    questionCount: 100,
    duration: 120,
    description: '100 MCQs mixed from English, Urdu, Pak Studies, Islamic Studies, GK, and all optional subjects',
  },
];

export function getMockTestById(id: number): MockTestConfig | undefined {
  return MOCK_TESTS.find((test) => test.id === id);
}
