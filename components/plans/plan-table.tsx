import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Plan, PlanStatus, VenueType } from "@/lib/types";

interface PlanTableProps {
  plans: Plan[];
  isLoading: boolean;
  onPreview: (id: string) => void;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

const VENUE_LABELS: Record<VenueType, string> = {
  minquan: "民權",
  taipower: "台電",
};

const STATUS_LABELS: Record<PlanStatus, string> = {
  pending: "待執行",
  in_progress: "執行中",
  completed: "已完成",
  failed: "失敗",
  cancelled: "已取消",
};

const STATUS_VARIANTS: Record<
  PlanStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  in_progress: "default",
  completed: "outline",
  failed: "destructive",
  cancelled: "outline",
};

export function PlanTable({
  plans,
  isLoading,
  onPreview,
  onEdit,
  onDelete,
}: PlanTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">載入中...</div>
    );
  }

  if (plans.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">無資料</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>房間</TableHead>
            <TableHead>場館</TableHead>
            <TableHead>日期</TableHead>
            <TableHead>開始時間</TableHead>
            <TableHead>結束時間</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow
              key={plan.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onPreview(plan.id)}
            >
              <TableCell className="font-medium">{plan.room_name}</TableCell>
              <TableCell>{VENUE_LABELS[plan.venue]}</TableCell>
              <TableCell>{plan.start_day}</TableCell>
              <TableCell>{plan.start_time}</TableCell>
              <TableCell>{plan.end_time || "-"}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANTS[plan.status]}>
                  {STATUS_LABELS[plan.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(plan);
                  }}
                >
                  編輯
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(plan.id);
                  }}
                >
                  刪除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
