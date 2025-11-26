/**
 * Rooms Page
 * 顯示收藏空間列表（從爬蟲 API 抓取）
 * 按照場館分類顯示
 */

import { fetchFavorites, groupFavoritesByVenue } from '@/lib/api/favorites';
import { FavoritesTabs } from './_components/FavoritesTabs';
import { RefreshButton } from './_components/RefreshButton';

export const dynamic = 'force-dynamic';

export default async function RoomsPage() {
  const data = await fetchFavorites();
  const groupedSpaces = groupFavoritesByVenue(data.spaces);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">收藏空間</h1>
          <p className="mt-2 text-neutral-600">
            共 {data.count} 個收藏空間
          </p>
        </div>
        <RefreshButton />
      </div>

      <FavoritesTabs groupedSpaces={groupedSpaces} />
    </div>
  );
}
