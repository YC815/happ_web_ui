"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";

interface PlanDeleteDialogProps {
  planId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PlanDeleteDialog({
  planId,
  onClose,
  onSuccess,
}: PlanDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onConfirm = async () => {
    if (!planId) return;

    setIsDeleting(true);
    setError(null);

    try {
      await api.delete(API_ENDPOINTS.plans.delete(planId));
      onSuccess();
      onClose();
    } catch (err) {
      let errorMessage = "刪除失敗：未知錯誤";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={!!planId} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定刪除此計劃？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作無法復原。刪除計劃後，所有相關任務也會被刪除。
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "刪除中..." : "確定刪除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
