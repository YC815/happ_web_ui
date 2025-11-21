/**
 * API 資料轉換器
 * 將後端返回的資料結構轉換為前端使用的格式
 */

import type {
  Plan,
  PlanApiResponse,
  Task,
  TaskApiResponse,
  PlanWithTasks,
  VenueType,
  TaskEventApiResponse,
  RecentEvent,
} from "@/lib/types";
import roomsData from "@/public/rooms.json";

// 建立 space_id → room info 的對應表
type RoomInfo = {
  name: string;
  venue: VenueType;
  roomNumber: string;
  hubName: string;
};

const roomsMap = new Map<string, RoomInfo>();

// 初始化 rooms 對應表
roomsData.forEach((venue) => {
  const venueName = venue.name === "民權" ? "minquan" : "taipower";
  venue.hubs.forEach((hub) => {
    hub.hubRooms.forEach((room) => {
      roomsMap.set(room.space_id, {
        name: room.space_full_name,
        venue: venueName as VenueType,
        roomNumber: room.roomNumber,
        hubName: hub.name2 || hub.name1 || "",
      });
    });
  });
});

/**
 * 根據 room_id 取得房間資訊
 */
function getRoomInfo(roomId: number): RoomInfo {
  const info = roomsMap.get(roomId.toString());
  if (info) return info;

  // 找不到時返回預設值
  return {
    name: `房間 ${roomId}`,
    venue: "minquan",
    roomNumber: roomId.toString(),
    hubName: "",
  };
}

/**
 * 將 ISO datetime 轉換為日期和時間
 * @example "2025-11-18T21:00:00" -> { date: "2025-11-18", time: "21:00" }
 */
function parseDateTime(isoString: string): { date: string; time: string } {
  const date = new Date(isoString);
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const timeStr = date.toTimeString().slice(0, 5); // HH:MM
  return { date: dateStr, time: timeStr };
}

/**
 * 轉換 Task API 回應為前端格式
 */
export function transformTask(apiTask: TaskApiResponse): Task {
  return {
    id: apiTask.task_id.toString(),
    plan_id: "", // 需要從父層傳入
    type: apiTask.action === "booking" ? "book" : "renew",
    scheduled_time: apiTask.execute_at,
    status: apiTask.status === "skipped" ? "failed" : apiTask.status, // skipped 視為 failed
    error_message: apiTask.error_message || undefined,
    order_url: undefined, // 後端 Task 沒有 order_url
    created_at: apiTask.execute_at, // 用 execute_at 代替
    updated_at: apiTask.executed_at || apiTask.execute_at,
  };
}

/**
 * 轉換 Plan API 回應為前端格式
 */
export function transformPlan(apiPlan: PlanApiResponse): Plan {
  const { date: startDate, time: startTime } = parseDateTime(
    apiPlan.usage_start_time
  );
  const { time: endTime } = parseDateTime(apiPlan.usage_end_time);

  const roomInfo = getRoomInfo(apiPlan.room_id);

  // 提取訂購時間 (從第一個 task 的 execute_at)
  let bookingDate: string | undefined;
  let bookingTime: string | undefined;
  if (apiPlan.tasks && apiPlan.tasks.length > 0) {
    const firstTask = apiPlan.tasks[0];
    const { date, time } = parseDateTime(firstTask.execute_at);
    bookingDate = date;
    bookingTime = time;
  }

  return {
    id: apiPlan.plan_id,
    room_id: apiPlan.room_id.toString(),
    room_name: roomInfo.name,
    venue: roomInfo.venue,
    start_day: startDate,
    start_time: startTime,
    end_time: endTime,
    booking_date: bookingDate,
    booking_time: bookingTime,
    status: apiPlan.status,
    line_user_id: apiPlan.line_user_id || undefined,
    ignore_announcement: false, // 後端沒返回，預設 false
    created_at: apiPlan.created_at,
    updated_at: apiPlan.updated_at,
  };
}

/**
 * 轉換帶有 tasks 的 Plan
 */
export function transformPlanWithTasks(apiPlan: PlanApiResponse): PlanWithTasks {
  const plan = transformPlan(apiPlan);
  const tasks = apiPlan.tasks.map((task) => ({
    ...transformTask(task),
    plan_id: plan.id,
  }));

  return {
    ...plan,
    tasks,
  };
}

/**
 * 轉換 Plans 列表 API 回應
 */
export function transformPlansResponse(response: {
  total: number;
  plans: PlanApiResponse[];
}): Plan[] {
  return response.plans.map(transformPlan);
}

/**
 * 轉換 Task Event API 回應為前端事件格式
 */
export function transformTaskEvent(apiEvent: TaskEventApiResponse): RecentEvent {
  const actionText = apiEvent.action === "booking" ? "訂房" : "續訂";

  // 決定事件類型和訊息
  let type: "success" | "failure" | "start";
  let message: string;

  if (apiEvent.status === "completed") {
    type = "success";
    message = `房間 ${apiEvent.room_id} ${actionText}成功`;
  } else if (apiEvent.status === "failed") {
    type = "failure";
    message = `房間 ${apiEvent.room_id} ${actionText}失敗`;
    if (apiEvent.error_message) {
      message += ` → ${apiEvent.error_message}`;
    }
  } else if (apiEvent.status === "in_progress") {
    type = "start";
    message = `房間 ${apiEvent.room_id} ${actionText}中...`;
  } else {
    // pending / skipped
    type = "start";
    message = `房間 ${apiEvent.room_id} ${actionText}待執行`;
  }

  return {
    id: apiEvent.task_id.toString(),
    type,
    message,
    time: apiEvent.executed_at || apiEvent.execute_at,
    plan_id: apiEvent.plan_id,
    task_id: apiEvent.task_id.toString(),
    room_id: apiEvent.room_id,
  };
}

/**
 * 轉換 Events 列表 API 回應
 */
export function transformEventsResponse(events: TaskEventApiResponse[]): RecentEvent[] {
  return events.map(transformTaskEvent);
}
