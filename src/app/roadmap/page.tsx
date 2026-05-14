import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessons, MODULE_KEYBOARD_FOUNDATIONS } from "@/lib/curriculum/initial-lessons";
import { cn } from "@/lib/utils";

const futureModules = [
  "First Notes",
  "Note Sequences",
  "Rhythm Basics",
  "First Melody",
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Roadmap</h1>
        <p className="text-muted-foreground">
          The curriculum JSON already lists the first module; later modules stay
          documented here until their lessons ship.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module 1 · Keyboard Foundations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ID: <code className="text-foreground">{MODULE_KEYBOARD_FOUNDATIONS}</code>
          </p>
          <ol className="space-y-3">
            {lessons.map((lesson, index) => (
              <li
                key={lesson.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Lesson {index + 1}</p>
                  <p className="text-lg font-medium text-foreground">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground">{lesson.objective}</p>
                </div>
                <Link
                  className={cn(buttonVariants({ variant: "secondary" }))}
                  href={`/lessons/${lesson.id}`}
                >
                  Open
                </Link>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming modules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {futureModules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
