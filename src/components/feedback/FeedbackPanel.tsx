import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AIFeedback, EvaluationResult } from "@/types/skill-learning";

type Props = {
  evaluation: EvaluationResult;
  aiFeedback: AIFeedback;
};

function statusVariant(status: EvaluationResult["status"]) {
  if (status === "passed") {
    return "default" as const;
  }
  if (status === "unclear") {
    return "secondary" as const;
  }
  return "destructive" as const;
}

function statusLabel(status: EvaluationResult["status"]) {
  if (status === "passed") {
    return "Passed";
  }
  if (status === "unclear") {
    return "Unclear recording";
  }
  return "Needs work";
}

export function FeedbackPanel({ evaluation, aiFeedback }: Props) {
  const detectedPreview = evaluation.detectedNotes.map((note) => note.note);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            Evaluator
            <Badge variant={statusVariant(evaluation.status)}>
              {statusLabel(evaluation.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Expected notes</p>
            <p>{evaluation.expectedNotes.join(" · ")}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Detected notes</p>
            <p>{detectedPreview.length > 0 ? detectedPreview.join(" · ") : "—"}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Note counts</p>
            <p>
              Expected {evaluation.expectedNotes.length} · Detected{" "}
              {evaluation.detectedNotes.length}
              {evaluation.detectedNotes.length !== evaluation.expectedNotes.length
                ? " — extra detections often come from double-triggers or background notes."
                : ""}
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Confidence</p>
            <p>{evaluation.confidence.toFixed(2)} (overall signal quality)</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Score</p>
            <p>{evaluation.score.toFixed(2)}</p>
          </div>
          {evaluation.rhythmScoringBreakdown ? (
            <details className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <summary className="cursor-pointer font-medium text-foreground">
                How this score was calculated (rhythm)
              </summary>
              <div className="mt-3 space-y-2 text-xs">
                <p>
                  Combined score = pitch × {evaluation.rhythmScoringBreakdown.pitchWeight}{" "}
                  + timing × {evaluation.rhythmScoringBreakdown.timingWeight}. Pass when
                  combined ≥ {evaluation.rhythmScoringBreakdown.passingAccuracy.toFixed(2)}.
                </p>
                <p>
                  Pitch sub-score: {evaluation.rhythmScoringBreakdown.pitchScore.toFixed(2)}{" "}
                  (note names in order). Timing sub-score:{" "}
                  {evaluation.rhythmScoringBreakdown.timingScore.toFixed(2)} (share of
                  intervals within tolerance).
                </p>
                <p className="font-medium text-foreground">Intervals (onset to onset)</p>
                <ul className="list-disc space-y-1 pl-4">
                  {evaluation.rhythmScoringBreakdown.intervals.map((row, idx) => (
                    <li key={`int-${row.fromIndex}-${row.toIndex}-${idx}`}>
                      Notes {row.fromIndex}→{row.toIndex}: target{" "}
                      {row.expectedSpacingMs} ms, measured {row.measuredSpacingMs} ms —{" "}
                      {row.withinTolerance ? "within tolerance" : "outside tolerance"}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ) : null}
          <div>
            <p className="font-medium text-foreground">Summary</p>
            <p>{evaluation.summary}</p>
          </div>
          {evaluation.mistakes.length > 0 ? (
            <div>
              <p className="font-medium text-foreground">Structured mistakes</p>
              <ul className="list-disc space-y-1 pl-5">
                {evaluation.mistakes.map((mistake, i) => (
                  <li key={`${mistake.code}-${i}-${mistake.position ?? ""}`}>
                    {mistake.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coach (template)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{aiFeedback.headline}</p>
            <p>{aiFeedback.explanation}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">What to adjust</p>
            <p>{aiFeedback.correction}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Next action</p>
            <p>{aiFeedback.nextStep}</p>
          </div>
          {aiFeedback.encouragement ? (
            <div>
              <p className="font-medium text-foreground">Encouragement</p>
              <p>{aiFeedback.encouragement}</p>
            </div>
          ) : null}
          {aiFeedback.detectedIssueReferences.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              Issue tags: {aiFeedback.detectedIssueReferences.join(", ")}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
