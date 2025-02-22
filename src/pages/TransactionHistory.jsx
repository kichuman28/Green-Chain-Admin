import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { formatTokenAmount } from '../utils/formatters'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import TransactionHistoryModal from '../components/TransactionHistoryModal'

const TransactionHistory = () => {
  const { contract, account } = useWeb3()
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAddress, setSelectedAddress] = useState(null)

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        if (!contract || !account) return

        setIsLoading(true)
        
        // Get Transfer events where admin is either sender or receiver
        const sentFilter = contract.filters.Transfer(account, null)
        const receivedFilter = contract.filters.Transfer(null, account)

        const [sentEvents, receivedEvents] = await Promise.all([
          contract.queryFilter(sentFilter),
          contract.queryFilter(receivedFilter)
        ])

        // Process and combine the events
        const allTransactions = await Promise.all([
          ...sentEvents.map(async (event) => {
            const block = await event.getBlock()
            return {
              type: 'Sent',
              amount: event.args[2].toString(),
              from: event.args[0],
              to: event.args[1],
              timestamp: new Date(block.timestamp * 1000),
              hash: event.transactionHash,
              increase: false
            }
          }),
          ...receivedEvents.map(async (event) => {
            const block = await event.getBlock()
            return {
              type: 'Received',
              amount: event.args[2].toString(),
              from: event.args[0],
              to: event.args[1],
              timestamp: new Date(block.timestamp * 1000),
              hash: event.transactionHash,
              increase: true
            }
          })
        ])

        // Sort by timestamp, most recent first
        allTransactions.sort((a, b) => b.timestamp - a.timestamp)
        setTransactions(allTransactions)
      } catch (error) {
        console.error('Error fetching transaction history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionHistory()
  }, [contract, account])

  // Format address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(tx =>
    tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent">Transaction History</h1>
        <p className="text-gray-500 mt-1">View all your token transfer transactions</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address or transaction hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-2 focus:ring-green-primary/20 outline-none transition-all duration-200"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:border-green-primary hover:bg-green-50 transition-all duration-200">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Filter</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary mx-auto"></div>
            <p className="text-gray-500 font-medium mt-4">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((tx, index) => (
              <div key={tx.hash} className="p-4 sm:p-6 hover:bg-gray-50 transition-all duration-200 group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${tx.increase ? 'bg-green-light' : 'bg-red-100'} group-hover:scale-110 transition-transform duration-200`}>
                      {tx.increase ? (
                        <ArrowTrendingUpIcon className="w-5 h-5 text-green-primary" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-900">{tx.type}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatDate(tx.timestamp)}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="inline-flex items-center space-x-1">
                          <span>From:</span>
                          <span className="font-medium group-hover:text-green-primary transition-colors duration-200">{formatAddress(tx.from)}</span>
                          <span>→</span>
                          <span>To:</span>
                          <span className="font-medium group-hover:text-green-primary transition-colors duration-200">{formatAddress(tx.to)}</span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 font-mono">
                        Tx: {formatAddress(tx.hash)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-11 sm:ml-0">
                    <div className="text-right">
                      <div className={`font-medium ${tx.increase ? 'text-green-primary' : 'text-red-500'} text-lg`}>
                        {tx.increase ? '+' : '-'}{formatTokenAmount(tx.amount)}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAddress(tx.increase ? tx.from : tx.to)}
                      className="p-2 text-gray-500 hover:text-green-primary hover:bg-green-light rounded-lg transition-all duration-200 group-hover:scale-110"
                      title="View Transaction Details"
                    >
                      <InformationCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
              <InformationCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchTerm ? 'No transactions found matching your search' : 'No transactions found'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm ? 'Try adjusting your search terms' : 'Transactions will appear here once they are made'}
            </p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedAddress && (
        <TransactionHistoryModal
          address={selectedAddress}
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </div>
  )
}

export default TransactionHistory 