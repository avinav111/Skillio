import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessons } from "@/lib/curriculum/initial-lessons";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const current = lessons[1];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Snapshot of your local prototype session. Supabase-backed progress arrives
          in a later milestone.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Module: <span className="text-foreground">Keyboard Foundations</span>
            </p>
            <p>
              Lesson:{" "}
              <span className="text-foreground">
                {current.title} ({current.id})
              </span>
            </p>
            <Link className={cn(buttonVariants())} href={`/lessons/${current.id}`}>
              Open lesson
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent feedback</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Complete a recorded lesson to see evaluator output here. For now this
            panel is a placeholder until Supabase attempts ship.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
