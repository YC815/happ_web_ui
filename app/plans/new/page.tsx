import { Suspense } from "react";
import { NewPlanContent } from "./new-plan-content";

export default function NewPlanPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">建立計劃</h1>
        <p className="mt-2 text-neutral-600">填寫表單以建立新的訂房計劃</p>
      </div>

      <Suspense fallback={<div>載入中...</div>}>
        <NewPlanContent />
      </Suspense>
    </div>
  );
}
