import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Step 1 of the journey</p>
        <h1 className="text-3xl font-semibold tracking-tight">Onboarding</h1>
        <p className="text-muted-foreground">
          We keep this lightweight for the MVP: your answers stay in this browser so
          you can explore the flow without signing up yet.
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}
