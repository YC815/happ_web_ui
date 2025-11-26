/**
 * Favorites Tabs Component
 * 按照場館分類顯示收藏空間
 */

'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FavoritesTable } from './FavoritesTable';
import type { VenueType } from '@/lib/types';
import type { FavoriteSpace } from '@/lib/api/favorites';

interface FavoritesTabsProps {
  groupedSpaces: Partial<Record<VenueType, FavoriteSpace[]>>;
}

const VENUES: { label: string; value: VenueType }[] = [
  { label: '民權', value: 'minquan' },
  { label: '台電', value: 'taipower' },
];

export function FavoritesTabs({ groupedSpaces }: FavoritesTabsProps) {
  const [activeVenue, setActiveVenue] = useState<VenueType>('minquan');

  return (
    <Tabs
      value={activeVenue}
      onValueChange={(value) => setActiveVenue(value as VenueType)}
    >
      <TabsList>
        {VENUES.map((venue) => {
          const count = groupedSpaces[venue.value]?.length || 0;
          return (
            <TabsTrigger key={venue.value} value={venue.value}>
              {venue.label} ({count})
            </TabsTrigger>
          );
        })}
      </TabsList>

      {VENUES.map((venue) => (
        <TabsContent key={venue.value} value={venue.value}>
          <FavoritesTable spaces={groupedSpaces[venue.value] || []} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
