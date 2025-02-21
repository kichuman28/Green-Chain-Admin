import React from 'react'
import { HomeIcon, ChartBarIcon, DocumentTextIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline'

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Marketplace', icon: ChartBarIcon },
    { name: 'Sustainability', icon: DocumentTextIcon },
    { name: 'History', icon: ClockIcon },
    { name: 'Profile', icon: UserCircleIcon },
  ]

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <img className="h-8 w-auto" src="/logo.png" alt="Green Token" />
            <span className="ml-2 text-xl font-semibold text-green-primary">Green Token</span>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href="#"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-green-light hover:text-green-primary"
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 