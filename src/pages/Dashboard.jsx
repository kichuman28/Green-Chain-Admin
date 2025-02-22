import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { formatTokenAmount } from '../utils/formatters'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CircleStackIcon,
  DocumentCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Sample data for the chart
const chartData = [
  { name: 'Jan', tokens: 400 },
  { name: 'Feb', tokens: 300 },
  { name: 'Mar', tokens: 600 },
  { name: 'Apr', tokens: 800 },
  { name: 'May', tokens: 700 },
  { name: 'Jun', tokens: 900 },
  { name: 'Jul', tokens: 1000 },
]

const recentTransactions = [
  { type: 'Received', amount: '500 GT', from: '0x1234...5678', timestamp: '2 hours ago', increase: true },
  { type: 'Sent', amount: '200 GT', to: '0x8765...4321', timestamp: '5 hours ago', increase: false },
  { type: 'Minted', amount: '1000 GT', timestamp: '1 day ago', increase: true },
  { type: 'Verified', amount: 'Carbon Offset', timestamp: '2 days ago', increase: true },
]

const StatCard = ({ title, value, change, icon: Icon, color, isLoading }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-gray-500 text-sm font-medium tracking-wide">{title}</p>
        {isLoading ? (
          <div className="h-8 w-32 bg-gray-100 animate-pulse rounded mt-2"></div>
        ) : (
          <h3 className="text-2xl font-display font-bold mt-2 bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent">{value}</h3>
        )}
        <p className={`text-sm ${change >= 0 ? 'text-green-primary' : 'text-red-500'} flex items-center font-medium`}>
          {change >= 0 ? (
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
          )}
          {Math.abs(change)}% from last month
        </p>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 backdrop-blur-sm`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
)

const Dashboard = () => {
  const { contract, account } = useWeb3()
  const [adminBalance, setAdminBalance] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        if (contract && account) {
          const balance = await contract.balanceOf(account)
          const supply = await contract.totalSupply()
          setAdminBalance(balance)
          setTotalSupply(supply)
        }
      } catch (error) {
        console.error('Error fetching balances:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalances()
  }, [contract, account])

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Available Green Tokens"
          value={adminBalance ? formatTokenAmount(adminBalance) : '---'}
          change={12.5}
          icon={CircleStackIcon}
          color="bg-green-primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Supply"
          value={totalSupply ? formatTokenAmount(totalSupply) : '---'}
          change={0}
          icon={ArrowTrendingUpIcon}
          color="bg-green-secondary"
        />
        <StatCard
          title="Verified Projects"
          value="12"
          change={-3.8}
          icon={DocumentCheckIcon}
          color="bg-green-accent"
        />
        <StatCard
          title="Pending Verifications"
          value="3"
          change={0}
          icon={ClockIcon}
          color="bg-green-primary"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-display font-semibold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent">Token Activity</h2>
              <p className="text-sm text-gray-500 mt-1">
                Available Balance: {adminBalance ? formatTokenAmount(adminBalance) : '---'}
              </p>
            </div>
            <select className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-primary focus:border-green-primary">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059212" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059212" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#059212" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#tokenGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent">Recent Activity</h2>
            <div className="text-sm text-gray-500">
              Balance: {adminBalance ? formatTokenAmount(adminBalance) : '---'}
            </div>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${transaction.increase ? 'bg-green-light group-hover:bg-green-100' : 'bg-red-100 group-hover:bg-red-50'} transition-colors duration-200`}>
                    {transaction.increase ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-primary" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.type}</p>
                    <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                  </div>
                </div>
                <p className="font-medium text-sm">{transaction.amount}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-center text-green-primary hover:text-green-secondary font-medium text-sm transition-colors duration-200 rounded-lg hover:bg-green-50">
            View All Transactions
          </button>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-display font-semibold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent mb-6">Sustainability Goals</h2>
          <div className="space-y-6">
            {[
              { label: 'Carbon Reduction', progress: 75 },
              { label: 'Waste Management', progress: 60 },
              { label: 'Energy Efficiency', progress: 85 },
            ].map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{goal.label}</span>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-primary to-green-secondary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-display font-semibold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent mb-6">Upcoming Verifications</h2>
          <div className="space-y-4">
            {[
              { project: 'Solar Panel Installation', date: 'Aug 15, 2024', status: 'Pending' },
              { project: 'Waste Reduction Program', date: 'Aug 18, 2024', status: 'In Review' },
              { project: 'Tree Planting Initiative', date: 'Aug 20, 2024', status: 'Scheduled' },
            ].map((verification, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
                <div>
                  <p className="font-medium group-hover:text-green-primary transition-colors duration-200">{verification.project}</p>
                  <p className="text-sm text-gray-500">{verification.date}</p>
                </div>
                <span className="px-3 py-1 bg-green-light text-green-primary text-sm rounded-full font-medium group-hover:bg-green-primary group-hover:text-white transition-all duration-200">
                  {verification.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 