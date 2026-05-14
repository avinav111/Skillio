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
            <p className="font-medium text-foreground">Confidence</p>
            <p>{evaluation.confidence.toFixed(2)} (overall signal quality)</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Score</p>
            <p>{evaluation.score.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Summary</p>
            <p>{evaluation.summary}</p>
          </div>
          {evaluation.mistakes.length > 0 ? (
            <div>
              <p className="font-medium text-foreground">Structured mistakes</p>
              <ul className="list-disc space-y-1 pl-5">
                {evaluation.mistakes.map((mistake) => (
                  <li key={`${mistake.code}-${mistake.message}`}>{mistake.message}</li>
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
