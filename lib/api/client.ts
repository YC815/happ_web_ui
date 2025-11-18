/**
 * API Client
 * 簡單、直接的 fetch wrapper
 */

import { API_CONFIG } from "./config";

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public url?: string,
    public responseBody?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      // 嘗試解析 JSON 錯誤訊息
      try {
        const errorJson = JSON.parse(errorText);

        // FastAPI/Pydantic validation errors
        if (Array.isArray(errorJson.detail)) {
          errorMessage = errorJson.detail
            .map((err: { loc: string[]; msg: string; type: string }) => {
              const field = err.loc.slice(1).join(".");
              return `• ${field}: ${err.msg}`;
            })
            .join("\n");
        } else if (typeof errorJson.detail === "string") {
          errorMessage = errorJson.detail;
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        } else if (errorJson.error) {
          errorMessage = errorJson.error;
        } else {
          // 如果 JSON 有內容但沒有標準欄位，顯示整個 JSON
          errorMessage = JSON.stringify(errorJson, null, 2);
        }
      } catch {
        // 不是 JSON，直接用 text
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new ApiError(
        response.status,
        response.statusText,
        errorMessage,
        url,
        errorText
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(`請求超時 (${API_CONFIG.timeout}ms)\n目標：${url}`);
      }

      // 處理網路錯誤
      if (error.message === "Failed to fetch") {
        throw new Error(
          `無法連接到 API 伺服器\n` +
          `目標：${url}\n` +
          `請確認：\n` +
          `1. API 服務是否正在運行\n` +
          `2. NEXT_PUBLIC_API_BASE_URL 是否正確 (當前：${API_CONFIG.baseUrl})\n` +
          `3. 網路連線是否正常`
        );
      }

      throw error;
    }

    throw new Error("未知錯誤");
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

export { ApiError };
