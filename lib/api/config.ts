/**
 * API 配置
 */

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 30000,
} as const;

export const API_ENDPOINTS = {
  // Rooms
  rooms: {
    search: (roomId: string) => `/rooms/search/available?room_id=${roomId}`,
  },

  // Plans
  plans: {
    list: (status?: string) => `/plans${status ? `?status=${status}` : ""}`,
    create: () => "/plans",
    get: (id: string) => `/plans/${id}`,
    update: (id: string) => `/plans/${id}`,
  },

  // Tasks
  tasks: {
    byPlan: (planId: string) => `/plans/${planId}/tasks`,
  },

  // Dashboard
  dashboard: {
    stats: () => "/dashboard/stats",
    events: () => "/dashboard/events",
  },
} as const;
