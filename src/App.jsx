import React, { useState } from 'react'
import MainLayout from './components/Layout/MainLayout'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'

function App() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectWallet = () => {
    // Wallet connection logic will go here
    setIsConnected(true)
  }

  if (!isConnected) {
    return <LandingPage onConnectWallet={handleConnectWallet} />
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  )
}

export default App
