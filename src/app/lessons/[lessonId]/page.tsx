import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonPracticePanel } from "@/components/lesson/LessonPracticePanel";
import { PianoKeyboard } from "@/components/keyboard/PianoKeyboard";
import {
  getExerciseById,
  getLessonById,
} from "@/lib/curriculum/initial-lessons";
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

  const exercise =
    lesson.exerciseIds.length > 0
      ? getExerciseById(lesson.exerciseIds[0] ?? "")
      : undefined;

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
          <PianoKeyboard highlightNotes={lesson.id === "c_d_e_001" ? ["C4", "D4", "E4"] : ["C4"]} />
        </CardContent>
      </Card>

      {lesson.requiresRecording && exercise ? (
        <Card>
          <CardHeader>
            <CardTitle>Exercise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{exercise.instructions}</p>
            <LessonPracticePanel lesson={lesson} exercise={exercise} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No recording yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              This lesson is intentionally read-only for the MVP. When you are ready
              to practice recorded drills, continue to the next lesson.
            </p>
            <Link className={cn(buttonVariants())} href="/lessons/middle_c_001">
              Go to Finding Middle C
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
