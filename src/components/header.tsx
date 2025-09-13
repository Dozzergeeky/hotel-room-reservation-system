'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { Badge } from '@/components/ui/badge'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-black/80">
      <div className="container max-w-7xl mx-auto flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Hotel Reservation
          </h1>
          <Badge variant="secondary" className="hidden sm:inline-flex bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            v1.0.0
          </Badge>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}