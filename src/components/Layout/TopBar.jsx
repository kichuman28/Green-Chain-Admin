import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'

const TopBar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button className="flex items-center space-x-2 bg-green-primary text-white px-4 py-2 rounded-lg hover:bg-green-secondary transition-colors">
            <span>Connect Wallet</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar 