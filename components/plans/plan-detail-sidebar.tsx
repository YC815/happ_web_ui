"use client";

import useSWR from "swr";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { transformPlanWithTasks } from "@/lib/api/transformers";
import type {
  PlanWithTasks,
  PlanApiResponse,
  PlanStatus,
  VenueType,
  TaskType,
  TaskStatus,
} from "@/lib/types";

interface PlanDetailSidebarProps {
  planId: string | null;
  onClose: () => void;
  onEdit: (plan: PlanWithTasks) => void;
  onDelete: (id: string) => void;
}

const VENUE_LABELS: Record<VenueType, string> = {
  minquan: "民權",
  taipower: "台電",
};

const STATUS_LABELS: Record<PlanStatus, string> = {
  pending: "待執行",
  in_progress: "執行中",
  completed: "已完成",
  failed: "失敗",
  cancelled: "已取消",
};

const STATUS_VARIANTS: Record<
  PlanStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  in_progress: "default",
  completed: "outline",
  failed: "destructive",
  cancelled: "outline",
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  book: "訂房",
  renew: "續訂",
};

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "待執行",
  in_progress: "執行中",
  completed: "已完成",
  failed: "失敗",
};

const TASK_STATUS_VARIANTS: Record<
  TaskStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  in_progress: "default",
  completed: "outline",
  failed: "destructive",
};

export function PlanDetailSidebar({
  planId,
  onClose,
  onEdit,
  onDelete,
}: PlanDetailSidebarProps) {
  const { data: plan, isLoading } = useSWR<PlanWithTasks>(
    planId ? API_ENDPOINTS.plans.get(planId) : null,
    async (url: string) => {
      const response = await api.get<PlanApiResponse>(url);
      return transformPlanWithTasks(response);
    }
  );

  if (!planId) return null;

  return (
    <Sheet open={!!planId} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>計劃詳情</SheetTitle>
        </SheetHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">載入中...</div>
          </div>
        )}

        {plan && (
          <div className="space-y-6 mt-6">
            {/* 基本資訊 */}
            <section>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                基本資訊
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">房間</dt>
                  <dd className="font-medium">{plan.room_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">場館</dt>
                  <dd>{VENUE_LABELS[plan.venue]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">日期</dt>
                  <dd>{plan.start_day}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">開始時間</dt>
                  <dd>{plan.start_time}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">結束時間</dt>
                  <dd>{plan.end_time || "單次訂房"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">狀態</dt>
                  <dd>
                    <Badge variant={STATUS_VARIANTS[plan.status]}>
                      {STATUS_LABELS[plan.status]}
                    </Badge>
                  </dd>
                </div>
                {plan.line_user_id && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">LINE 使用者</dt>
                    <dd className="font-mono text-xs">{plan.line_user_id}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">忽略公告</dt>
                  <dd>{plan.ignore_announcement ? "是" : "否"}</dd>
                </div>
              </dl>
            </section>

            {/* 任務列表 */}
            <section>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">
                相關任務 ({plan.tasks?.length || 0})
              </h3>
              {plan.tasks && plan.tasks.length > 0 ? (
                <div className="space-y-2">
                  {plan.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">
                            {TASK_TYPE_LABELS[task.type]}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(task.scheduled_time).toLocaleString(
                              "zh-TW",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        <Badge variant={TASK_STATUS_VARIANTS[task.status]}>
                          {TASK_STATUS_LABELS[task.status]}
                        </Badge>
                      </div>
                      {task.order_url && (
                        <a
                          href={task.order_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline block"
                        >
                          查看訂單 →
                        </a>
                      )}
                      {task.error_message && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          {task.error_message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                  目前無相關任務
                </p>
              )}
            </section>

            {/* 時間戳記 */}
            <section className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
              <div>
                建立時間：
                {new Date(plan.created_at).toLocaleString("zh-TW")}
              </div>
              <div>
                更新時間：
                {new Date(plan.updated_at).toLocaleString("zh-TW")}
              </div>
            </section>

            {/* 操作按鈕 */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button onClick={() => onEdit(plan)} className="flex-1">
                編輯
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(plan.id)}
                className="flex-1"
              >
                刪除
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
