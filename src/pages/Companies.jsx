import React, { useState, useEffect, useCallback } from 'react'
import {
  BuildingOfficeIcon,
  CheckBadgeIcon,
  PlusCircleIcon,
  XMarkIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { useWeb3 } from '../context/Web3Context'
import CompanyDetailsModal from '../components/CompanyDetailsModal'
import MintTokenModal from '../components/MintTokenModal'
import { toast } from 'react-hot-toast'

const Companies = () => {
  const { pendingCompanies, verifyCompany, contract, account } = useWeb3()
  const [activeTab, setActiveTab] = useState('All Companies')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [mintModalCompany, setMintModalCompany] = useState(null)
  const [verifiedCompanies, setVerifiedCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState(0)

  // Memoize the fetch function to prevent recreating it on every render
  const fetchVerifiedCompanies = useCallback(async (force = false) => {
    // Only fetch if it's been more than 30 seconds since the last fetch
    // or if force = true
    const now = Date.now()
    if (!force && now - lastFetchTime < 30000) {
      return;
    }

    try {
      setIsLoading(true)
      const events = await contract.queryFilter(contract.filters.CompanyVerified())
      // Get all registered companies from UserRegistered events
      const registrationEvents = await contract.queryFilter(contract.filters.UserRegistered())
      const verifiedAddresses = new Set(events.map(event => event.args[0].toLowerCase()))
      
      // Filter companies that are in the verified addresses set
      const companies = registrationEvents
        .filter(event => verifiedAddresses.has(event.args[0].toLowerCase()))
        .map(event => ({
          companyWallet: event.args[0],
          companyName: event.args[1],
          companyType: event.args[2],
          registrationNumber: event.args[3],
          country: event.args[4],
          city: event.args[5],
          physicalAddress: event.args[6],
          contactEmail: event.args[7],
          contactNumber: event.args[8],
          isVerified: true,
          registrationDate: new Date().toISOString(), // You might want to get this from block timestamp
        }))

      setVerifiedCompanies(companies)
      setLastFetchTime(now)
    } catch (error) {
      console.error('Error fetching verified companies:', error)
      toast.error('Failed to fetch verified companies')
    } finally {
      setIsLoading(false)
    }
  }, [contract, lastFetchTime])

  // Fetch verified companies when contract is available or tab changes to 'Verified Companies'
  useEffect(() => {
    if (contract && activeTab === 'Verified Companies') {
      fetchVerifiedCompanies()
    }
  }, [contract, activeTab, fetchVerifiedCompanies])

  const handleVerifyCompany = async (companyWallet) => {
    try {
      await verifyCompany(companyWallet)
      
      // Get company details from pending companies
      const company = pendingCompanies.find(c => 
        c.companyWallet.toLowerCase() === companyWallet.toLowerCase()
      )
      
      if (company) {
        setVerifiedCompanies(prev => [...prev, {
          ...company,
          isVerified: true
        }])
      }
      
      toast.success('Company verified successfully')
      setSelectedCompany(null)
      
      // Force refresh the verified companies list
      fetchVerifiedCompanies(true)
    } catch (error) {
      console.error('Error verifying company:', error)
      toast.error('Failed to verify company')
    }
  }

  const handleMintTokens = async (companyAddress, formData) => {
    try {
      // Convert amount to proper format and validate
      const amount = parseInt(formData.amount)
      
      if (amount <= 0) {
        toast.error('Amount must be greater than 0')
        return
      }

      // Get current balances
      const adminBalance = await contract.balanceOf(account)
      const companyBalance = await contract.balanceOf(companyAddress)
      
      console.log('Current admin balance:', adminBalance.toString())
      console.log('Current company balance:', companyBalance.toString())

      // Check if admin has enough tokens
      if (amount > adminBalance) {
        toast.error(`Insufficient balance. You only have ${adminBalance.toString()} tokens available.`)
        return
      }

      console.log('Transferring tokens:', {
        to: companyAddress,
        amount: amount,
        name: formData.name,
        evidence: formData.evidence,
        description: formData.description
      })

      // First do the token transfer
      const transferTx = await contract.transfer(companyAddress, amount)
      console.log('Transfer transaction sent:', transferTx.hash)
      await transferTx.wait()
      console.log('Transfer transaction confirmed')

      // Then call the reports function
      const reportsTx = await contract.reports(
        companyAddress,
        amount,
        formData.name,
        formData.evidence,
        formData.description
      )
      console.log('Reports transaction sent:', reportsTx.hash)
      await reportsTx.wait()
      console.log('Reports transaction confirmed')

      // Verify the new balances
      const newAdminBalance = await contract.balanceOf(account)
      const newCompanyBalance = await contract.balanceOf(companyAddress)

      console.log('New admin balance:', newAdminBalance.toString())
      console.log('New company balance:', newCompanyBalance.toString())
      
      // Calculate actual tokens transferred
      const tokensTransferred = newCompanyBalance - companyBalance
      console.log('Actual tokens transferred:', tokensTransferred.toString())

      toast.success(`Successfully transferred ${amount} tokens to ${mintModalCompany.companyName}`)
      setMintModalCompany(null)
    } catch (error) {
      console.error('Error in token transfer process:', error)
      toast.error('Failed to complete the transfer process')
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
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent">Companies</h1>
          <p className="text-gray-500 mt-1">Manage company registrations and token minting</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-primary to-green-secondary text-white rounded-xl hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
          <PlusCircleIcon className="w-5 h-5" />
          Register New Company
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-2 focus:ring-green-primary/20 outline-none transition-all duration-200"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:border-green-primary hover:bg-green-50 transition-all duration-200">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Companies', value: '156', change: '+12% this month', icon: UserGroupIcon },
          { label: 'Pending Verification', value: pendingCompanies.length.toString(), change: `${pendingCompanies.length} new requests`, icon: ClockIcon },
          { label: 'Token Minting Requests', value: '8', change: '3 ready to mint', icon: CurrencyDollarIcon },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-display font-bold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm text-green-primary">{stat.change}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-light bg-opacity-20">
                <stat.icon className="w-6 h-6 text-green-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex flex-wrap">
            {['All Companies', 'Pending Verification', 'Verified Companies', 'Token Requests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'text-green-primary border-b-2 border-green-primary bg-green-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Companies List */}
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {activeTab === 'Pending Verification' ? (
              pendingCompanies.length > 0 ? (
                pendingCompanies.map((company, index) => (
                  <div
                    key={company.companyWallet}
                    onClick={() => setSelectedCompany(company)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-gray-100 rounded-xl hover:border-green-primary hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-green-light rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <BuildingOfficeIcon className="w-6 h-6 text-green-primary" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-medium group-hover:text-green-primary transition-colors duration-200">{company.companyName}</h4>
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full font-medium">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{company.companyType}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered on {formatDate(company.registrationDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="text-right">
                        <p className="text-sm font-medium">{company.country}</p>
                        <p className="text-xs text-gray-500">{company.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyCompany(company.companyWallet);
                          }}
                          className="p-2 text-green-primary hover:bg-green-light rounded-lg transition-all duration-200 hover:scale-110"
                          title="Verify Company"
                        >
                          <CheckBadgeIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Reject Company"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                    <CheckBadgeIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No pending verifications at the moment</p>
                  <p className="text-sm text-gray-400 mt-1">All companies have been reviewed</p>
                </div>
              )
            ) : activeTab === 'Verified Companies' ? (
              isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto"></div>
                  <p className="text-gray-500 font-medium mt-4">Loading verified companies...</p>
                </div>
              ) : verifiedCompanies.length > 0 ? (
                verifiedCompanies.map((company) => (
                  <div
                    key={company.companyWallet}
                    onClick={() => setSelectedCompany(company)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-gray-100 rounded-xl hover:border-green-primary hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-green-light rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <BuildingOfficeIcon className="w-6 h-6 text-green-primary" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-medium group-hover:text-green-primary transition-colors duration-200">{company.companyName}</h4>
                          <span className="px-2 py-1 bg-green-light text-green-primary text-xs rounded-full font-medium">
                            Verified
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{company.companyType}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered on {formatDate(company.registrationDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="text-right">
                        <p className="text-sm font-medium">{company.country}</p>
                        <p className="text-xs text-gray-500">{company.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompany(company);
                          }}
                          className="p-2 text-green-primary hover:bg-green-light rounded-lg transition-all duration-200 hover:scale-110"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setMintModalCompany(company);
                          }}
                          className="p-2 text-green-primary hover:bg-green-light rounded-lg transition-all duration-200 hover:scale-110"
                          title="Mint Tokens"
                        >
                          <CurrencyDollarIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                    <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No verified companies yet</p>
                  <p className="text-sm text-gray-400 mt-1">Companies will appear here after verification</p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">{activeTab} will be shown here</p>
                <p className="text-sm text-gray-400 mt-1">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onVerify={handleVerifyCompany}
        />
      )}

      {mintModalCompany && (
        <MintTokenModal
          company={mintModalCompany}
          onClose={() => setMintModalCompany(null)}
          onMint={handleMintTokens}
        />
      )}
    </div>
  )
}

export default Companies 