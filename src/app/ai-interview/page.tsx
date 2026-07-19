'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, Loader2, Mic, Mic2, Send, Sparkles, StopCircle, User } from 'lucide-react';
import { chatApi } from '@/lib/api';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/lib/hooks/useSpeechSynthesis';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are an AI IOCE interview coach for PPSC candidates. Conduct a mock interview in a step-by-step way. Ask one interview question at a time, wait for the user's answer, then provide short feedback and the next question. Focus on public service, administrative decision-making, current affairs, and PPSC interview topics. Keep the flow like an interview, concise and encouraging.`;

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [inputMode, setInputMode] = useState<'type' | 'speak'>('type');
  const [responseMode, setResponseMode] = useState<'text' | 'voice'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    speechSupported,
    isRecording,
    transcript: speechTranscript,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const { supported: synthesisSupported, speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();

  const canAnswer = messages.length > 0 && !isLoading && !isSpeaking;

  useEffect(() => {
    if (speechTranscript) {
      setInput(speechTranscript);
    }
  }, [speechTranscript]);

  const startInterview = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await chatApi.send({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'Start the IOCE interview mock. Ask the first question.' },
        ],
      });
      const text = response.data.text?.trim() || 'Unable to start the interview. Please try again.';
      setMessages([{ id: crypto.randomUUID(), role: 'assistant', content: text }]);
      if (responseMode === 'voice' && synthesisSupported) {
        speak(text);
      }
    } catch {
      setError('Unable to start the interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setError(null);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.send({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...updatedMessages.map((message) => ({ role: message.role, content: message.content })),
        ],
      });
      const text = response.data.text?.trim() || 'No response received. Please try again.';
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: text,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (responseMode === 'voice' && synthesisSupported) {
        speak(text);
      }
    } catch {
      setError('Unable to continue the interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setInput('');
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="w-6 h-6" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Interview Preparation</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Practice a mock interview with AI using Google Gemini. The AI will ask IOCE-style questions, then review your answer and ask the next question.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr]">
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400 font-semibold">Mock Interview</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">IOCE Interview Practice</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                Restart
              </button>
              <button
                type="button"
                onClick={startInterview}
                disabled={isLoading}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start Interview'}
              </button>
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          {speechError && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{speechError}</p>}

          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">Press Start Interview to begin your AI-powered IOCE mock interview.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-3xl p-4 ${
                    message.role === 'assistant'
                      ? 'bg-gray-100 dark:bg-gray-900'
                      : 'bg-primary/5 dark:bg-primary/10 self-end'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {message.role === 'assistant' ? (
                        <Bot className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {message.role === 'assistant' ? 'AI Interviewer' : 'Your answer'}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your response
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Input mode:</span>
                  <button
                    type="button"
                    onClick={() => setInputMode('type')}
                    disabled={!canAnswer}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      inputMode === 'type'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                    } ${!canAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Type
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('speak')}
                    disabled={!canAnswer}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      inputMode === 'speak'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                    } ${!canAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Speak
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">AI response:</span>
                  <button
                    type="button"
                    onClick={() => setResponseMode('text')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      responseMode === 'text'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    Text
                  </button>
                      <button
                    type="button"
                    onClick={() => setResponseMode('voice')}
                    disabled={!synthesisSupported}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      responseMode === 'voice'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                    } ${!synthesisSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Voice
                  </button>
                  {responseMode === 'voice' && (
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      disabled={!isSpeaking}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                    >
                      <StopCircle className="w-4 h-4 inline-block mr-2" />
                      Stop AI
                    </button>
                  )}
                </div>
              </div>
            </div>

            {inputMode === 'speak' && (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                <p className="mb-3">Use your voice to answer the AI interviewer. Speak clearly and stop when you are done.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={startListening}
                    disabled={!speechSupported || isRecording || !canAnswer}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Mic2 className="w-4 h-4" />
                    {isRecording ? 'Listening…' : 'Start speaking'}
                  </button>
                  <button
                    type="button"
                    onClick={stopListening}
                    disabled={!isRecording}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  >
                    <StopCircle className="w-4 h-4" />
                    Stop listening
                  </button>
                </div>
                {!speechSupported && (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                    Speech recognition is not supported in this browser. Switch to typing or use a supported browser.
                  </p>
                )}
              </div>
            )}

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={4}
              placeholder={inputMode === 'speak' ? 'Speak or type your interview answer here...' : 'Type your interview answer here...'}
              disabled={!canAnswer}
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!canAnswer || !input.trim()}
              className="inline-flex items-center gap-2 rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              Submit answer
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Mic className="w-5 h-5 text-primary" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Interview flow</p>
          </div>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p>• The AI will ask one question at a time.</p>
            <p>• Answer in the text box, then submit.</p>
            <p>• The AI will give brief feedback and move to the next question.</p>
            <p>• Use this for IOCE-style interview practice and public service topics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
