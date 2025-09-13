'use client'

import { useState, useEffect } from 'react';
import { Room } from '@/types/room';
import { generateAllRooms, getAvailableRoomsByFloor } from '@/types/room';
import { findOptimalBooking } from '@/utils/booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Building2, CheckCircle } from 'lucide-react';
import { Header } from '@/components/header';

export default function HotelReservation() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [inputRooms, setInputRooms] = useState<string>('');
  const [lastBooking, setLastBooking] = useState<{rooms: Room[], totalTravelTime: number} | null>(null);

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
      isOccupied: Math.random() < 0.3
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
      return 'bg-blue-500 dark:bg-blue-600 text-white border-blue-400 dark:border-blue-500';
    } else if (room.isOccupied) {
      return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400';
    } else {
      return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />

      <main className="container max-w-7xl mx-auto py-12 px-4 space-y-8">
        <div className="text-center space-y-4 pb-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Smart Room Allocation
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Optimize travel time with intelligent room booking across 10 floors
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Room Selection
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Select the number of rooms you&apos;d like to book (1-5 rooms maximum)
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-gray-50 dark:bg-gray-900/50">
                <Users className="w-4 h-4 mr-1" />
                {rooms.filter(r => r.isOccupied).length}/97 occupied
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="roomCount" className="font-medium text-gray-900 dark:text-gray-100">
                  Rooms:
                </label>
                <Input
                  id="roomCount"
                  type="number"
                  min="1"
                  max="5"
                  value={inputRooms}
                  onChange={(e) => setInputRooms(e.target.value)}
                  className="w-20 text-center border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950"
                  placeholder="1-5"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleBookRooms}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  size="sm"
                >
                  Book Rooms
                </Button>
                <Button
                  onClick={handleRandomOccupancy}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  Random
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Reset
                </Button>
              </div>
            </div>

            {lastBooking && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-100">
                      Booking confirmed
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Rooms: {lastBooking.rooms.map(r => r.id).join(', ')} • {lastBooking.totalTravelTime} min travel
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Hotel Layout
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  97 rooms across 10 floors with elevator and stairs on the left side
                </CardDescription>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                1 min (adjacent) • 2 min (floor)
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-2xl mb-1">🛗</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  ELEVATOR
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  STAIRS
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="font-medium">Travel time rules:</div>
                  <div className="flex gap-4 text-xs">
                    <span>Horizontal: 1 minute between adjacent rooms</span>
                    <span>Vertical: 2 minutes between floors</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {Array.from({length: 10}, (_, i) => i + 1).reverse().map(floor => {
                const roomsOnFloor = rooms.filter(room => room.floor === floor);
                const roomsPerFloor = floor === 10 ? 7 : 10;
                const availableRooms = roomsOnFloor.filter(r => !r.isOccupied).length;

                return (
                  <div
                    key={floor}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        Floor {floor}
                      </div>
                      <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {availableRooms}/{roomsPerFloor} available
                      </Badge>
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                      {Array.from({length: roomsPerFloor}, (_, i) => {
                        const room = roomsOnFloor.find(r => r.position === i + 1);
                        if (!room) return (
                          <div
                            key={`empty-${i}`}
                            className="aspect-square rounded border-2 border-dashed border-gray-300 dark:border-gray-600"
                          />
                        );

                        return (
                          <div
                            key={room.id}
                            className={`aspect-square rounded border-2 text-xs font-medium flex items-center justify-center cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 ${getRoomColor(room)}`}
                            title={`Room ${room.id} - ${room.isOccupied ? 'Occupied' : 'Available'}`}
                          >
                            {room.position.toString().padStart(2, '0')}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"></div>
                  <span className="text-gray-600 dark:text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-900/20"></div>
                  <span className="text-gray-600 dark:text-gray-400">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-400 dark:border-blue-500 bg-blue-500 dark:bg-blue-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">Just booked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black py-12 mt-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Hotel Reservation System • Optimized for travel time minimization
          </p>
        </div>
      </footer>
    </div>
  );
}