'use client'

import { useState, useEffect } from 'react';
import { Room } from '@/types/room';
import { generateAllRooms, getAvailableRoomsByFloor } from '@/types/room';
import { findOptimalBooking } from '@/utils/booking';

export default function HotelReservation() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [inputRooms, setInputRooms] = useState<string>('');
  const [lastBooking, setLastBooking] = useState<{rooms: Room[], totalTravelTime: number} | null>(null);

  // Initialize rooms on component mount
  useEffect(() => {
    setRooms(generateAllRooms());
  }, []);

  const handleBookRooms = () => {
    const count = parseInt(inputRooms);
    if (isNaN(count) || count < 1 || count > 5) {
      alert('Please enter a number between 1 and 5');
      return;
    }

    const availableRoomsByFloor = getAvailableRoomsByFloor(rooms);
    const booking = findOptimalBooking(availableRoomsByFloor, count);

    if (!booking) {
      alert('Not enough available rooms for this booking');
      return;
    }

    // Mark rooms as occupied
    const updatedRooms = rooms.map(room => {
      const isBooked = booking.rooms.some(bookedRoom => bookedRoom.id === room.id);
      return isBooked ? { ...room, isOccupied: true } : room;
    });

    setRooms(updatedRooms);
    setLastBooking({ rooms: booking.rooms, totalTravelTime: booking.totalTravelTime });
    setInputRooms('');
  };

  const handleRandomOccupancy = () => {
    const updatedRooms = rooms.map(room => ({
      ...room,
      isOccupied: Math.random() < 0.3 // 30% chance of being occupied
    }));
    setRooms(updatedRooms);
    setLastBooking(null);
  };

  const handleReset = () => {
    setRooms(generateAllRooms());
    setLastBooking(null);
    setInputRooms('');
  };

  const getRoomColor = (room: Room) => {
    if (lastBooking?.rooms.some(br => br.id === room.id)) {
      return 'bg-blue-500 text-white'; // Freshly booked rooms
    } else if (room.isOccupied) {
      return 'bg-red-500 text-white'; // Occupied rooms
    } else {
      return 'bg-green-500 text-white'; // Available rooms
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="roomCount" className="font-semibold">No of Rooms:</label>
            <input
              id="roomCount"
              type="number"
              min="1"
              max="5"
              value={inputRooms}
              onChange={(e) => setInputRooms(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 w-20"
            />
          </div>
          <button
            onClick={handleBookRooms}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Book
          </button>
          <button
            onClick={handleRandomOccupancy}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
          >
            Random
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>

        {lastBooking && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-blue-800">
              <strong>Booking Confirmed!</strong> Rooms: {lastBooking.rooms.map(r => r.id).join(', ')} |
              Total Travel Time: {lastBooking.totalTravelTime} minutes
            </p>
          </div>
        )}
      </div>

      {/* Hotel Layout */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Hotel Layout</h2>
        <div className="flex flex-col gap-2">
          {/* Staircase/Lift Indicator */}
          <div className="flex">
            <div className="w-12 text-center bg-gray-300 p-2 rounded font-semibold">↑<br/>Lift<br/>Stairs</div>
            <div className="flex-1"></div>
          </div>

          {/* Floors */}
          {Array.from({length: 10}, (_, i) => i + 1).reverse().map(floor => {
            const roomsOnFloor = rooms.filter(room => room.floor === floor);
            const roomsPerFloor = floor === 10 ? 7 : 10;

            return (
              <div key={floor} className="flex items-center gap-2">
                <div className="w-12 text-center bg-gray-100 p-2 rounded font-semibold">
                  Floor {floor}
                </div>
                <div className="flex gap-1 flex-1">
                  {Array.from({length: roomsPerFloor}, (_, i) => {
                    const room = roomsOnFloor.find(r => r.position === i + 1);
                    if (!room) return null;

                    return (
                      <div
                        key={room.id}
                        className={`flex-1 p-2 rounded text-xs font-mono text-center cursor-pointer hover:opacity-80 transition-opacity ${getRoomColor(room)}`}
                        title={`Room ${room.id}`}
                      >
                        {room.id}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Just Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}