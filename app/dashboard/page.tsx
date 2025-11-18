"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { EventFeed } from "@/components/dashboard/event-feed";
import { ActivePlansTable } from "@/components/dashboard/active-plans-table";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">控制中心</h1>
        <p className="text-muted-foreground mt-1">
          即時監控訂房系統狀態
        </p>
      </div>

      {/* 五大狀態卡片 */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新事件流 */}
        <EventFeed />

        {/* 進行中計劃 */}
        <ActivePlansTable />
      </div>
    </div>
  );
}
