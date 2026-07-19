import { useMemo, useRef, useState } from 'react';

export function useSpeechSynthesis() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    if (!supported || typeof window === 'undefined') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!supported || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return useMemo(
    () => ({ supported, speak, stop, isSpeaking }),
    [supported, isSpeaking]
  );
}
