import { useEffect, useRef, useState } from 'react';

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionResultItem = { transcript: string };

type SpeechRecognitionResults = {
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
};

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results?: SpeechRecognitionResults;
}

interface SpeechRecognitionErrorEvent {
  error?: string;
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;

  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export function useSpeechRecognition({ lang = 'en-US' } = {}) {
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setSpeechSupported(Boolean(getSpeechRecognition()));
  }, []);

  const createRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcriptText = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcriptText) {
        setTranscript(transcriptText);
        setError(null);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error || 'unknown'}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  const startListening = () => {
    if (!speechSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = createRecognition();
    if (!recognition) {
      setError('Unable to initialize speech recognition.');
      return;
    }

    try {
      recognition.start();
      setIsRecording(true);
      setError(null);
    } catch {
      setError('Unable to start speech recognition. Please try again.');
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

  const resetTranscript = () => setTranscript('');

  return {
    speechSupported,
    isRecording,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
