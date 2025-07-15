import { getEncodedTranscription } from "@/server/fetch-xl8-translation";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

type SubtitleBlock = {
  body: string;
  start: number;
  end: number;
};

const SYSTEM_PROMPT = `
You are a professional technical transcription editor specialized in mixed-language content. You will receive raw speech-to-text transcriptions in a non-English language (e.g., Spanish, Portuguese, Korean) that often contain English technical/programming terms.

Your job is to:

1. Correct any mistranscribed English technical terms (e.g., "JavaScript", "React", "API", "Docker", etc.) while keeping them in English.
2. Do not translate or rewrite the original non-English language. Keep it as-is, but fix grammar, punctuation, and sentence clarity to improve readability.
3. Maintain the original meaning and technical context. Do not summarize or omit any relevant information.
4. If a word seems like an English technical term but is unclear or ambiguous, try to infer the correct term based on context.
5. If something is unintelligible or clearly broken, mark it with “[Unclear audio]”.
6. **Do not change the timestamps.**
7. **Return each block in this exact format**:
   [start: <start_time>, end: <end_time>] <corrected transcription>
8. Only return the corrected transcription list. Do not include any explanation, headers, notes, or formatting instructions.

Each input block looks like this:
[start: 3.241, end: 6.512] el código está en el componente main pero no funciona en react

Just return a list of blocks like that, one per line.
`;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function serializeChunk(chunk: { body: string; start: number; end: number }[]) {
  return chunk
    .map(
      (b) =>
        `[start: ${b.start.toFixed(3)}, end: ${b.end.toFixed(3)}] ${b.body}`,
    )
    .join("\n");
}

function parseClaudeResponse(
  text: string,
): { start: number; end: number; body: string }[] {
  const lines = text.trim().split("\n");

  return lines
    .map((line) => {
      const match = line.match(/^\[start: ([\d.]+), end: ([\d.]+)\]\s+(.+)$/);
      if (!match) return null;

      return {
        start: parseFloat(match[1]),
        end: parseFloat(match[2]),
        body: match[3],
      };
    })
    .filter(Boolean) as { start: number; end: number; body: string }[];
}

export async function GET(req: NextRequest) {
  try {
    const request_id = req.nextUrl.searchParams.get("request_id");
    const encoded_subtitle = await getEncodedTranscription(request_id!);

    const blocks: { body: string; start: number; end: number }[] = JSON.parse(
      Buffer.from(encoded_subtitle, "base64").toString("utf-8"),
    );

    const chunked = chunkArray(blocks, 100);

    const results: { start: number; end: number; body: string }[] = [];

    for (const chunk of chunked) {
      const prompt = serializeChunk(chunk);

      const response = await generateText({
        model: anthropic("claude-4-opus-20250514"),
        system: SYSTEM_PROMPT,
        prompt,
      });

      const parsed = parseClaudeResponse(response.text);
      results.push(...parsed);
    }

    return Response.json({ text: convertToSRT(results) });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.error();
  }
}

function convertToSRT(subtitles) {
  const toSRTTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().slice(11, 23).replace(".", ",");
  };

  return subtitles
    .map((sub, index) => {
      const start = toSRTTime(sub.start);
      const end = toSRTTime(sub.end);
      return `${index + 1}\n${start} --> ${end}\n${sub.body.trim()}\n`;
    })
    .join("\n");
}
