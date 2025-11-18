/**
 * Happ System API Types
 * 基於 API 文件定義的核心型別
 */

// ============ 列舉型別 ============

export type VenueType = "minquan" | "taipower";

export type PlanStatus = "pending" | "in_progress" | "completed" | "failed" | "cancelled";

export type TaskType = "book" | "renew";

export type TaskStatus = "pending" | "in_progress" | "completed" | "failed";

// ============ Room 相關型別 ============

export interface Room {
  id: string;
  name: string;
  venue: VenueType;
  capacity: number;
  address: string;
  priority: number;
}

export interface RoomAvailability {
  room_id: string;
  room_name: string;
  venue: VenueType;
  available_slots: {
    date: string;
    start_time: string;
    end_time: string;
  }[];
}

// ============ Plan 相關型別 ============

// 後端實際返回的資料結構
export interface PlanApiResponse {
  plan_id: string;
  room_id: number;
  line_user_id: string | null;
  target_start_time: string; // ISO datetime
  target_end_time: string; // ISO datetime
  status: PlanStatus;
  order_url: string | null;
  created_at: string;
  updated_at: string;
  tasks: TaskApiResponse[];
}

// 前端使用的資料結構
export interface Plan {
  id: string;
  room_id: string;
  room_name: string;
  venue: VenueType;
  start_day: string;
  start_time: string;
  end_time: string | null; // null = 單次訂房，有值 = 重複續訂
  status: PlanStatus;
  line_user_id?: string;
  ignore_announcement: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanRequest {
  room_id: string;
  start_day: string;
  start_time: string;
  end_time?: string | null;
  line_user_id?: string;
  ignore_announcement?: boolean;
}

export interface UpdatePlanRequest {
  end_time?: string | null;
  status?: PlanStatus;
}

// ============ Task 相關型別 ============

// 後端實際返回的資料結構
export interface TaskApiResponse {
  task_id: number;
  execute_at: string;
  action: "booking" | "renew";
  status: "pending" | "in_progress" | "completed" | "failed" | "skipped";
  executed_at: string | null;
  error_message: string | null;
}

// 前端使用的資料結構
export interface Task {
  id: string;
  plan_id: string;
  type: TaskType;
  scheduled_time: string;
  status: TaskStatus;
  error_message?: string;
  order_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PlanWithTasks extends Plan {
  tasks: Task[];
}

// ============ Dashboard 統計型別 ============

export interface DashboardStats {
  today_plans: number;
  in_progress: number;
  completed: number;
  failed: number;
  pending: number;
}

// 後端 /dashboard/events 實際回傳的格式
export interface TaskEventApiResponse {
  task_id: number;
  plan_id: string;
  line_user_id: string | null;
  action: "booking" | "renew";
  status: "completed" | "failed" | "in_progress" | "pending" | "skipped";
  execute_at: string;
  executed_at: string | null;
  error_message: string | null;
}

// 前端使用的事件格式（已處理）
export interface RecentEvent {
  id: string;
  type: "success" | "failure" | "start";
  message: string;
  time: string;
  plan_id?: string;
  task_id?: string;
}

// ============ API 回應包裝型別 ============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
