import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div>
        <h1 className="text-[72px] leading-none m-0 font-bold text-gray-900">404</h1>
        <p className="text-lg mt-2 mb-6 text-gray-600">This page does not exist.</p>
        <Link href="/dashboard" className="text-blue-600 underline hover:text-blue-500">Return home</Link>
      </div>
    </main>
  );
}
