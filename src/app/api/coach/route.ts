import { NextResponse } from "next/server";
import { generateOpenAiCoachFeedback, isOpenAiCoachEnabled } from "@/lib/ai/openai-coach";
import type { EvaluationResult, Lesson } from "@/types/skill-learning";

export const runtime = "nodejs";

type Body = {
  lesson?: Lesson;
  evaluation?: EvaluationResult;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  if (!body.lesson || !body.evaluation) {
    return NextResponse.json(
      { error: "lesson and evaluation are required" },
      { status: 400 }
    );
  }

  if (!isOpenAiCoachEnabled()) {
    return NextResponse.json({ feedback: null });
  }

  try {
    const feedback = await generateOpenAiCoachFeedback({
      lesson: body.lesson,
      evaluation: body.evaluation,
    });
    return NextResponse.json({ feedback });
  } catch (error) {
    const message = error instanceof Error ? error.message : "coach_error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
