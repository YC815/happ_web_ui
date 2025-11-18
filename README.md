# Happ System WebUI

Happ 自動化訂房系統的管理後台介面。

## 技術棧

- **Next.js 16** - React 框架（App Router）
- **TypeScript** - 型別安全
- **Tailwind CSS 4** - 樣式框架
- **shadcn/ui** - UI 組件庫
- **SWR** - 資料抓取與快取
- **React Hook Form** - 表單管理
- **Zod** - 表單驗證

## 目錄結構

```
web_ui/
├── app/                      # Next.js App Router 頁面
│   ├── dashboard/           # 儀表板頁面
│   ├── rooms/               # 房間查詢頁面
│   ├── plans/               # 計劃管理頁面
│   │   ├── new/            # 建立計劃表單
│   │   └── [id]/           # 計劃詳情頁
│   ├── layout.tsx          # 全域 Layout（含 Sidebar）
│   └── page.tsx            # 首頁（重導向至 dashboard）
│
├── components/              # React 組件
│   ├── ui/                 # shadcn UI 基礎組件
│   └── sidebar.tsx         # 側邊欄組件
│
├── lib/                     # 工具函式與核心邏輯
│   ├── api/                # API 相關
│   │   ├── client.ts       # Fetch wrapper
│   │   ├── config.ts       # API 端點配置
│   │   ├── hooks.ts        # SWR hooks
│   │   └── index.ts        # 統一輸出
│   ├── types.ts            # TypeScript 型別定義
│   └── utils.ts            # 工具函式（cn 等）
│
└── .env.local              # 環境變數（不納入版控）
```

## 環境設定

1. 複製環境變數範例檔案：

```bash
cp .env.example .env.local
```

2. 設定 Happ API 的 base URL：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 開發指令

```bash
# 安裝依賴
npm install

# 開發模式（禁止使用！）
# npm run dev

# 建置專案
npm run build

# 啟動生產伺服器
npm run start

# Lint 檢查
npm run lint

# TypeScript 型別檢查
npx tsc --noEmit
```

## 頁面設計

### 1. 儀表板 (`/dashboard`)

- 顯示今日統計（計劃數、成功/失敗數）
- 最新事件流（即時更新）
- 進行中的計劃列表

### 2. 房間查詢 (`/rooms`)

- Tab 切換：民權 / 台電
- 顯示可用房間列表
- 點擊「建立計劃」跳轉至表單

### 3. 計劃管理 (`/plans`)

- Tab 切換：Pending / In Progress / Completed / Failed / Cancelled
- 顯示計劃列表（狀態、房間、時段）
- 點擊查看詳情

### 4. 建立計劃 (`/plans/new`)

- 表單：房間、日期、時段、Line ID、忽略公告
- 驗證後 POST 到 API

### 5. 計劃詳情 (`/plans/[id]`)

- 左側：計劃資訊面板（可修改結束時間、取消計劃）
- 右側：Task Timeline（訂房/續訂的執行歷程）

## API 整合

所有 API 請求透過 `lib/api` 模組處理：

```typescript
import { usePlans, api } from "@/lib/api";

// 使用 SWR hook（自動快取與刷新）
const { data, error, isLoading } = usePlans("pending");

// 直接呼叫 API
await api.post("/plans", { room_id: "xxx", ... });
```

## 型別定義

所有 API 回應型別定義在 `lib/types.ts`：

```typescript
import type { Plan, Task, Room } from "@/lib/types";
```

## 色彩系統

- Primary: `#2563eb`（藍色）
- Success: `#16a34a`（綠色）
- Warning: `#ca8a04`（黃色）
- Error: `#dc2626`（紅色）
- Background: `#f9fafb`（淺灰）

## 注意事項

1. **禁止使用 `npm run dev`**：開發時請使用 `npm run build && npm run start`
2. **每次改動後執行驗證**：
   ```bash
   npm run lint && npx tsc --noEmit
   ```
3. **API URL 必須設定**：確保 `.env.local` 正確指向 Happ server

## 下一步實作

- [ ] Dashboard 統計卡片與事件流
- [ ] Rooms 頁面（Tab + Table）
- [ ] Plans 列表頁面（Tab + Table）
- [ ] Plan 建立表單（React Hook Form + Zod）
- [ ] Plan 詳情頁（Timeline 組件）
