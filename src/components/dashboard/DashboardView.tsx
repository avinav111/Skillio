"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  curriculumModules,
  getLessonById,
  lessons,
} from "@/lib/curriculum/initial-lessons";
import { useProgress } from "@/hooks/use-progress";

export function DashboardView() {
  const { snapshot } = useProgress();
  const completed = snapshot?.completedLessonIds ?? [];
  const orderedIds = curriculumModules.flatMap((m) => m.lessonIds);
  const nextLesson =
    orderedIds
      .map((id) => getLessonById(id))
      .find((l) => l && !completed.includes(l.id)) ?? lessons[0];
  const recent = snapshot?.attempts.slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Local progress is stored in your browser. Configure Supabase to mirror attempts
          server-side (see <code className="text-foreground">supabase/migrations</code>
          ).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Completed lessons:{" "}
              <span className="text-foreground">{completed.length}</span>
            </p>
            <p>
              Suggested next:{" "}
              <span className="text-foreground">
                {nextLesson.title} ({nextLesson.id})
              </span>
            </p>
            <Link className={cn(buttonVariants())} href={`/lessons/${nextLesson.id}`}>
              Open lesson
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weak signals</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {snapshot && snapshot.weakAreas.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5">
                {snapshot.weakAreas.slice(0, 8).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : (
              <p>No tagged weak areas yet — keep practicing to build your profile.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent attempts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {recent.length === 0 ? (
            <p>Finish a lesson exercise to see attempts listed here.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((a) => (
                <li key={a.id} className="rounded border border-border bg-muted/30 px-3 py-2">
                  <span className="font-medium text-foreground">{a.lessonId}</span> ·{" "}
                  {a.exerciseId} ·{" "}
                  <span className="text-foreground">
                    {a.evaluation?.status ?? "no evaluation"}
                  </span>
                  <span className="block text-xs opacity-80">{a.createdAt}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
