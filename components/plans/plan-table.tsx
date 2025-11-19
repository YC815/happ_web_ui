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
import { Card, CardContent } from "@/components/ui/card";
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
    <>
      {/* Desktop: Table View */}
      <div className="hidden md:block border rounded-lg">
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

      {/* Mobile: Card View */}
      <div className="md:hidden space-y-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onPreview(plan.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-base">{plan.room_name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {VENUE_LABELS[plan.venue]}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANTS[plan.status]}>
                  {STATUS_LABELS[plan.status]}
                </Badge>
              </div>

              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">日期</span>
                  <span className="font-medium">{plan.start_day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">時間</span>
                  <span className="font-medium">
                    {plan.start_time} {plan.end_time && `~ ${plan.end_time}`}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(plan);
                  }}
                >
                  編輯
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(plan.id);
                  }}
                >
                  刪除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
