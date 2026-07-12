import type { JsonMcq } from '@/types';

function mcqs(n: number, q: string, opts: { A: string; B: string; C: string; D: string }, correct: 'A' | 'B' | 'C' | 'D'): JsonMcq {
  return { question_number: n, question: q, options: opts, correct_answer: correct };
}

const urdu: JsonMcq[] = [
  mcqs(1, 'اردو حروف تہجی میں کل کتنے حروف ہیں؟', { A: '35', B: '36', C: '37', D: '38' }, 'C'),
  mcqs(2, '"مرزا اسد اللہ خان غالب" کا سنِ وفات کیا ہے؟', { A: '1868', B: '1869', C: '1870', D: '1871' }, 'B'),
  mcqs(3, 'اقبال کا مشہور شعری مجموعہ "بانگ درا" کب شائع ہوا؟', { A: '1922', B: '1923', C: '1924', D: '1925' }, 'C'),
  mcqs(4, 'مولانا الطاف حسین حالی نے "مسدس حالی" کس مقصد کے لیے لکھی؟', { A: 'جنگِ آزادی', B: 'تعلیم و ترقی', C: 'مذہب', D: 'سیاست' }, 'B'),
  mcqs(5, '"دیوانِ غالب" میں غالباً کتنے غزل کے اشعار ہیں؟', { A: 'تقریباً 1800', B: 'تقریباً 1900', C: 'تقریباً 2000', D: 'تقریباً 2100' }, 'A'),
  mcqs(6, 'پاکستان کا قومی شاعر کسے قرار دیا گیا؟', { A: 'فیض احمد فیض', B: 'احمد فراز', C: 'علامہ اقبال', D: 'حبیب جالب' }, 'C'),
  mcqs(7, 'لفظ "اردو" کا ماخذ کیا ہے؟', { A: 'عربی', B: 'فارسی', C: 'ترکی', D: 'ہندی' }, 'C'),
  mcqs(8, 'شاہ عبد اللطيف بھٹائی کی مشہور تصنیف کا نام کیا ہے؟', { A: 'سُر نینی', B: 'شاه جو رسالو', C: 'کلیاتِ شاہ', D: 'شاہ کے دوہے' }, 'B'),
  mcqs(9, 'مثنوی "سی حرفی" کس نے لکھی؟', { A: 'امیر خسرو', B: 'میر تقی میر', C: 'مرزا غالب', D: 'مولانا حالی' }, 'A'),
  mcqs(10, 'اردو کی پہلی مکمل لغت کون سی مانے جاتی ہے؟', { A: 'نور اللغات', B: 'فیروز اللغات', C: 'جامع اللغات', D: 'فرہنگِ آصفیہ' }, 'D'),
];

const islamicStudies: JsonMcq[] = [
  mcqs(1, 'How many pillars of Islam are there?', { A: '4', B: '5', C: '6', D: '7' }, 'B'),
  mcqs(2, 'In which month does Ramadan fall?', { A: 'Shawwal', B: 'Rajab', C: 'Shaaban', D: 'Ramadan (9th)' }, 'D'),
  mcqs(3, 'Who was the first Caliph of Islam?', { A: 'Umar (R.A.)', B: 'Abu Bakr (R.A.)', C: 'Usman (R.A.)', D: 'Ali (R.A.)' }, 'B'),
  mcqs(4, 'How many Surahs are in the Holy Quran?', { A: '112', B: '114', C: '116', D: '118' }, 'B'),
  mcqs(5, 'Which surah is known as the "Heart of the Quran"?', { A: 'Al-Fatiha', B: 'Yaseen', C: 'Al-Baqarah', D: 'Al-Ikhlas' }, 'B'),
  mcqs(6, 'How many times did the Holy Prophet (PBUH) perform Hajj?', { A: '1', B: '2', C: '3', D: '4' }, 'A'),
  mcqs(7, 'What is the first pillar of Islam?', { A: 'Salah', B: 'Zakat', C: 'Shahada', D: 'Hajj' }, 'C'),
  mcqs(8, 'Which battle was fought in the month of Ramadan?', { A: 'Badr', B: 'Uhud', C: 'Khandaq', D: 'Hunayn' }, 'A'),
  mcqs(9, 'Who compiled the Holy Quran in book form?', { A: 'Abu Bakr (R.A.)', B: 'Umar (R.A.)', C: 'Usman (R.A.)', D: 'Ali (R.A.)' }, 'C'),
  mcqs(10, 'What is the meaning of "Islam"?', { A: 'Peace', B: 'Submission to Allah', C: 'Prayer', D: 'Faith' }, 'B'),
];

const ecommerce: JsonMcq[] = [
  mcqs(1, 'What does B2B stand for in e-commerce?', { A: 'Business to Buyer', B: 'Business to Business', C: 'Buyer to Business', D: 'Back to Business' }, 'B'),
  mcqs(2, 'Which platform is widely used for online payment processing?', { A: 'WordPress', B: 'PayPal', C: 'Slack', D: 'Zoom' }, 'B'),
  mcqs(3, 'What is a "shopping cart" in e-commerce?', { A: 'A physical cart', B: 'Software that holds selected items before checkout', C: 'A delivery vehicle', D: 'A warehouse system' }, 'B'),
  mcqs(4, 'Which model involves consumers selling directly to other consumers?', { A: 'B2B', B: 'B2C', C: 'C2C', D: 'B2G' }, 'C'),
  mcqs(5, 'What does SSL stand for in secure online transactions?', { A: 'Secure Socket Layer', B: 'Simple Sales Link', C: 'System Security Lock', D: 'Safe Shopping License' }, 'A'),
  mcqs(6, 'What is "conversion rate" in e-commerce?', { A: 'Currency exchange rate', B: 'Percentage of visitors who make a purchase', C: 'Product return rate', D: 'Shipping speed' }, 'B'),
  mcqs(7, 'Which term describes pricing strategy that starts high and lowers over time?', { A: 'Penetration pricing', B: 'Skimming pricing', C: 'Bundle pricing', D: 'Dynamic pricing' }, 'B'),
  mcqs(8, 'What is "drop shipping"?', { A: 'Selling dropped products', B: 'Retailer does not keep stock; supplier ships directly', C: 'Free shipping', D: 'Same-day delivery' }, 'B'),
  mcqs(9, 'Which metric measures average order value?', { A: 'AOV', B: 'CPA', C: 'ROI', D: 'CTR' }, 'A'),
  mcqs(10, 'What does C2B mean in e-commerce?', { A: 'Consumer to Business', B: 'Company to Buyer', C: 'Commerce to Business', D: 'Cart to Basket' }, 'A'),
];

const physics: JsonMcq[] = [
  mcqs(1, 'What is the SI unit of force?', { A: 'Joule', B: 'Newton', C: 'Watt', D: 'Pascal' }, 'B'),
  mcqs(2, 'Who proposed the theory of relativity?', { A: 'Newton', B: 'Einstein', C: 'Galileo', D: 'Maxwell' }, 'B'),
  mcqs(3, 'What is the speed of light in vacuum (approximately)?', { A: '3 × 10⁶ m/s', B: '3 × 10⁸ m/s', C: '3 × 10¹⁰ m/s', D: '3 × 10¹² m/s' }, 'B'),
  mcqs(4, 'Which law states that every action has an equal and opposite reaction?', { A: 'First law of motion', B: 'Second law of motion', C: 'Third law of motion', D: 'Law of gravitation' }, 'C'),
  mcqs(5, 'What is the unit of electric current?', { A: 'Volt', B: 'Ohm', C: 'Ampere', D: 'Watt' }, 'C'),
  mcqs(6, 'Which particle has no electric charge?', { A: 'Proton', B: 'Electron', C: 'Neutron', D: 'Positron' }, 'C'),
  mcqs(7, 'What does Hooke\'s Law relate?', { A: 'Force and acceleration', B: 'Stress and strain', C: 'Current and voltage', D: 'Mass and energy' }, 'B'),
  mcqs(8, 'What is the acceleration due to gravity on Earth (approx.)?', { A: '8.9 m/s²', B: '9.8 m/s²', C: '10.2 m/s²', D: '11.0 m/s²' }, 'B'),
  mcqs(9, 'Which type of lens converges light?', { A: 'Concave', B: 'Convex', C: 'Plano-concave', D: 'Cylindrical' }, 'B'),
  mcqs(10, 'What is the unit of frequency?', { A: 'Newton', B: 'Hertz', C: 'Joule', D: 'Tesla' }, 'B'),
];

const history: JsonMcq[] = [
  mcqs(1, 'When did the French Revolution begin?', { A: '1787', B: '1789', C: '1791', D: '1793' }, 'B'),
  mcqs(2, 'Who was the first President of the United States?', { A: 'Thomas Jefferson', B: 'John Adams', C: 'George Washington', D: 'Benjamin Franklin' }, 'C'),
  mcqs(3, 'In which year did World War I begin?', { A: '1912', B: '1914', C: '1916', D: '1918' }, 'B'),
  mcqs(4, 'Who wrote "The Republic"?', { A: 'Aristotle', B: 'Socrates', C: 'Plato', D: 'Herodotus' }, 'C'),
  mcqs(5, 'Which empire built the Taj Mahal?', { A: 'Mughal', B: 'Maurya', C: 'Gupta', D: 'Delhi Sultanate' }, 'A'),
  mcqs(6, 'When did Pakistan gain independence?', { A: '1945', B: '1946', C: '1947', D: '1948' }, 'C'),
  mcqs(7, 'Who was known as the "Father of History"?', { A: 'Thucydides', B: 'Herodotus', C: 'Plutarch', D: 'Livy' }, 'B'),
  mcqs(8, 'In which year did the Berlin Wall fall?', { A: '1987', B: '1989', C: '1991', D: '1993' }, 'B'),
  mcqs(9, 'Which civilization developed along the Indus River?', { A: 'Mesopotamian', B: 'Indus Valley', C: 'Egyptian', D: 'Chinese' }, 'B'),
  mcqs(10, 'Who led the Salt March in India?', { A: 'Jawaharlal Nehru', B: 'Subhas Chandra Bose', C: 'Mahatma Gandhi', D: 'Sardar Patel' }, 'C'),
];

const agriculture: JsonMcq[] = [
  mcqs(1, 'What is the primary gas absorbed by plants during photosynthesis?', { A: 'Oxygen', B: 'Nitrogen', C: 'Carbon dioxide', D: 'Hydrogen' }, 'C'),
  mcqs(2, 'Which crop is known as the "golden fiber"?', { A: 'Cotton', B: 'Jute', C: 'Silk', D: 'Wool' }, 'B'),
  mcqs(3, 'What is crop rotation used for?', { A: 'Increasing pests', B: 'Improving soil fertility and reducing disease', C: 'Reducing yield', D: 'Single-crop farming' }, 'B'),
  mcqs(4, 'Which nutrient is most commonly limiting in soil?', { A: 'Carbon', B: 'Nitrogen', C: 'Oxygen', D: 'Hydrogen' }, 'B'),
  mcqs(5, 'What does NPK stand for in fertilizers?', { A: 'Nitrogen, Phosphorus, Potassium', B: 'Nitrate, Phosphate, Kalium', C: 'Natural, Processed, Known', D: 'None of these' }, 'A'),
  mcqs(6, 'Which practice involves growing different crops in the same area in sequenced seasons?', { A: 'Monoculture', B: 'Intercropping', C: 'Crop rotation', D: 'Fallowing' }, 'C'),
  mcqs(7, 'What is "irrigation"?', { A: 'Harvesting crops', B: 'Applying water to crops artificially', C: 'Planting seeds', D: 'Soil preparation' }, 'B'),
  mcqs(8, 'Which grain is a staple in Pakistan?', { A: 'Rice only', B: 'Wheat', C: 'Barley only', D: 'Maize only' }, 'B'),
  mcqs(9, 'What is "horticulture"?', { A: 'Animal husbandry', B: 'Cultivation of fruits, vegetables, and ornamental plants', C: 'Forestry', D: 'Fisheries' }, 'B'),
  mcqs(10, 'Which organ of the plant absorbs water and nutrients from soil?', { A: 'Leaf', B: 'Stem', C: 'Root', D: 'Flower' }, 'C'),
];

const sociology: JsonMcq[] = [
  mcqs(1, 'Who is often called the "Father of Sociology"?', { A: 'Karl Marx', B: 'Emile Durkheim', C: 'Auguste Comte', D: 'Max Weber' }, 'C'),
  mcqs(2, 'What is "socialization"?', { A: 'Government policy', B: 'Process of learning norms and values of society', C: 'Economic exchange', D: 'Political campaign' }, 'B'),
  mcqs(3, 'Which term describes a group of people living in a defined geographic area with a shared culture?', { A: 'Crowd', B: 'Society', C: 'Organization', D: 'Institution' }, 'B'),
  mcqs(4, 'What does "stratification" refer to in sociology?', { A: 'Soil layers', B: 'Division of society into hierarchical layers', C: 'Market segments', D: 'Education levels' }, 'B'),
  mcqs(5, 'Which type of family includes parents, children, and other relatives?', { A: 'Nuclear family', B: 'Extended family', C: 'Single-parent family', D: 'Blended family' }, 'B'),
  mcqs(6, 'What is a "norm" in sociology?', { A: 'Average value', B: 'Accepted rule or standard of behavior', C: 'Mathematical concept', D: 'Legal law' }, 'B'),
  mcqs(7, 'Who wrote "The Protestant Ethic and the Spirit of Capitalism"?', { A: 'Karl Marx', B: 'Max Weber', C: 'Emile Durkheim', D: 'Talcott Parsons' }, 'B'),
  mcqs(8, 'What is "deviance"?', { A: 'Mathematical deviation', B: 'Behavior that violates social norms', C: 'Statistical outlier', D: 'Legal term only' }, 'B'),
  mcqs(9, 'Which institution is primarily responsible for formal education?', { A: 'Family', B: 'School', C: 'Religion', D: 'Economy' }, 'B'),
  mcqs(10, 'What does "culture" encompass in sociology?', { A: 'Only arts and music', B: 'Beliefs, values, customs, and practices of a group', C: 'Genetic traits', D: 'Economic systems only' }, 'B'),
];

export const subjectSampleMcqs: Record<string, JsonMcq[]> = {
  urdu,
  'islamic-studies': islamicStudies,
  ecommerce,
  physics,
  history,
  agriculture,
  sociology,
};
