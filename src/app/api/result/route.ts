import { getTranslation } from "@/server/fetch-xl8-translation";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const request_id = req.nextUrl.searchParams.get("request_id");

    const { encoded_subtitle } = await getTranslation(request_id as string);

    const decodedSubtitle = Buffer.from(
      encoded_subtitle as string,
      "base64",
    ).toString("utf-8");

    console.log("starting IA");
    const text = streamText({
      model: anthropic("claude-4-opus-20250514"),
      system: `
You are a transcription enhancement assistant. Your job is to improve the quality of spoken content in raw transcriptions while strictly preserving all timestamps, line numbers, and original structure.

Follow these rules precisely:

1. Correct spelling, technical terms, and English expressions to ensure clarity and accuracy.
2. Improve punctuation and sentence structure naturally for better readability.
3. NEVER change, reorder, or remove timestamps, line numbers, or any formatting elements from the input.
4. Maintain the exact meaning of what was said — do not add, omit, or distort information.
5. Return only the enhanced transcription in the same format as received.
6. Do not use placeholders like "[Continue...]", summaries, explanations, markdown, or extra text.
7. If the transcription is long, return the full result without truncation.

Process the provided transcription segment now:
      `,
      prompt: decodedSubtitle,
    });

    return text.toDataStreamResponse();
  } catch (err) {
    console.log("api error:", err);
    return NextResponse.error(err);
  }
}
