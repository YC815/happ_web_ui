/**
 * Favorites Table Component
 * 顯示收藏空間列表
 */

'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { FavoriteSpace } from '@/lib/api/favorites';

interface FavoritesTableProps {
  spaces: FavoriteSpace[];
}

export function FavoritesTable({ spaces }: FavoritesTableProps) {
  const router = useRouter();

  if (spaces.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500">無收藏空間</p>
      </div>
    );
  }

  const handleCreatePlan = (space: FavoriteSpace) => {
    const params = new URLSearchParams({
      room_id: space.id.toString(),
      room_name: space.title,
    });
    router.push(`/plans/new?${params.toString()}`);
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>標題</TableHead>
            <TableHead>房號</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spaces.map((space) => (
            <TableRow key={space.id}>
              <TableCell className="font-medium">{space.title}</TableCell>
              <TableCell>{space.room_number}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => handleCreatePlan(space)}
                >
                  訂購
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
