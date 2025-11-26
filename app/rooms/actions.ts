/**
 * Room Actions
 * Server Actions for room-related operations
 */

'use server';

import { revalidateTag } from 'next/cache';

/**
 * 手動刷新收藏列表
 * 清除 favorites cache，強制重新抓取
 */
export async function refreshFavorites() {
  revalidateTag('favorites', '/rooms');
}
