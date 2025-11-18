"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { transformEventsResponse } from "@/lib/api/transformers";
import type { TaskEventApiResponse } from "@/lib/types";

const STATUS_ICONS = {
  success: "🟢",
  failure: "🔴",
  start: "🟡",
} as const;

export function EventFeed() {
  const { data: events, isLoading } = useSWR(
    API_ENDPOINTS.dashboard.events(),
    async (url: string) => {
      const apiEvents = await api.get<TaskEventApiResponse[]>(url);
      return transformEventsResponse(apiEvents);
    },
    {
      refreshInterval: 10000, // 每 10 秒自動刷新
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>最新動態</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 text-sm border-l-2 border-muted pl-3 py-1"
              >
                <span className="text-xs text-muted-foreground min-w-[40px] mt-0.5">
                  {new Date(event.time).toLocaleTimeString("zh-TW", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-base">{STATUS_ICONS[event.type]}</span>
                <div className="flex-1">
                  <p className="leading-relaxed">{event.message}</p>
                  {event.plan_id && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      asChild
                    >
                      <a href={`/plans?plan_id=${event.plan_id}`}>
                        查看計劃 <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            尚無事件記錄
          </p>
        )}
      </CardContent>
    </Card>
  );
}
