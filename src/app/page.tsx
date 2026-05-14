import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Adaptive skill practice
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Learn piano with objective feedback first, coaching second.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Glide records short clips from your acoustic or digital instrument, turns
          them into structured note data, scores them with a deterministic rubric,
          and only then asks an AI coach to explain what happened—in plain language.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className={cn(buttonVariants({ size: "lg" }))} href="/onboarding">
            Start learning piano
          </Link>
          <Link
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            href="/roadmap"
          >
            View the roadmap
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Teach</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Tiny lessons with a visual keyboard so beginners always know where to
            look on the instrument.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Try &amp; analyze</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Microphone capture feeds a transcription layer (mock today, Basic Pitch
            next) before a rubric decides pass, fail, or unclear.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Explain &amp; adapt</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Template coaching now, LLM later—always grounded in evaluator JSON, never
            inventing mistakes from raw audio.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
