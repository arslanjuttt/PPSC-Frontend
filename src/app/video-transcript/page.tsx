'use client';

import { useState } from 'react';
import { Video, Loader2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApiErrorMessage, transcriptApi, translateApi } from '@/lib/api';


export default function VideoTranscriptPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const [copiedSection, setCopiedSection] = useState<'transcript' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setTranscript(null);
    setIsLoading(true);
    setIsTranslating(false);

    try {
      const response = await transcriptApi.generate(trimmed);
      const text = response.data?.transcript?.trim() || '';
      if (!text) {
        setError('No transcript could be generated for this video.');
        return;
      }
      setTranscript(text);
    } catch (error: unknown) {

      setError(getApiErrorMessage(error, 'Network error. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, section: 'transcript') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      setError('Could not copy to clipboard.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-linear-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Video className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Video Transcript & Summary</h1>
        </div>
        <p className="text-white/90 text-lg">
          Paste a YouTube video link to generate a transcript from the video captions.
        </p>
        <p className="text-white/80 text-sm mt-2">
          Works even if the video does not include captions or subtitles.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
      >
        <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Video URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="video-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            disabled={isLoading}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
            aria-describedby={error ? 'video-url-error' : undefined}
          />
          <button
            type="submit"
            disabled={isLoading || isTranslating}

            className={cn(
              'px-6 py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary/90',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'inline-flex items-center justify-center gap-2 min-w-[180px]'
            )}
          >
            {isLoading || isTranslating ? (

              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                {isTranslating ? 'Translating…' : 'Generating…'}

              </>
            ) : (
              'Generate transcript'
            )}
          </button>
        </div>

        {error && (

          <div
            id="video-url-error"
            role="alert"
            className="mt-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm"
          >
            {error}
          </div>
        )}
      </form>

      {transcript && (
        <section
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          aria-labelledby="transcript-heading"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="transcript-heading" className="text-xl font-semibold text-gray-900 dark:text-white">
              Transcript
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(transcript, 'transcript')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {copiedSection === 'transcript' ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" aria-hidden />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden />
                    Copy transcript
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!transcript || isLoading || isTranslating) return;
                  try {
                    setIsTranslating(true);
                    const translatedResponse = await translateApi.translateTranscriptToEnglish(transcript);
                    const translated = (translatedResponse.data as { translatedText?: string })?.translatedText?.trim();
                    if (translated) setTranscript(translated);
                  } finally {
                    setIsTranslating(false);
                  }
                }}
                disabled={isLoading || isTranslating}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Translating…
                  </>
                ) : (
                  'Translate to English'
                )}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="max-h-96 overflow-auto text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
