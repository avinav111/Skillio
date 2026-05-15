import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  hasSupabaseAdmin,
} from "@/lib/supabase/admin-client";

type ProfileBody = {
  userId: string;
  skillLevel?: string;
  instrumentType?: string;
  microphoneOk?: boolean;
  completedLessonIds?: string[];
  weakAreas?: string[];
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasSupabaseAdmin()) {
    return NextResponse.json({ synced: false, reason: "supabase_not_configured" });
  }

  const body = (await request.json()) as ProfileBody;
  if (typeof body.userId !== "string" || body.userId.length < 8) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("glide_profiles").upsert(
    {
      id: body.userId,
      skill_level: body.skillLevel ?? null,
      instrument_type: body.instrumentType ?? null,
      microphone_ok: body.microphoneOk ?? true,
      weak_areas: body.weakAreas ?? [],
      completed_lesson_ids: body.completedLessonIds ?? [],
      updated_at: now,
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ synced: true });
}
