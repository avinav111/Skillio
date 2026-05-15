import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseAdmin,
} from "@/lib/supabase/admin-client";

type AttemptBody = {
  userId: string;
  lessonId: string;
  exerciseId: string;
  transcription?: unknown;
  evaluation?: unknown;
  profile?: {
    skillLevel?: string;
    instrumentType?: string;
    microphoneOk?: boolean;
    completedLessonIds?: string[];
    weakAreas?: string[];
  };
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasSupabaseAdmin()) {
    return NextResponse.json({ synced: false, reason: "supabase_not_configured" });
  }

  const body = (await request.json()) as AttemptBody;
  if (
    typeof body.userId !== "string" ||
    body.userId.length < 8 ||
    typeof body.lessonId !== "string" ||
    typeof body.exerciseId !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const { error: profileError } = await supabase.from("glide_profiles").upsert(
    {
      id: body.userId,
      skill_level: body.profile?.skillLevel ?? null,
      instrument_type: body.profile?.instrumentType ?? null,
      microphone_ok: body.profile?.microphoneOk ?? true,
      weak_areas: body.profile?.weakAreas ?? [],
      completed_lesson_ids: body.profile?.completedLessonIds ?? [],
      updated_at: now,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    );
  }

  const { error: attemptError } = await supabase.from("glide_attempts").insert({
    user_id: body.userId,
    lesson_id: body.lessonId,
    exercise_id: body.exerciseId,
    transcription: body.transcription ?? null,
    evaluation: body.evaluation ?? null,
  });

  if (attemptError) {
    return NextResponse.json(
      { error: attemptError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ synced: true });
}
