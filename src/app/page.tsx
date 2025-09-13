import HotelReservation from '@/components/HotelReservation'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Hotel Room Reservation System</h1>
        <HotelReservation />
      </div>
    </div>
  )
}