import { MCQ } from '@/types';

export const sampleMCQs: MCQ[] = [
  // General Knowledge
  {
    id: '1',
    question: 'What is the capital of Pakistan?',
    options: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'],
    correctAnswer: 2,
    explanation: 'Islamabad is the capital city of Pakistan, established in 1960.',
    subject: 'General Knowledge',
    topic: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'Who was the founder of Pakistan?',
    options: ['Allama Iqbal', 'Quaid-e-Azam Muhammad Ali Jinnah', 'Liaquat Ali Khan', 'Sir Syed Ahmad Khan'],
    correctAnswer: 1,
    explanation: 'Quaid-e-Azam Muhammad Ali Jinnah is known as the founder of Pakistan.',
    subject: 'General Knowledge',
    topic: 'History',
    difficulty: 'easy'
  },
  
  // English
  {
    id: '3',
    question: 'Choose the correct synonym for "Abundant":',
    options: ['Scarce', 'Plentiful', 'Limited', 'Rare'],
    correctAnswer: 1,
    explanation: 'Abundant means existing in large quantities; plentiful.',
    subject: 'English',
    topic: 'Vocabulary',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'Identify the correct sentence:',
    options: [
      'He don\'t like coffee',
      'He doesn\'t likes coffee',
      'He doesn\'t like coffee',
      'He don\'t likes coffee'
    ],
    correctAnswer: 2,
    explanation: 'The correct form uses "doesn\'t" (does not) with the base form of the verb "like".',
    subject: 'English',
    topic: 'Grammar',
    difficulty: 'easy'
  },

  // Islamiat
  {
    id: '5',
    question: 'How many Surahs are there in the Holy Quran?',
    options: ['114', '115', '113', '116'],
    correctAnswer: 0,
    explanation: 'The Holy Quran contains 114 Surahs (chapters).',
    subject: 'Islamiat',
    topic: 'Quran',
    difficulty: 'easy'
  },
  {
    id: '6',
    question: 'What is the first pillar of Islam?',
    options: ['Salah', 'Zakat', 'Shahada', 'Hajj'],
    correctAnswer: 2,
    explanation: 'Shahada (declaration of faith) is the first pillar of Islam.',
    subject: 'Islamiat',
    topic: 'Pillars of Islam',
    difficulty: 'easy'
  },

  // Pakistan Studies
  {
    id: '7',
    question: 'When did Pakistan become a republic?',
    options: ['1947', '1956', '1973', '1971'],
    correctAnswer: 1,
    explanation: 'Pakistan became a republic on March 23, 1956, when its first constitution was adopted.',
    subject: 'Pakistan Studies',
    topic: 'Constitutional History',
    difficulty: 'medium'
  },
  {
    id: '8',
    question: 'Which is the longest river in Pakistan?',
    options: ['River Chenab', 'River Ravi', 'River Indus', 'River Jhelum'],
    correctAnswer: 2,
    explanation: 'River Indus is the longest river in Pakistan, flowing for about 3,180 kilometers.',
    subject: 'Pakistan Studies',
    topic: 'Geography',
    difficulty: 'easy'
  },

  // Everyday Science
  {
    id: '9',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    explanation: 'Au is the chemical symbol for Gold, derived from the Latin word "aurum".',
    subject: 'Everyday Science',
    topic: 'Chemistry',
    difficulty: 'medium'
  },
  {
    id: '10',
    question: 'How many bones are there in an adult human body?',
    options: ['206', '208', '210', '204'],
    correctAnswer: 0,
    explanation: 'An adult human body has 206 bones.',
    subject: 'Everyday Science',
    topic: 'Biology',
    difficulty: 'medium'
  },

  // Analytical/IQ
  {
    id: '11',
    question: 'If 5 + 3 = 28, 9 + 1 = 810, 8 + 6 = 214, then 5 + 4 = ?',
    options: ['19', '91', '18', '81'],
    correctAnswer: 0,
    explanation: 'The pattern is: (a-b)(a+b). So 5+4 = (5-4)(5+4) = 1×9 = 19.',
    subject: 'Analytical/IQ',
    topic: 'Pattern Recognition',
    difficulty: 'hard'
  },
  {
    id: '12',
    question: 'Complete the series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correctAnswer: 1,
    explanation: 'The differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42.',
    subject: 'Analytical/IQ',
    topic: 'Number Series',
    difficulty: 'medium'
  },

  // Current Affairs
  {
    id: '13',
    question: 'Who is the current Prime Minister of Pakistan? (As of 2024)',
    options: ['Imran Khan', 'Shehbaz Sharif', 'Bilawal Bhutto', 'Maryam Nawaz'],
    correctAnswer: 1,
    explanation: 'Shehbaz Sharif is serving as the Prime Minister of Pakistan.',
    subject: 'Current Affairs',
    topic: 'Politics',
    difficulty: 'easy'
  },
  {
    id: '14',
    question: 'Which country hosted the 2022 FIFA World Cup?',
    options: ['Russia', 'Brazil', 'Qatar', 'Germany'],
    correctAnswer: 2,
    explanation: 'Qatar hosted the 2022 FIFA World Cup from November to December 2022.',
    subject: 'Current Affairs',
    topic: 'Sports',
    difficulty: 'easy'
  },

  // Additional questions for better variety
  {
    id: '15',
    question: 'What is the largest province of Pakistan by area?',
    options: ['Punjab', 'Sindh', 'Balochistan', 'KPK'],
    correctAnswer: 2,
    explanation: 'Balochistan is the largest province of Pakistan by area.',
    subject: 'Pakistan Studies',
    topic: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '16',
    question: 'Which vitamin is produced when skin is exposed to sunlight?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 3,
    explanation: 'Vitamin D is produced when skin is exposed to sunlight.',
    subject: 'Everyday Science',
    topic: 'Biology',
    difficulty: 'easy'
  },
  {
    id: '17',
    question: 'What is the antonym of "Optimistic"?',
    options: ['Hopeful', 'Positive', 'Pessimistic', 'Confident'],
    correctAnswer: 2,
    explanation: 'Pessimistic is the antonym of optimistic.',
    subject: 'English',
    topic: 'Vocabulary',
    difficulty: 'easy'
  },
  {
    id: '18',
    question: 'How many times is the word "Allah" mentioned in the Holy Quran?',
    options: ['2698', '2699', '2700', '2701'],
    correctAnswer: 0,
    explanation: 'The word "Allah" is mentioned 2698 times in the Holy Quran.',
    subject: 'Islamiat',
    topic: 'Quran',
    difficulty: 'hard'
  },
  {
    id: '19',
    question: 'If A = 1, B = 2, C = 3, then what is the value of "CAB"?',
    options: ['312', '321', '123', '132'],
    correctAnswer: 0,
    explanation: 'C=3, A=1, B=2, so CAB = 312.',
    subject: 'Analytical/IQ',
    topic: 'Logical Reasoning',
    difficulty: 'easy'
  },
  {
    id: '20',
    question: 'Which organization was established in 1945 to maintain world peace?',
    options: ['NATO', 'United Nations', 'World Bank', 'IMF'],
    correctAnswer: 1,
    explanation: 'The United Nations was established in 1945 to maintain international peace and security.',
    subject: 'General Knowledge',
    topic: 'International Organizations',
    difficulty: 'medium'
  }
];