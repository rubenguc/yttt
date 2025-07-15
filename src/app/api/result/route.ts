import { getEncodedTranscription } from "@/server/fetch-xl8-translation";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

type SubtitleBlock = {
  body: string;
  start: number;
  end: number;
};

const systemPrompt = `
You are a professional technical transcription editor specialized in mixed-language content. You will receive raw speech-to-text transcriptions in a non-English language (e.g., Spanish, Portuguese, Korean) that often contain English technical/programming terms.

Your job is to:

1. **Correct any mistranscribed English technical terms** (e.g., "JavaScript", "React", "API", "Docker", etc.) while keeping them in English.
2. **Do not translate the original non-English language**. Keep it as-is, but **fix grammar, punctuation, and sentence clarity** to improve readability.
3. **Maintain the original meaning and technical context**. Do not rewrite, summarize, or omit any relevant information.
4. If a word seems like an English technical term but is unclear or ambiguous, try to infer the correct term based on context.
5. If something is unintelligible or clearly broken, mark it with "[Unclear audio]".
6. **Only return the corrected transcription as plain text. Do not include any explanation, metadata, or formatting instructions.**
`;

export async function GET(req: NextRequest) {
  try {
    const request_id = req.nextUrl.searchParams.get("request_id");
    const encoded = await getEncodedTranscription(request_id as string);

    const decoded = Buffer.from(encoded as string, "base64").toString("utf-8");
    const blocks: SubtitleBlock[] = JSON.parse(decoded);

    const correctedBlocks: SubtitleBlock[] = [];

    for (const block of blocks) {
      const result = await generateText({
        model: anthropic("claude-4-opus-20250514"),
        system: systemPrompt,
        prompt: block.body,
      });

      correctedBlocks.push({
        start: block.start,
        end: block.end,
        body: result.text.trim(),
      });
    }

    return Response.json({ text: convertToSRT(correctedBlocks) });
  } catch (err) {
    console.error("api error:", err);
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
