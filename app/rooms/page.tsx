"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomTable } from "@/components/room-table";
import type { VenueType } from "@/lib/types";

const VENUES: { label: string; value: VenueType }[] = [
  { label: "民權", value: "minquan" },
  { label: "台電", value: "taipower" },
];

export default function RoomsPage() {
  const [activeVenue, setActiveVenue] = useState<VenueType>("minquan");

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">房間查詢</h1>
        <p className="mt-2 text-neutral-600">查詢可用房間並建立訂房計劃</p>
      </div>

      <Tabs
        value={activeVenue}
        onValueChange={(value) => setActiveVenue(value as VenueType)}
      >
        <TabsList>
          {VENUES.map((venue) => (
            <TabsTrigger key={venue.value} value={venue.value}>
              {venue.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {VENUES.map((venue) => (
          <TabsContent key={venue.value} value={venue.value}>
            <RoomTable venue={venue.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
