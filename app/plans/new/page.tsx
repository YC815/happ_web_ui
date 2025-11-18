"use client";

import { useSearchParams } from "next/navigation";
import { PlanForm } from "@/components/plan-form";

export default function NewPlanPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room_id");
  const roomName = searchParams.get("room_name");
  const venue = searchParams.get("venue");

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">建立計劃</h1>
        <p className="mt-2 text-neutral-600">填寫表單以建立新的訂房計劃</p>
      </div>

      <PlanForm
        defaultValues={{
          roomId: roomId || undefined,
          roomName: roomName || undefined,
          venue: (venue as "minquan" | "taipower") || undefined,
        }}
      />
    </div>
  );
}
