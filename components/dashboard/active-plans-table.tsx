"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { api } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { transformPlansResponse } from "@/lib/api/transformers";
import type { PlanApiResponse } from "@/lib/types";

type ViewType = "in_progress" | "today";

export function ActivePlansTable() {
  const [view, setView] = useState<ViewType>("in_progress");

  const { data: inProgressPlans, isLoading: loadingInProgress } = useSWR(
    API_ENDPOINTS.plans.list("in_progress"),
    async (url: string) => {
      const response = await api.get<{ total: number; plans: PlanApiResponse[] }>(url);
      return transformPlansResponse(response);
    },
    {
      refreshInterval: 15000, // 每 15 秒刷新
    }
  );

  const { data: pendingPlans, isLoading: loadingPending } = useSWR(
    API_ENDPOINTS.plans.list("pending"),
    async (url: string) => {
      const response = await api.get<{ total: number; plans: PlanApiResponse[] }>(url);
      return transformPlansResponse(response);
    },
    {
      refreshInterval: 15000,
    }
  );

  const isLoading = view === "in_progress" ? loadingInProgress : loadingPending;
  const plans = view === "in_progress" ? inProgressPlans || [] : pendingPlans || [];

  // 過濾今日計劃
  const todayPlans =
    view === "today"
      ? plans.filter((plan) => {
          const planDate = new Date(plan.start_day);
          const today = new Date();
          return (
            planDate.getFullYear() === today.getFullYear() &&
            planDate.getMonth() === today.getMonth() &&
            planDate.getDate() === today.getDate()
          );
        })
      : plans;

  return (
    <Card>
      <CardHeader>
        <CardTitle>計劃狀態</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={view} onValueChange={(v) => setView(v as ViewType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="in_progress">進行中</TabsTrigger>
            <TabsTrigger value="today">今日待執行</TabsTrigger>
          </TabsList>

          <TabsContent value={view}>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : todayPlans.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>房間</TableHead>
                      <TableHead>時段</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{plan.room_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {plan.venue === "minquan" ? "民權" : "台電"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{plan.start_time}</p>
                            {plan.end_time && (
                              <p className="text-xs text-muted-foreground">
                                續訂至 {plan.end_time}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              plan.status === "in_progress"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {plan.status === "in_progress" ? "執行中" : "待執行"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/plans?plan_id=${plan.id}`}>
                              查看 <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {view === "in_progress" ? "目前沒有進行中的計劃" : "今日沒有待執行計劃"}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
