/**
 * Favorites API
 * 收藏空間的 API 邏輯
 */

import type { VenueType } from '@/lib/types';

export interface FavoriteSpace {
  id: number;
  location_id: number;
  title: string;
  room_number: string;
  price: number;
  thumb: string;
  floor_plan: string;
}

export interface FavoritesResponse {
  success: boolean;
  spaces: FavoriteSpace[];
  count: number;
}

/**
 * 場館名稱映射表
 * 根據 title 中的場館名稱判斷屬於哪個 venue
 */
const VENUE_MAPPING: Record<string, VenueType> = {
  '香杉': 'minquan',
  '月橘': 'minquan',
  '楓香': 'minquan',
  '大葉桉': 'minquan',
  '天日松': 'taipower',
  '牡丹': 'taipower',
  '古亭': 'taipower',
  '杜鵑': 'taipower',
};

/**
 * 判斷空間屬於哪個場館
 */
export function getVenueFromTitle(title: string): VenueType {
  for (const [venueName, venue] of Object.entries(VENUE_MAPPING)) {
    if (title.includes(venueName)) {
      return venue;
    }
  }
  // 預設為民權
  return 'minquan';
}

/**
 * 抓取收藏空間列表
 * 直接從後端 API 取得資料
 */
export async function fetchFavorites(): Promise<FavoritesResponse> {
  // 動態 import API client 以確保只在伺服器端執行
  const { api } = await import('./client');
  const { API_ENDPOINTS } = await import('./config');

  return api.get<FavoritesResponse>(API_ENDPOINTS.favorites.list());
}

/**
 * 依照場館分類收藏空間
 */
export function groupFavoritesByVenue(spaces: FavoriteSpace[]) {
  return spaces.reduce((acc, space) => {
    const venue = getVenueFromTitle(space.title);
    if (!acc[venue]) {
      acc[venue] = [];
    }
    acc[venue].push(space);
    return acc;
  }, {} as Record<VenueType, FavoriteSpace[]>);
}
