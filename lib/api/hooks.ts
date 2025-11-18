/**
 * API Hooks
 * 基於 SWR 的資料抓取 hooks
 */

import useSWR, { type SWRConfiguration } from "swr";
import { api } from "./client";
import { API_ENDPOINTS } from "./config";
import type {
  Room,
  Plan,
  PlanWithTasks,
  DashboardStats,
  RecentEvent,
} from "../types";

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};

// ============ Rooms ============

export function useAvailableRooms(roomId: string | null) {
  return useSWR<Room[]>(
    roomId ? API_ENDPOINTS.rooms.search(roomId) : null,
    api.get,
    defaultConfig
  );
}

// ============ Plans ============

export function usePlans(status?: string) {
  return useSWR<Plan[]>(
    API_ENDPOINTS.plans.list(status),
    api.get,
    defaultConfig
  );
}

export function usePlan(id: string | null) {
  return useSWR<PlanWithTasks>(
    id ? API_ENDPOINTS.plans.get(id) : null,
    api.get,
    defaultConfig
  );
}

// ============ Dashboard ============

export function useDashboardStats() {
  return useSWR<DashboardStats>(
    API_ENDPOINTS.dashboard.stats(),
    api.get,
    {
      ...defaultConfig,
      refreshInterval: 30000, // 每 30 秒刷新
    }
  );
}

export function useRecentEvents() {
  return useSWR<RecentEvent[]>(
    API_ENDPOINTS.dashboard.events(),
    api.get,
    {
      ...defaultConfig,
      refreshInterval: 15000, // 每 15 秒刷新
    }
  );
}
