import React, { useState } from 'react'
import {
  BuildingOfficeIcon,
  CheckBadgeIcon,
  PlusCircleIcon,
  XMarkIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { useWeb3 } from '../context/Web3Context'
import { toast } from 'react-hot-toast'

const Companies = () => {
  const { pendingCompanies, verifyCompany } = useWeb3()
  const [activeTab, setActiveTab] = useState('All Companies')

  const handleVerifyCompany = async (companyWallet) => {
    try {
      await verifyCompany(companyWallet)
      toast.success('Company verified successfully')
    } catch (error) {
      console.error('Error verifying company:', error)
      toast.error('Failed to verify company')
    }
  }

  // Format date helper
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Companies</h1>
          <p className="text-gray-500 mt-1">Manage company registrations and token minting</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-primary text-white rounded-xl hover:bg-green-secondary transition-all duration-200 text-sm font-medium">
          <PlusCircleIcon className="w-5 h-5" />
          Register New Company
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Filter</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Companies', value: '156', change: '+12% this month' },
          { label: 'Pending Verification', value: pendingCompanies.length.toString(), change: `${pendingCompanies.length} new requests` },
          { label: 'Token Minting Requests', value: '8', change: '3 ready to mint' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-display font-bold mt-2">{stat.value}</p>
            <p className="text-sm text-green-primary mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            {['All Companies', 'Pending Verification', 'Token Requests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-green-primary border-b-2 border-green-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Companies List */}
        <div className="p-6">
          <div className="space-y-4">
            {activeTab === 'Pending Verification' ? (
              pendingCompanies.length > 0 ? (
                pendingCompanies.map((company, index) => (
                  <div
                    key={company.companyWallet}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-green-light transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-light rounded-lg">
                        <BuildingOfficeIcon className="w-6 h-6 text-green-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{company.companyName}</h4>
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{company.companyType}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered on {formatDate(company.registrationDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{company.country}</p>
                        <p className="text-xs text-gray-500">{company.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleVerifyCompany(company.companyWallet)}
                          className="p-2 text-green-primary hover:bg-green-light rounded-lg transition-all duration-200"
                          title="Verify Company"
                        >
                          <CheckBadgeIcon className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Reject Company"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pending verifications at the moment
                </div>
              )
            ) : activeTab === 'All Companies' ? (
              <div className="text-center py-8 text-gray-500">
                All companies will be shown here
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Token requests will be shown here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Companies 