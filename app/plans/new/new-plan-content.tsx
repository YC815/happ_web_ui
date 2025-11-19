"use client";

import { useSearchParams } from "next/navigation";
import { PlanForm } from "@/components/plan-form";

export function NewPlanContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room_id");
  const roomName = searchParams.get("room_name");
  const venue = searchParams.get("venue");

  return (
    <PlanForm
      defaultValues={{
        roomId: roomId || undefined,
        roomName: roomName || undefined,
        venue: (venue as "minquan" | "taipower") || undefined,
      }}
    />
  );
}
