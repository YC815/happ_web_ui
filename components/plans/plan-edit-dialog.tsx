"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import type { Plan, PlanStatus, UpdatePlanRequest } from "@/lib/types";

interface PlanEditDialogProps {
  plan: Plan | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TIME_SLOTS = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

const editFormSchema = z.object({
  end_time: z.string().nullable(),
  status: z.enum([
    "pending",
    "in_progress",
    "completed",
    "failed",
    "cancelled",
  ]),
});

type EditFormValues = z.infer<typeof editFormSchema>;

const STATUS_LABELS: Record<PlanStatus, string> = {
  pending: "待執行",
  in_progress: "執行中",
  completed: "已完成",
  failed: "失敗",
  cancelled: "已取消",
};

export function PlanEditDialog({
  plan,
  onClose,
  onSuccess,
}: PlanEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      end_time: null,
      status: "pending",
    },
  });

  // 當 plan 變更時更新表單預設值
  useEffect(() => {
    if (plan) {
      form.reset({
        end_time: plan.end_time || null,
        status: plan.status,
      });
    }
  }, [plan, form]);

  const onSubmit = async (values: EditFormValues) => {
    if (!plan) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: UpdatePlanRequest = {
        end_time: values.end_time,
        status: values.status,
      };

      await api.patch(API_ENDPOINTS.plans.update(plan.id), payload);
      onSuccess();
      onClose();
    } catch (err) {
      let errorMessage = "更新失敗：未知錯誤";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={!!plan} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯計劃</DialogTitle>
          <DialogDescription>
            修改計劃的結束時間或狀態。修改結束時間將重新生成續訂任務。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 顯示房間資訊（唯讀） */}
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm">
                <span className="text-muted-foreground">房間：</span>
                <span className="font-medium ml-2">{plan.room_name}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">日期：</span>
                <span className="ml-2">{plan.start_day}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">開始時間：</span>
                <span className="ml-2">{plan.start_time}</span>
              </div>
            </div>

            {/* 結束時間選擇器 */}
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>結束時間</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "null" ? null : value)
                    }
                    value={field.value || "null"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇時間" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">單次訂房（無續訂）</SelectItem>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    設定重複續訂的結束時間，或選擇「單次訂房」
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 狀態選擇器 */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>狀態</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇狀態" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>手動變更計劃狀態</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "儲存中..." : "儲存變更"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
