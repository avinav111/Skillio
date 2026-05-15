"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InstrumentType, SkillLevel } from "@/types/skill-learning";
import { loadLocalProgress, saveLocalProgress } from "@/lib/progress/local-persistence";

const STORAGE_KEY = "glide_onboarding_profile_v1";

type OnboardingForm = {
  skillLevel: SkillLevel;
  instrumentType: InstrumentType;
  microphoneOk: boolean;
};

const defaultForm: OnboardingForm = {
  skillLevel: "complete_beginner",
  instrumentType: "digital_keyboard",
  microphoneOk: true,
};

export function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState<OnboardingForm>(defaultForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      return;
    }
    try {
      const parsed = JSON.parse(existing) as OnboardingForm;
      setForm({ ...defaultForm, ...parsed });
    } catch {
      /* ignore */
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    const progress = loadLocalProgress();
    saveLocalProgress({
      ...progress,
      skillLevel: form.skillLevel,
      instrumentType: form.instrumentType,
      microphoneOk: form.microphoneOk,
    });
    setSaved(true);
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell us about your setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Are you a complete beginner?
            </legend>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="radio"
                name="skillLevel"
                value="complete_beginner"
                checked={form.skillLevel === "complete_beginner"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, skillLevel: "complete_beginner" }))
                }
              />
              Yes, I am starting from scratch
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="radio"
                name="skillLevel"
                value="some_experience"
                checked={form.skillLevel === "some_experience"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, skillLevel: "some_experience" }))
                }
              />
              I have a little experience, but I want fundamentals
            </label>
          </fieldset>

          <label className="flex flex-col gap-2 text-sm text-muted-foreground">
            What instrument are you using?
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              value={form.instrumentType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  instrumentType: event.target.value as InstrumentType,
                }))
              }
            >
              <option value="acoustic_piano">Acoustic piano</option>
              <option value="digital_keyboard">Digital keyboard</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.microphoneOk}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, microphoneOk: event.target.checked }))
              }
            />
            I can place my laptop or phone so the microphone can hear the instrument
            clearly.
          </label>

          <Button type="submit">Save and continue</Button>
          {saved ? (
            <p className="text-xs text-muted-foreground">
              Saved locally in this browser for the MVP prototype.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
