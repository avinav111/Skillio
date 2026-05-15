import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonPhasePractice } from "@/components/lesson/LessonPhasePractice";
import { MarkLessonReadButton } from "@/components/lesson/MarkLessonReadButton";
import { PianoKeyboard } from "@/components/keyboard/PianoKeyboard";
import { resolveLessonPhases } from "@/lib/curriculum/lesson-phases";
import { getLessonById } from "@/lib/curriculum/initial-lessons";
import { cn } from "@/lib/utils";

type LessonPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  const phases = resolveLessonPhases(lesson);
  const hasPracticeSteps = lesson.requiresRecording && phases.length > 0;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{lesson.id}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground">{lesson.objective}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{lesson.explanation}</p>
          <div>
            <p className="font-medium text-foreground">Concepts</p>
            <p>{lesson.concepts.join(", ")}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Prerequisites</p>
            <p>
              {lesson.prerequisites.length > 0
                ? lesson.prerequisites.join(", ")
                : "None"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual keyboard</CardTitle>
        </CardHeader>
        <CardContent>
          <PianoKeyboard
            highlightNotes={
              lesson.id === "c_d_e_001"
                ? ["C4", "D4", "E4"]
                : lesson.id === "c_position_001"
                  ? ["C4", "D4", "E4", "F4", "G4"]
                  : lesson.id === "steady_beat_001"
                    ? ["C4", "D4", "E4", "G4"]
                    : lesson.id === "register_direction_001"
                      ? ["F3", "G3", "A3", "C4", "G4"]
                      : lesson.id === "register_connect_001"
                        ? ["A3", "B3", "C4", "G3"]
                        : lesson.id === "f_g_a_001"
                          ? ["F3", "G3", "A3"]
                          : lesson.id === "descend_c_b_a_001"
                            ? ["C4", "B3", "A3"]
                            : ["C4"]
            }
          />
        </CardContent>
      </Card>

      {hasPracticeSteps ? (
        <Card>
          <CardHeader>
            <CardTitle>Practice steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <LessonPhasePractice lesson={lesson} />
          </CardContent>
        </Card>
      ) : lesson.requiresRecording ? (
        <Card>
          <CardHeader>
            <CardTitle>Practice unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>This lesson requires recording but has no configured practice steps.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No recording yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              This lesson is read-only. Mark it complete when you have spent a few
              minutes with the visuals so the roadmap can unlock the next steps.
            </p>
            <div className="flex flex-wrap gap-3">
              <MarkLessonReadButton lessonId={lesson.id} />
              <Link className={cn(buttonVariants({ variant: "outline" }))} href="/roadmap">
                Back to roadmap
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
