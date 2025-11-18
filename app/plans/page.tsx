"use client";

import { useState } from "react";
import useSWR from "swr";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlanTable } from "@/components/plans/plan-table";
import { PlanDetailSidebar } from "@/components/plans/plan-detail-sidebar";
import { PlanEditDialog } from "@/components/plans/plan-edit-dialog";
import { PlanDeleteDialog } from "@/components/plans/plan-delete-dialog";
import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { transformPlansResponse } from "@/lib/api/transformers";
import type { Plan, PlanStatus, PlanApiResponse } from "@/lib/types";
import Link from "next/link";

const STATUSES: PlanStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "failed",
  "cancelled",
];

const STATUS_LABELS: Record<PlanStatus, string> = {
  pending: "待執行",
  in_progress: "執行中",
  completed: "已完成",
  failed: "失敗",
  cancelled: "已取消",
};

export default function PlansPage() {
  const [selectedTab, setSelectedTab] = useState<PlanStatus>("pending");
  const [previewPlanId, setPreviewPlanId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR(
    API_ENDPOINTS.plans.list(selectedTab),
    async (url: string) => {
      const response = await api.get<{ total: number; plans: PlanApiResponse[] }>(url);
      return transformPlansResponse(response);
    }
  );

  const plans: Plan[] = data || [];

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">計劃管理</h1>
          <p className="text-muted-foreground mt-1">
            檢視和管理所有訂房計劃
          </p>
        </div>
        <Link href="/plans/new">
          <Button>建立新計劃</Button>
        </Link>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={(v) => setSelectedTab(v as PlanStatus)}
      >
        <TabsList>
          {STATUSES.map((status) => (
            <TabsTrigger key={status} value={status}>
              {STATUS_LABELS[status]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <PlanTable
            plans={plans || []}
            isLoading={isLoading}
            onPreview={setPreviewPlanId}
            onEdit={setEditingPlan}
            onDelete={setDeletingPlanId}
          />
        </TabsContent>
      </Tabs>

      {/* Right Sidebar 預覽 */}
      <PlanDetailSidebar
        planId={previewPlanId}
        onClose={() => setPreviewPlanId(null)}
        onEdit={(plan) => {
          setPreviewPlanId(null);
          setEditingPlan(plan);
        }}
        onDelete={(id) => {
          setPreviewPlanId(null);
          setDeletingPlanId(id);
        }}
      />

      {/* 編輯 Dialog */}
      <PlanEditDialog
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSuccess={() => {
          mutate();
        }}
      />

      {/* 刪除確認 Dialog */}
      <PlanDeleteDialog
        planId={deletingPlanId}
        onClose={() => setDeletingPlanId(null)}
        onSuccess={() => {
          mutate();
        }}
      />
    </div>
  );
}
