// Room types and interfaces
export interface Room {
  id: string;
  floor: number;
  position: number; // 1-indexed position on the floor
  isOccupied: boolean;
}

export interface BookingResult {
  rooms: Room[];
  totalTravelTime: number;
  bookingId?: string;
}

export interface BookingAttempt {
  roomCount: number;
  availableRoomsPerFloor: Map<number, Room[]>;
}

// Calculate travel time between two rooms (in minutes)
export function calculateTravelTime(room1: Room, room2: Room): number {
  if (room1.floor === room2.floor) {
    // Same floor: 1 minute per room horizontally
    return Math.abs(room1.position - room2.position);
  } else {
    // Different floors: 2 minutes per floor vertically + horizontal distance
    const verticalTime = Math.abs(room1.floor - room2.floor) * 2;
    const horizontalTime = Math.abs(room1.position - room2.position);
    return verticalTime + horizontalTime;
  }
}

// Calculate total travel time for a set of rooms
export function calculateTotalTravelTime(rooms: Room[]): number {
  if (rooms.length <= 1) return 0;

  let totalTime = 0;
  for (let i = 0; i < rooms.length - 1; i++) {
    totalTime += calculateTravelTime(rooms[i], rooms[rooms.length - 1]);
  }

  return totalTime;
}

// Get room count per floor
export function getFloorRoomCount(floor: number): number {
  return floor === 10 ? 7 : 10;
}

// Generate all rooms
export function generateAllRooms(): Room[] {
  const rooms: Room[] = [];

  for (let floor = 1; floor <= 10; floor++) {
    const roomCount = getFloorRoomCount(floor);
    for (let position = 1; position <= roomCount; position++) {
      let roomId: string;
      if (floor === 10) {
        roomId = `10${position.toString().padStart(2, '0')}`;
      } else {
        roomId = `${floor}${position.toString().padStart(2, '0')}`;
      }

      rooms.push({
        id: roomId,
        floor,
        position,
        isOccupied: false
      });
    }
  }

  return rooms;
}

// Group rooms by floor and filter available ones
export function getAvailableRoomsByFloor(rooms: Room[]): Map<number, Room[]> {
  const floorMap = new Map<number, Room[]>();

  for (let floor = 1; floor <= 10; floor++) {
    floorMap.set(floor, []);
  }

  rooms.filter(room => !room.isOccupied).forEach(room => {
    floorMap.get(room.floor)!.push(room);
  });

  return floorMap;
}