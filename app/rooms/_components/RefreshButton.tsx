/**
 * Refresh Button Component
 * 手動刷新收藏列表的按鈕
 */

'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { refreshFavorites } from '../actions';

export function RefreshButton() {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshFavorites();
      // 刷新頁面以顯示新資料
      window.location.reload();
    });
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      {isPending ? '更新中...' : '重新整理'}
    </Button>
  );
}
