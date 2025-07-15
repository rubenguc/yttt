import { getEncodedTranscription } from "@/server/fetch-xl8-translation";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const request_id = req.nextUrl.searchParams.get("request_id");

    const encoded_subtitle = await getEncodedTranscription(
      request_id as string,
    );

    const decodedSubtitle = Buffer.from(
      encoded_subtitle as string,
      "base64",
    ).toString("utf-8");

    const text = streamText({
      model: anthropic("claude-4-opus-20250514"),
      system: `
        You are a professional technical transcription editor specialized in mixed-language content. You will receive raw speech-to-text transcriptions in a non-English language (e.g., Spanish, Portuguese, Korean) that often contain English technical/programming terms.

        Your job is to:

        1. **Correct any mistranscribed English technical terms** (e.g., "JavaScript", "React", "API", "Docker", etc.) while keeping them in English.
        2. **Do not translate the original non-English language**. Keep it as-is, but **fix grammar, punctuation, and sentence clarity** to improve readability.
        3. **Maintain the original meaning and technical context**. Do not rewrite, summarize, or omit any relevant information.
        4. If a word seems like an English technical term but is unclear or ambiguous, try to infer the correct term based on context.
        5. If something is unintelligible or clearly broken, mark it with "[Unclear audio]".
        6. **Only return the corrected transcription as plain text. Do not include any explanation, metadata, or formatting instructions.**

        Output should preserve the same format as the input (if timestamps or segments are used). Keep the enhanced version faithful to the speaker’s intent, while improving clarity and technical accuracy.
      `,
      prompt: decodedSubtitle,
    });

    return text.toDataStreamResponse();
  } catch (err) {
    console.log("api error:", err);
    return NextResponse.error(err);
  }
}
