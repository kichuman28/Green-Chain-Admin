import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useWeb3 } from '../../context/Web3Context'
import appLogo from '../../assets/app_icon.png'

const MenuItem = ({ icon: Icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 
      ${active 
        ? 'bg-green-primary text-white shadow-lg shadow-green-primary/20' 
        : 'text-gray-600 hover:bg-green-light/50 hover:text-green-primary'
      }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </Link>
)

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { account, disconnect } = useWeb3()

  const handleDisconnect = () => {
    disconnect()
    navigate('/')
  }

  const menuItems = [
    { icon: HomeIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: BuildingOfficeIcon, label: 'Companies', path: '/companies' },
    { icon: DocumentCheckIcon, label: 'Reports', path: '/reports' },
    { icon: ShoppingBagIcon, label: 'Marketplace', path: '/marketplace' },
    { icon: ChartBarIcon, label: 'Sustainability', path: '/sustainability' },
    { icon: DocumentTextIcon, label: 'Transaction History', path: '/transactions' },
    { icon: ClockIcon, label: 'History', path: '/history' },
    { icon: UserCircleIcon, label: 'Profile', path: '/profile' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={appLogo} alt="Green Token" className="h-8 w-8" />
          <span className="text-xl font-display font-bold text-green-primary">Green Token</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            to={item.path}
            active={location.pathname === item.path}
          />
        ))}
      </div>

      {/* Connected Account */}
      <div className="p-6 border-t border-gray-100">
        {account ? (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Connected Wallet</p>
            <p className="text-sm font-medium text-gray-700 truncate">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
        ) : (
          <div className="bg-red-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-red-500 mb-1">Not Connected</p>
            <p className="text-sm font-medium text-red-700">Please connect wallet</p>
          </div>
        )}

        <button 
          onClick={handleDisconnect}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Disconnect</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar 