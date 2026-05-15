"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";

type Props = {
  lessonId: string;
};

export function MarkLessonReadButton({ lessonId }: Props) {
  const router = useRouter();
  const { markLessonComplete } = useProgress();

  return (
    <Button
      type="button"
      onClick={() => {
        markLessonComplete(lessonId);
        router.push("/roadmap");
      }}
    >
      Mark lesson as read
    </Button>
  );
}
