'use client'

import { useState, useEffect } from 'react';
import { Room } from '@/types/room';
import { generateAllRooms, getAvailableRoomsByFloor } from '@/types/room';
import { findOptimalBooking } from '@/utils/booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
      return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg';
    } else if (room.isOccupied) {
      return 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400';
    } else {
      return 'bg-gradient-to-br from-green-400 to-green-500 text-gray-800 border-green-300 hover:shadow-md';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🏨 Hotel Room Reservation System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart room allocation system with travel time optimization across 97 rooms
          </p>
        </div>

        {/* Controls */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center">Booking Controls</CardTitle>
            <CardDescription className="text-center">
              Enter the number of rooms you want to book (maximum 5 rooms per booking)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="roomCount" className="text-lg font-medium whitespace-nowrap">
                  Number of Rooms:
                </label>
                <Input
                  id="roomCount"
                  type="number"
                  min="1"
                  max="5"
                  value={inputRooms}
                  onChange={(e) => setInputRooms(e.target.value)}
                  className="w-20 text-center font-semibold border-2 border-gray-200"
                  placeholder="1-5"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleBookRooms}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  📍 Book Rooms
                </Button>
                <Button
                  onClick={handleRandomOccupancy}
                  variant="outline"
                  className="font-semibold px-6 border-2 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                >
                  🎲 Random Occupancy
                </Button>
                <Button
                  onClick={handleReset}
                  variant="destructive"
                  className="font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  🔄 Reset All
                </Button>
              </div>
            </div>

            {lastBooking && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <div className="font-bold text-lg text-green-800">
                      Booking Confirmed!
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Rooms:</span> {lastBooking.rooms.map(r => r.id).join(', ')}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Total Travel Time:</span> {lastBooking.totalTravelTime} minutes
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hotel Layout */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              🏢 Hotel Floor Plan
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {rooms.filter(r => r.isOccupied).length}/97 Occupied
              </Badge>
            </CardTitle>
            <CardDescription className="text-center">
              10 floors with staircase and elevator on the left side • Travel: 1 min (horizontal) • 2 min (vertical)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Staircase/Lift Indicator */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 flex flex-col items-center p-4 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-md">
                <div className="text-2xl mb-1">🛗</div>
                <div className="text-xs font-bold text-center text-gray-700">
                  ELEVATOR<br/>&<br/>STAIRS
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-sm text-gray-600">
                <div><strong>Travel Rules:</strong></div>
                <div>• Move between adjacent rooms: <em>1 minute</em></div>
                <div>• Move between floors: <em>2 minutes</em></div>
              </div>
            </div>

            {/* Floors */}
            <div className="space-y-3">
              {Array.from({length: 10}, (_, i) => i + 1).reverse().map(floor => {
                const roomsOnFloor = rooms.filter(room => room.floor === floor);
                const roomsPerFloor = floor === 10 ? 7 : 10;
                const availableRooms = roomsOnFloor.filter(r => !r.isOccupied).length;

                return (
                  <div key={floor} className="border rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-800">
                          Floor {floor}
                        </h3>
                        <Badge variant={availableRooms > 0 ? "secondary" : "destructive"} className="text-xs">
                          {availableRooms} available
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {Array.from({length: roomsPerFloor}, (_, i) => {
                        const room = roomsOnFloor.find(r => r.position === i + 1);
                        if (!room) return null;

                        return (
                          <div
                            key={room.id}
                            className={`flex-1 p-3 rounded-lg border-2 text-xs font-bold text-center cursor-pointer transition-all duration-200 hover:scale-[1.02] ${getRoomColor(room)}`}
                            title={`Room ${room.id} - ${room.isOccupied ? 'Occupied' : 'Available'}`}
                          >
                            <div className="text-lg mb-1">
                              {lastBooking?.rooms.some(br => br.id === room.id) ? '✨' : room.isOccupied ? '🚫' : '🛏️'}
                            </div>
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
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold mb-3 text-center">Room Status Legend</h4>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 border rounded-md"></div>
                  <span className="font-medium">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 border rounded-md"></div>
                  <span className="font-medium">Occupied</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 border rounded-md shadow-lg"></div>
                  <span className="font-medium">Just Booked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}