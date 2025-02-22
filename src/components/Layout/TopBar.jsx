import React from 'react'
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { useLocation } from 'react-router-dom'

const TopBar = ({ onMenuClick }) => {
  const location = useLocation()
  const title = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent">{title}</h1>
        </div>
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