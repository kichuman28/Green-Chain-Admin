import React from 'react'
import { useWeb3 } from '../context/Web3Context'
import {
  CircleStackIcon,
  ArrowTrendingUpIcon,
  DocumentCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const CompanyDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Company Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor your sustainability metrics and token balance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Token Balance</p>
              <h3 className="text-2xl font-display font-bold mt-2">5,000 GRN</h3>
              <p className="text-sm text-green-primary mt-2 flex items-center">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-primary bg-opacity-10">
              <CircleStackIcon className="w-6 h-6 text-green-primary" />
            </div>
          </div>
        </div>

        {/* Add more stat cards */}
      </div>

      {/* Add more sections like:
          - Token Transaction History
          - Sustainability Metrics
          - Verification Status
          - etc. */}
    </div>
  )
}

export default CompanyDashboard 