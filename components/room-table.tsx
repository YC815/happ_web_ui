"use client";

import type { VenueType } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import roomsData from "@/public/rooms.json";

interface RoomTableProps {
  venue: VenueType;
}

const VENUE_NAME_MAP: Record<VenueType, string> = {
  minquan: "民權",
  taipower: "台電",
};

export function RoomTable({ venue }: RoomTableProps) {
  const router = useRouter();

  // 找到對應的 venue
  const venueData = roomsData.find((v) => v.name === VENUE_NAME_MAP[venue]);

  // 扁平化所有房間，使用 space_id 作為唯一鍵去重
  const roomsMap = new Map<string, {
    id: string;
    name: string;
    capacity: string;
    priority: string;
    address: string;
    hubName: string;
    url: string;
  }>();

  venueData?.hubs.forEach((hub) => {
    hub.hubRooms.forEach((room) => {
      // 使用 space_id 避免重複
      if (!roomsMap.has(room.space_id)) {
        roomsMap.set(room.space_id, {
          id: room.space_id,
          name: room.roomNumber,
          capacity: room.capacity,
          priority: room.priority,
          address: hub.address,
          hubName: hub.name2,
          url: room.url,
        });
      }
    });
  });

  const rooms = Array.from(roomsMap.values());

  const handleCreatePlan = (room: { id: string; name: string; hubName: string }) => {
    const params = new URLSearchParams({
      room_id: room.id,
      room_name: room.name,
      hub_name: room.hubName,
      venue,
    });
    router.push(`/plans/new?${params.toString()}`);
  };

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500">無可用房間</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>房號</TableHead>
            <TableHead>容量</TableHead>
            <TableHead>場館</TableHead>
            <TableHead>地址</TableHead>
            <TableHead className="text-center">優先級</TableHead>
            <TableHead className="text-center">連結</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.name}</TableCell>
              <TableCell>{room.capacity} 人</TableCell>
              <TableCell>{room.hubName}</TableCell>
              <TableCell className="max-w-xs truncate">{room.address}</TableCell>
              <TableCell className="text-center">{room.priority}</TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href={room.url} target="_blank" rel="noopener noreferrer">
                    查看
                  </a>
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => handleCreatePlan({ id: room.id, name: room.name, hubName: room.hubName })}
                >
                  建立計劃
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
