"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  curriculumModules,
  getLessonById,
} from "@/lib/curriculum/initial-lessons";
import { useProgress } from "@/hooks/use-progress";

export function RoadmapView() {
  const { snapshot, isLessonUnlocked } = useProgress();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Roadmap</h1>
        <p className="text-muted-foreground">
          Lessons unlock in order as you pass each gate. Progress is saved in this
          browser; optional Supabase sync runs when configured.
        </p>
      </div>

      {curriculumModules.map((module) => (
        <section
          key={module.id}
          className="rounded-xl border border-border bg-card/30 p-5 shadow-sm"
        >
          <div className="mb-4 space-y-1">
            <h2 className="text-xl font-semibold text-foreground">{module.title}</h2>
            <p className="text-sm text-muted-foreground">{module.description}</p>
            <p className="text-xs text-muted-foreground">
              Module id: <code className="text-foreground">{module.id}</code>
            </p>
          </div>
          <ol className="space-y-3">
            {module.lessonIds.map((lessonId, index) => {
              const lesson = getLessonById(lessonId);
              if (!lesson) {
                return null;
              }
              const unlocked = isLessonUnlocked(lesson.prerequisites);
              const completed =
                snapshot?.completedLessonIds.includes(lessonId) ?? false;
              return (
                <li
                  key={lessonId}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Lesson {index + 1}
                      {completed ? (
                        <Badge variant="secondary" className="ml-2">
                          Completed
                        </Badge>
                      ) : null}
                      {!unlocked ? (
                        <Badge variant="outline" className="ml-2">
                          Locked
                        </Badge>
                      ) : null}
                    </p>
                    <p className="text-lg font-medium text-foreground">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.objective}</p>
                  </div>
                  {unlocked ? (
                    <Link
                      className={cn(buttonVariants({ variant: "secondary" }))}
                      href={`/lessons/${lesson.id}`}
                    >
                      Open
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Complete prerequisites first.
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
