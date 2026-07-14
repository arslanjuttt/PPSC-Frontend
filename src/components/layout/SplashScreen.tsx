'use client';

import Image from 'next/image';

interface SplashScreenProps {
  visible?: boolean;
}

export default function SplashScreen({ visible = true }: SplashScreenProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center justify-center gap-6 px-6 text-center">
        <Image
          src="/HomeLogo.jpeg"
          alt="PPSC Preparation App"
          width={320}
          height={320}
          priority
          className="h-auto w-[min(70vw,320px)] object-contain"
        />
        <h1 className="max-w-md text-xl font-semibold leading-snug text-primary sm:text-2xl md:text-3xl">
          AI Powered PPSC Preparation Web App
        </h1>
      </div>
    </div>
  );
}
