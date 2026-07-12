import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_INSTRUCTION = `You are a helpful PPSC (Punjab Public Service Commission) exam preparation assistant. You help students with:
- PPSC exam structure, syllabus, and stages (written exam, interview)
- Study strategies, time management, and revision tips
- Subject explanations: Pakistan Affairs, Islamiat, English, General Knowledge, Current Affairs, etc.
- Practice tips and how to use mock tests effectively
- Motivation and exam-day advice

Keep answers clear, concise, and relevant to PPSC preparation. Use markdown **bold** for emphasis when helpful. Be friendly and encouraging.`;

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const PDF_MIME = 'application/pdf';
const TXT_MIME = 'text/plain';

async function parseRequest(request: NextRequest): Promise<{
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  files?: File[];
}> {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const messagesJson = formData.get('messages');
    const messages = messagesJson
      ? (JSON.parse(messagesJson as string) as Array<{ role: 'user' | 'assistant'; content: string }>)
      : [];
    const files = formData.getAll('files').filter((f): f is File => f instanceof File);
    return { messages, files };
  }
  const body = await request.json();
  const messages = body.messages as Array<{ role: 'user' | 'assistant'; content: string }> | undefined;
  return { messages: Array.isArray(messages) ? messages : [], files: undefined };
}

async function fileToBase64(file: File): Promise<{ mimeType: string; data: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return { mimeType: file.type, data: buffer.toString('base64') };
}

async function extractTextFromTxt(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString('utf-8').trim();
}

async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    const text = data && typeof data === 'object' && 'text' in data ? (data as { text: string }).text : '';
    return typeof text === 'string' ? text.trim() : '';
  } catch (e) {
    console.warn('PDF parse failed for', file.name, e);
    return '';
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === PDF_MIME) return extractTextFromPdf(file);
  if (file.type === TXT_MIME || file.name.toLowerCase().endsWith('.txt')) return extractTextFromTxt(file);
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Add GEMINI_API_KEY to .env.local' },
        { status: 503 }
      );
    }

    const { messages, files } = await parseRequest(request);

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Build Gemini contents: alternate user / model (assistant)
    let contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // If files were uploaded: add PDF/TXT text to the last user message, then add image parts
    if (files && files.length > 0) {
      const lastContent = contents[contents.length - 1];
      if (lastContent.role === 'user' && lastContent.parts[0]) {
        const textFiles = files.filter(
          (f) => f.type === PDF_MIME || f.type === TXT_MIME || f.name.toLowerCase().endsWith('.txt')
        );
        if (textFiles.length > 0) {
          const extracted: string[] = [];
          for (const f of textFiles) {
            const text = await extractTextFromFile(f);
            if (text) extracted.push(`[Content from ${f.name}]:\n${text}`);
          }
          if (extracted.length > 0) {
            const appended = extracted.join('\n\n---\n\n');
            const existingText = lastContent.parts[0].text ?? '';
            lastContent.parts[0].text = existingText ? `${existingText}\n\n${appended}` : appended;
          }
        }

        const imageFiles = files.filter((f) => IMAGE_MIMES.includes(f.type));
        if (imageFiles.length > 0) {
          const imageParts = await Promise.all(
            imageFiles.map((f) => fileToBase64(f).then((b) => ({ inlineData: b })))
          );
          lastContent.parts = [...lastContent.parts, ...imageParts];
        }
      }
    }

    const response = await fetch(
      `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errData);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from Gemini' },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (e) {
    console.error('Chat API error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
