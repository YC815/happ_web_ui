"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import type { CreatePlanRequest, VenueType } from "@/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const planFormSchema = z.object({
  room_id: z.string().min(1, "必填"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "格式：YYYY-MM-DD"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "格式：HH:MM"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "格式：HH:MM"),
  line_user_id: z.string().optional(),
  ignore_announcement: z.boolean(),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

interface PlanFormProps {
  defaultValues?: {
    roomId?: string;
    roomName?: string;
    venue?: VenueType;
  };
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

export function PlanForm({ defaultValues }: PlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      room_id: defaultValues?.roomId || "",
      date: "",
      start_time: "",
      end_time: "",
      line_user_id: "",
      ignore_announcement: false,
    },
  });

  const onSubmit = async (values: PlanFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreatePlanRequest = {
        room_id: values.room_id,
        start_day: values.date,
        start_time: values.start_time,
        end_time: values.end_time,
        ignore_announcement: values.ignore_announcement,
      };

      console.log("Sending payload:", payload);

      const response = await api.post(API_ENDPOINTS.plans.create(), payload);

      // Fire-and-forget webhook trigger
      fetch("https://happn8n.zeabur.app/webhook/run-execute", {
        method: "POST",
      }).catch(() => {
        // Silently fail - webhook failure should not block user flow
      });

      if (response && typeof response === "object" && "id" in response) {
        router.push(`/plans/${response.id}`);
      } else {
        router.push("/plans");
      }
    } catch (err) {
      let errorMessage = "建立失敗：未知錯誤";

      if (err instanceof ApiError) {
        errorMessage = err.message;
        if (err.responseBody) {
          errorMessage += `\n\n原始回應：\n${err.responseBody}`;
        }
        console.error("Plan creation failed:", {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url,
          responseBody: err.responseBody,
        });
      } else if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Plan creation error:", err);
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="room_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>房間 ID</FormLabel>
                <FormControl>
                  <Input placeholder="例如：589" {...field} />
                </FormControl>
                <FormDescription>
                  {defaultValues?.roomName &&
                    `當前選擇：${defaultValues.roomName}`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>日期</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>開始時間</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇時間" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>結束時間</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇時間" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  重複續訂至該時間
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ignore_announcement"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="!mt-0">忽略公告訊息</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-red-800">建立失敗</h3>
                <pre className="text-sm text-red-700 whitespace-pre-wrap font-sans">
                  {error}
                </pre>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "建立中..." : "建立計劃"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
