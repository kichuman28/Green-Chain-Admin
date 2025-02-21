import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { useLocation } from 'react-router-dom'

const TopBar = () => {
  const location = useLocation()
  const title = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2)

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative">
            <BellIcon className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-primary rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar 