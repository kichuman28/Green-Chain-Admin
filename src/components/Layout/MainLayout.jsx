import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <TopBar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout 