"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import type { DashboardStats } from "@/lib/types";

const STAT_CONFIGS = [
  {
    key: "today_plans" as const,
    title: "今日計劃",
    color: "border-l-4 border-neutral-400",
  },
  {
    key: "in_progress" as const,
    title: "進行中",
    color: "border-l-4 border-blue-500",
  },
  {
    key: "completed" as const,
    title: "已完成",
    color: "border-l-4 border-green-500",
  },
  {
    key: "failed" as const,
    title: "失敗",
    color: "border-l-4 border-red-500",
  },
  {
    key: "pending" as const,
    title: "Pending",
    color: "border-l-4 border-yellow-500",
  },
] as const;

export function StatsCards() {
  const { data: stats, isLoading } = useSWR(
    API_ENDPOINTS.dashboard.stats(),
    (url: string) => api.get<DashboardStats>(url),
    {
      refreshInterval: 30000, // 每 30 秒自動刷新
    }
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {STAT_CONFIGS.map(({ key, title, color }) => (
        <Card key={key} className={color}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-bold">{stats?.[key] ?? 0}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
