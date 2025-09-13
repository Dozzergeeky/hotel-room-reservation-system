import { Room, BookingResult, calculateTotalTravelTime } from '@/types/room';

// Find optimal booking using the specified rules
export function findOptimalBooking(availableRoomsByFloor: Map<number, Room[]>, roomCount: number): BookingResult | null {
  if (roomCount > 5) {
    return null; // Max 5 rooms per booking
  }

  const availableFloors = Array.from(availableRoomsByFloor.entries())
    .filter(([_, rooms]) => rooms.length > 0)
    .sort(([floorA], [floorB]) => floorA - floorB);

  if (availableFloors.length === 0) {
    return null;
  }

  // Rule 1: Try to book on the same floor first (lowest floor number first)
  for (const [floor, availableRooms] of availableFloors) {
    if (availableRooms.length >= roomCount) {
      // Find contiguous rooms that minimize travel time
      const optimalRooms = findContiguousRooms(availableRooms, roomCount);
      if (optimalRooms.length === roomCount) {
        return {
          rooms: optimalRooms,
          totalTravelTime: calculateTotalTravelTime(optimalRooms)
        };
      }
    }
  }

  // Rule 2: If not enough rooms on one floor, book across floors
  return findMultiFloorBooking(availableFloors, roomCount);
}

// Find contiguous rooms that minimize travel time
function findContiguousRooms(rooms: Room[], count: number): Room[] {
  const sortedRooms = [...rooms].sort((a, b) => a.position - b.position);

  if (sortedRooms.length < count) {
    return [];
  }

  let bestSequence: Room[] = [];
  let bestTime = Infinity;

  for (let i = 0; i <= sortedRooms.length - count; i++) {
    const sequence = sortedRooms.slice(i, i + count);
    const travelTime = calculateTotalTravelTime(sequence);

    if (travelTime < bestTime) {
      bestTime = travelTime;
      bestSequence = sequence;
    }
  }

  return bestSequence;
}

// Find optimal booking across multiple floors
function findMultiFloorBooking(availableFloors: [number, Room[]][], roomCount: number): BookingResult | null {
  const allAvailableRooms = availableFloors.flatMap(([_, rooms]) => rooms);

  if (allAvailableRooms.length < roomCount) {
    return null;
  }

  // Use greedy approach: select rooms with minimal travel time impact
  const selectedRooms: Room[] = [];
  const remainingRooms = [...allAvailableRooms];

  // Start with the room closest to stairs/lift (position 1)
  let startRoom = remainingRooms.find(room => room.position === 1 && room.floor === Math.min(...availableFloors.map(([f]) => f)));
  if (!startRoom) {
    startRoom = remainingRooms[0];
  }

  selectedRooms.push(startRoom);
  remainingRooms.splice(remainingRooms.indexOf(startRoom), 1);

  // Add remaining rooms one by one, choosing the one that minimizes current total travel time
  while (selectedRooms.length < roomCount && remainingRooms.length > 0) {
    let bestRoom: Room | null = null;
    let bestIncrease = Infinity;

    for (const candidate of remainingRooms) {
      const tempSelection = [...selectedRooms, candidate];
      const currentTime = calculateTotalTravelTime(tempSelection);
      const newIncrease = currentTime - calculateTotalTravelTime(selectedRooms);

      if (newIncrease < bestIncrease) {
        bestIncrease = newIncrease;
        bestRoom = candidate;
      }
    }

    if (bestRoom) {
      selectedRooms.push(bestRoom);
      remainingRooms.splice(remainingRooms.indexOf(bestRoom), 1);
    } else {
      break;
    }
  }

  if (selectedRooms.length === roomCount) {
    return {
      rooms: selectedRooms,
      totalTravelTime: calculateTotalTravelTime(selectedRooms)
    };
  }

  return null;
}