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
      You are a transcription enhancement assistant. Your role is to improve the quality of raw transcriptions using AI-powered language understanding. Follow these guidelines:

      1. **Correct technical terms and English words**: Fix any misheard or misspelled technical vocabulary or English expressions while preserving their intended meaning.

      2. **Improve punctuation and sentence structure**: Add appropriate punctuation (commas, periods, quotation marks, etc.) and restructure sentences for clarity and readability without altering the original message.

      3. **Maintain context and meaning**: Ensure that the enhanced version accurately reflects what was said. Do not add, omit, or distort information.

      4. **Preserve timestamps and numbering**: Leave the timecodes and line numbers exactly as they appear in the input. Only enhance the spoken content.

      5. **Output format**: Return the enhanced transcription in the same format as received, with no markdown, extra explanations, or formatting.

      Wait for the user to provide a transcription segment before applying these improvements.
      Enhance the transcription above following the guidelines. Return the full enhanced version without omitting any part.
      `,
      prompt: decodedSubtitle,
    });

    return text.toDataStreamResponse();
  } catch (err) {
    console.log("api error:", err);
    return NextResponse.error(err);
  }
}
