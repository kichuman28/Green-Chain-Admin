import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'

const TopBar = ({ walletAddress }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-display font-semibold text-gray-800">Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-light/30 rounded-xl border border-green-primary/20">
            <span className="text-sm font-medium text-green-primary">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not Connected'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar 