import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_URL_LENGTH = 2048;
const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY || 'ed939c4a2db89c4f2d63726364e9d885b367e7dc6798f00dc929e0f9e85a04bc';
const SERPAPI_URL = 'https://serpapi.com/search.json';

interface VideoTranscriptRequest {
  url?: string;
}

function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) return null;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtube.com' && url.pathname === '/watch') {
      const id = url.searchParams.get('v');
      return id && YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null;
    }

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      return id && YOUTUBE_VIDEO_ID_REGEX.test(id) ? id : null;
    }
  } catch {
    return null;
  }

  return null;
}

function buildTranscriptText(data: unknown): string {
  if (!data || typeof data !== 'object') return '';

  const response = data as {
    transcript?: Array<{ snippet?: string }>;
    error?: string;
    search_metadata?: { status?: string };
  };

  if (response.error) {
    throw new Error(response.error);
  }

  if (response.search_metadata?.status && response.search_metadata.status !== 'Success') {
    throw new Error(`SerpAPI returned status: ${response.search_metadata.status}`);
  }

  const transcript = response.transcript ?? [];
  if (!Array.isArray(transcript)) return '';

  return transcript
    .map((item) => item?.snippet?.trim())
    .filter((text): text is string => Boolean(text))
    .join('\n\n');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let body: VideoTranscriptRequest;
    try {
      body = (await request.json()) as VideoTranscriptRequest;
    } catch {
      return new NextResponse('Invalid JSON body', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const url = body?.url;
    if (typeof url !== 'string' || !url.trim()) {
      return new NextResponse('URL is required and must be a non-empty string', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (url.length > MAX_URL_LENGTH) {
      return new NextResponse('URL is too long', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return new NextResponse('Please enter a valid YouTube video URL.', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const serpApiUrl = new URL(SERPAPI_URL);
    serpApiUrl.searchParams.set('engine', 'youtube_video_transcript');
    serpApiUrl.searchParams.set('v', videoId);
    serpApiUrl.searchParams.set('type', 'asr');
    serpApiUrl.searchParams.set('api_key', SERPAPI_API_KEY);

    const response = await fetch(serpApiUrl.toString());
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return new NextResponse(errorText || 'Unable to fetch transcript from SerpAPI.', {
        status: response.status,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const data = (await response.json()) as unknown;
    const transcript = buildTranscriptText(data);

    if (!transcript) {
      return new NextResponse('No transcript could be generated for this video.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    return new NextResponse(transcript, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Video transcript error:', error);
    return new NextResponse(error instanceof Error ? error.message : 'Failed to generate transcript.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
