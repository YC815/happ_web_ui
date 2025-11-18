下面給你 **完整、可直接交給設計師或直接做成 Next.js + shadcn/ui 的 WebUI 設計規格**。
這是「真正完整的 UI 設計」，包含：

- 頁面結構
- 排版
- 元件
- 功能動線
- 表單與狀態
- RWD 規劃
- 顏色、階層、標誌性 UI pattern

你可以直接照這份做成：

- Figma
- Next.js 頁面
- shadcn 的 UI Layout

我保持**簡潔、專業、極度明確**。

---

# 🎨 **Happ 自動化 WebUI — 完整 UI 設計規格**

## 🧱 **全站 Layout（全域 UI）**

```
┌──────────────────────────────────────────────┐
│ Top Bar                                       │
└──────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────┐
│ Sidebar      │ Main Content                  │
│ (fixed)      │ (scroll)                      │
└──────────────┴──────────────────────────────┘
```

### **Top Bar**

- 左側：系統名稱（Happ Automation Dashboard）
- 右側：時間 & Timezone → 例如「UTC+08 • 2025/11/18」
- 右上角：使用者頭像（可選，不必要）

### **Sidebar（左）**

使用 shadcn/ui Navigation Menu：

```
Dashboard
房間查詢
計劃管理
```

選取狀態使用：

- 左側亮色條 highlight
- icon + label

---

# 🏠 **頁面 1：Dashboard（控制中心）**

## **頁面結構**

```
[ 五大狀態卡片 ]
[ 最新動態流（Live Status） ]
[ 進行中計劃 ]
[ 今日剩餘計劃 ]
```

---

## 🎛️ **(1) 五大狀態卡片區（最上方 / 2 行）**

每個卡片大小相同，採用 shadcn/ui Card。

| 標題     | 數字 | 顏色    |
| -------- | ---- | ------- |
| 今日計劃 | 4    | default |
| 進行中   | 2    | blue    |
| 已完成   | 1    | green   |
| 失敗     | 0    | red     |
| Pending  | 1    | yellow  |

**視覺規劃：**

- Title：12px 灰字
- Number：32px 加粗
- 卡片背景：淺灰（#f9fafb）
- 成功（綠）、警告（黃）、失敗（紅）條加在卡片左側 4px

---

## 📡 **(2) 最新事件流（Live Status Feed）**

### UI 類似：

- GitHub Actions log
- Slack activity feed

### 結構：

每一行（shadcn/ui List）包含：

- 時間（09:30）
- 狀態小圓點（🟢🟡🔴）
- 事件描述（民權 A1 續訂成功）
- 附加資料（例如 order_url 按鈕）

### Example：

```
09:30  🟢 民權 A1 續訂成功（+30 分）
09:00  🔴 台電 B2 訂房失敗 → 查看計劃
08:30  🟢 民權 A1 訂房成功（order_url）
08:00  🟡 計劃 cmabcd 等待中（queue）
```

> 可切換顯示「過去 1 小時 / 今日 / 24 小時」。

---

## ⚙️ **(3) 進行中的計劃**

表格欄位：

| 房間 | 時段 | 任務進度 | 下一次任務 | 狀態 | 操作 |
| ---- | ---- | -------- | ---------- | ---- | ---- |

範例：

```
民權 A1 | 19:00–21:00 | 6/10 | 19:30 | 🟢 | 查看
台電 B2 | 20:00–22:00 | 4/8  | 20:30 | 🟡 | 查看
```

---

## 🗓️ **(4) 今日剩餘計劃**

表格顯示：

| 房間 | 計劃時間 | 下一動作 | 預定時間 | 狀態 |

用途：
**快速知道今天剩下什麼會跑、何時會跑**

---

# 🏚️ **頁面 2：房間查詢（Rooms）**

## 上方 Tabs（固定兩個）：

```
[ 民權 ]   [ 台電 ]
```

按下後即時 fetch：

```
GET /rooms/search/available?room_id=<民權ID>
```

---

## 下方是房間列表（Table）

欄位：

| 房號 | 容量 | 場館 | 地址 | 優先級 | 操作 |

### Example：

```
A1 | 4人 | 香杉 民權店 | 中山區民權東路… | 10 | 建立計劃
B3 | 6人 | 香杉 民權店 | 中山區民權東路… | 9  | 建立計劃
```

**UI：**

- 每列右邊一個 shadcn Button → “建立計劃”
- 點下後跳轉：

  - `/plans/new?room_id=xxxx&room_name=民權 A1`

---

# 📋 **頁面 3：計劃管理（Plans）**

## 頁籤分狀態（Tabs）：

```
Pending | In Progress | Completed | Failed | Cancelled
```

### 每個 Tab 的內容都是一個 Table：

| 房間 | 開始–結束 | 狀態 | 任務進度 | 最後更新 | 操作 |

例如：

```
民權 A1 | 19:00–21:00 | 🟢 In Progress | 6/10 | 18:59 | 查看
台電 B2 | 20:00–22:00 | 🔴 Failed      | 1/8  | 19:01 | 查看
```

按「查看」 → 進入計劃詳情頁。

---

# 🧩 **頁面 4：計劃詳情（Plan Detail）**

此頁是整套系統的 **核心畫面**
左側是計劃資訊
右側是任務 Timeline

---

## 🧱 **Layout**

```
| 計劃資訊（固定寬度） | 任務 Timeline（主要內容） |
```

---

## 🔷 左側：計劃資訊面板（Plan Info Panel）

使用固定寬度 280px 的 Card，包括：

- 計劃 ID
- 房間（民權 A1）
- 場館名稱
- 日期（2025/11/18）
- 開始時間（19:00）
- 結束時間（21:00）
- Line User（如有）
- ignore_announcement（true/false）
- Created_at / Updated_at

### 操作

上方放兩個按鈕：

- ✏「修改結束時間」
- ❌「取消計劃」

都用 shadcn Dialog 出現設定。

---

## 🔶 右側：任務 Timeline（Tasks Timeline）

UI 如 GitHub Actions timeline：

每個任務顯示：

- 時間（17:00）
- Action（訂房 or 續訂）
- 狀態標記

  - 🟢 完成
  - 🟡 待執行
  - 🔴 失敗

- 執行結果（成功文字 / error message）
- 如果有 order_url → 顯示按鈕

### Example：

```
17:00  訂房 → 🟢 Completed（order_url）
17:00  續訂 → 🟢 Completed
17:30  續訂 → 🟢 Completed
18:00  續訂 → 🟡 Pending
18:30  續訂 → 🟡 Pending
```

### 設計細節：

- 每個 task 是一個 Timeline item
- 左側是時間軸線
- 右側是內容
- 狀態點顏色：

  - 綠色：成功
  - 黃色：排隊中
  - 紅色：失敗

---

# 🖌 **色彩與主題規格（設計標準）**

### **主色（Primary）**

`#2563eb`（Tailwind blue-600）
用於按鈕、標題、Tab active 狀態

### **成功**

`#16a34a`（green-600）

### **警告**

`#ca8a04`（yellow-600）

### **失敗**

`#dc2626`（red-600）

### **背景**

`#f9fafb`（gray-50）

### **字體**

Inter / Noto Sans TC（你會需要用中文）

---

# 📱 **RWD 設計（簡版）**

- Sidebar 隱藏 → 用 Drawer
- Dashboard 的五個卡片 → 變成兩行
- 表格 → 越重要的資訊放左，次要資訊收合
- Timeline → 垂直顯示即可（自然）

---

# ⭐ 最終整理（你現在擁有的是一份完整 UI 規格書）

你已經擁有完整的：

- 全站 Layout
- 配色
- 排版
- 互動邏輯
- Table 欄位
- Dashboard 資訊層級
- Timeline 規格
- 房間查詢頁 UI
- 計劃管理 UI
- 計劃詳情 UI
- 操作動線（UX Flow）
- 行動版簡化邏輯

這份可以直接拿去：

- 做 Next.js
- 做 Figma
- 做 shadcn/ui component 實作
- 做 Tailwind 設計系統

---

# 📌 下一步你想要哪一個？

## A. 幫你把這份 UI 寫成 **Figma 的頁面結構文件（Frame + 元件階層）**

## B. 幫你做 **Next.js app/ 目錄結構 & Component 階層規劃**

## C. 直接幫你做 **shadcn/ui component 的完整組件藍圖**

## D. 產生 **3 頁的高擬真 Figma 風 ASCII Mockup**

你想要哪一個？
