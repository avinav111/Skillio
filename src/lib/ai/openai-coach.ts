import OpenAI from "openai";
import type { AIFeedback, EvaluationResult, Lesson } from "@/types/skill-learning";

const SYSTEM = `You are a piano coach for total beginners. You ONLY explain what is already present in the structured evaluation JSON. Rules:
- Never claim you listened to raw audio or heard the student.
- Never invent mistakes or issues not supported by the evaluation data.
- Do not discuss posture, fingering, pedal, or hand shape unless the lesson text explicitly mentions it.
- Output MUST be a single JSON object with keys: headline, explanation, correction, nextStep, encouragement (optional string), detectedIssueReferences (array of short strings referencing mistake codes or recommendation ids from the input).
- Be concise and kind; one clear next action in nextStep.`;

export function isOpenAiCoachEnabled(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY?.trim() &&
      process.env.AI_FEEDBACK_PROVIDER?.trim().toLowerCase() === "openai"
  );
}

export async function generateOpenAiCoachFeedback(input: {
  lesson: Lesson;
  evaluation: EvaluationResult;
}): Promise<AIFeedback> {
  if (!isOpenAiCoachEnabled()) {
    throw new Error("OpenAI coach is not configured");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const userPayload = {
    lesson: {
      title: input.lesson.title,
      objective: input.lesson.objective,
      explanation: input.lesson.explanation,
    },
    evaluation: input.evaluation,
  };

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: JSON.stringify(userPayload),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty OpenAI response");
  }

  const parsed = JSON.parse(raw) as Partial<AIFeedback>;
  if (
    typeof parsed.headline !== "string" ||
    typeof parsed.explanation !== "string" ||
    typeof parsed.correction !== "string" ||
    typeof parsed.nextStep !== "string" ||
    !Array.isArray(parsed.detectedIssueReferences)
  ) {
    throw new Error("Invalid coach JSON shape from model");
  }

  return {
    headline: parsed.headline,
    explanation: parsed.explanation,
    correction: parsed.correction,
    nextStep: parsed.nextStep,
    encouragement:
      typeof parsed.encouragement === "string" ? parsed.encouragement : undefined,
    detectedIssueReferences: parsed.detectedIssueReferences.filter(
      (x): x is string => typeof x === "string"
    ),
  };
}
