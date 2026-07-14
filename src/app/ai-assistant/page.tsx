'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Paperclip,
  X,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatApi } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  'Explain the PPSC exam structure to me',
  'What are the best study strategies for Current Affairs?',
  'Help me understand Pakistan Affairs',
  'Give me tips for English section preparation',
];

const FALLBACK_MESSAGE =
  "I’m having trouble answering right now. Please try again in a moment.";

const ACCEPT_FILES = 'image/*,.pdf,.txt';
const MAX_FILES = 4;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface Attachment {
  id: string;
  file: File;
}

function formatMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <span key={i}>
      {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    const hasContent = trimmed || attachments.length > 0;
    if (!hasContent || isTyping) return;

    const filesToSend = [...attachments];
    const fileNames = filesToSend.map((a) => a.file.name).join(', ');
    const userContent =
      trimmed && fileNames
        ? `${trimmed}\n\nAttached: ${fileNames}`
        : trimmed
          ? trimmed
          : fileNames
            ? `Attached ${filesToSend.length} file(s): ${fileNames}`
            : '';
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userContent,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    let responseText = FALLBACK_MESSAGE;
    try {
      if (filesToSend.length > 0) {
        const formData = new FormData();
        const messagesForApi = newMessages.map((m) => ({ role: m.role, content: m.content }));
        formData.set('messages', JSON.stringify(messagesForApi));
        filesToSend.forEach((a) => formData.append('files', a.file));
        const res = await fetch('http://localhost:5001/api/chat', { method: 'POST', body: formData });
        const data = (await res.json()) as { text?: string; error?: string };
        if (res.ok && typeof data.text === 'string') {
          responseText = data.text;
        } else if (data.error) {
          responseText = FALLBACK_MESSAGE;
        }
      } else {
        const response = await chatApi.send({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        });
        const data = response.data;
        if (typeof data.text === 'string') {
          responseText = data.text;
        } else if (data.error) {
          responseText = FALLBACK_MESSAGE;
        }
      }
    } catch {
      responseText = FALLBACK_MESSAGE;
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: responseText,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';

    const valid: Attachment[] = [];
    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`"${file.name}" is over ${MAX_FILE_SIZE_MB}MB. Skipped.`);
        continue;
      }
      if (valid.length + attachments.length >= MAX_FILES) {
        setFileError(`Maximum ${MAX_FILES} files allowed.`);
        break;
      }
      valid.push({ id: crypto.randomUUID(), file });
    }
    setAttachments((prev) => [...prev, ...valid]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    setFileError(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -m-6">
      {/* Header */}
      <div className="shrink-0 bg-linear-to-r from-primary to-accent px-6 py-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
            <p className="text-sm text-white/90">Your intelligent PPSC study companion</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Online
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800/50 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-2xl shadow-lg overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="p-4 bg-linear-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl mb-6">
                <Bot className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Ask me about PPSC exam structure, study tips, subject explanations, or anything
                related to your preparation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="flex items-center gap-3 p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group"
                  >
                    {i === 0 && <HelpCircle className="w-5 h-5 text-primary shrink-0" />}
                    {i === 1 && <Lightbulb className="w-5 h-5 text-accent shrink-0" />}
                    {i === 2 && <BookOpen className="w-5 h-5 text-primary shrink-0" />}
                    {i === 3 && <BookOpen className="w-5 h-5 text-accent shrink-0" />}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300',
                    msg.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
                      msg.role === 'user'
                        ? 'bg-green-600'
                        : 'bg-linear-to-br from-accent to-accent/80'
                    )}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                      msg.role === 'user'
                        ? 'bg-green-600 text-white rounded-tr-md'
                        : 'bg-gray-100 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 rounded-tl-md border border-gray-200/50 dark:border-gray-600/50'
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.role === 'user' ? msg.content : formatMessage(msg.content)}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-in fade-in duration-200">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-br from-accent to-accent/80 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700/80 rounded-2xl rounded-tl-md px-5 py-4 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-4 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_FILES}
                multiple
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Attach files"
              />
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm"
                    >
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate max-w-[140px]" title={a.file.name}>
                        {a.file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(a.id)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {fileError && (
                <p className="text-xs text-red-600 dark:text-red-400">{fileError}</p>
              )}
              <div className="relative flex">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTyping || attachments.length >= MAX_FILES}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about PPSC preparation..."
                  rows={1}
                  className="w-full resize-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pl-12 pr-12 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[48px] max-h-32"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
            Press Enter to send, Shift+Enter for new line. Attach images, PDF, or TXT (max {MAX_FILES} files, {MAX_FILE_SIZE_MB}MB each).
          </p>
        </div>
      </div>
    </div>
  );
}
