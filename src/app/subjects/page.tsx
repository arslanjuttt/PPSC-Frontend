'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Landmark,
  Lightbulb,
  Scale,
  Atom,
  History,
  Sprout,
  Users,
  Cpu,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COMPULSORY_SUBJECTS = [
  { name: 'English', icon: BookOpen, slug: 'english' },
  { name: 'Urdu', icon: BookOpen, slug: 'urdu' },
  { name: 'Pak Studies', icon: Landmark, slug: 'pak-studies' },
  { name: 'Islamic Studies', icon: Scale, slug: 'islamic-studies' },
  { name: 'General Knowledge', icon: Lightbulb, slug: 'general-knowledge' },
] as const;

const OPTIONAL_SUBJECTS = [
  { name: 'Ecommerce', icon: ShoppingCart, slug: 'ecommerce' },
  { name: 'Physics', icon: Atom, slug: 'physics' },
  { name: 'History', icon: History, slug: 'history' },
  { name: 'Agriculture', icon: Sprout, slug: 'agriculture' },
  { name: 'Sociology', icon: Users, slug: 'sociology' },
  { name: 'Computer Science', icon: Cpu, slug: 'computer-science' },
] as const;

type Tab = 'compulsory' | 'optional';

export default function SubjectsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('compulsory');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Subjects</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a subject to practice. Compulsory subjects are required; optional subjects let you specialize.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('compulsory')}
          className={cn(
            'px-6 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'compulsory'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          Compulsory
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('optional')}
          className={cn(
            'px-6 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'optional'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          Optional
        </button>
      </div>

      {/* Subject grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTab === 'compulsory' &&
          COMPULSORY_SUBJECTS.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link
                key={subject.slug}
                href={`/practice?subject=${subject.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Compulsory</p>
                  </div>
                </div>
              </Link>
            );
          })}
        {activeTab === 'optional' &&
          OPTIONAL_SUBJECTS.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link
                key={subject.slug}
                href={`/practice?subject=${subject.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-lg group-hover:bg-accent/20 dark:group-hover:bg-accent/30 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Optional</p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
