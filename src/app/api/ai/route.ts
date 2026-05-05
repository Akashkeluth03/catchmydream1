import { NextResponse } from "next/server";

/**
 * AI Assistant stub (MVP).
 * Next step: connect to an LLM provider (OpenAI/Anthropic) and ground responses
 * using our Prisma data (countries, universities, courses, visa notes).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { message?: string } | null;
  const message = body?.message?.trim() ?? "";

  if (!message) {
    return NextResponse.json(
      { error: "Missing `message` in request body." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    answer:
      "AI Assistant is wired as an API route. Next step: connect an LLM and ground answers on Study in Asia data (universities, courses, visas, jobs, accommodation).",
    echo: message,
  });
}

