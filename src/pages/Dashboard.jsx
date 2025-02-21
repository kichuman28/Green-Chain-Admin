import React from 'react'

const DashboardCard = ({ title, value, subtitle, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className={`text-2xl font-bold ${color} mt-2`}>{value}</p>
    <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
  </div>
)

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Green Token Balance"
          value="1,234 GT"
          subtitle="+ 123 this month"
          color="text-green-primary"
        />
        <DashboardCard
          title="Sustainability Score"
          value="85/100"
          subtitle="Top 10% performer"
          color="text-green-secondary"
        />
        <DashboardCard
          title="Pending Verifications"
          value="3"
          subtitle="2 in progress"
          color="text-green-accent"
        />
        <DashboardCard
          title="Carbon Offset"
          value="45.3 tons"  
          subtitle="This quarter"
          color="text-green-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {/* Transaction list will go here */}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Token Price History</h2>
          {/* Chart will go here */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 