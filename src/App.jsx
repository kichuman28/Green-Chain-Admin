import React, { useState } from 'react'
import MainLayout from './components/Layout/MainLayout'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', function (accounts) {
          setWalletAddress(accounts[0])
        })
      } catch (error) {
        console.error('Error connecting to MetaMask:', error)
      }
    } else {
      alert('Please install MetaMask to use this feature')
    }
  }

  if (!isConnected) {
    return <LandingPage onConnectWallet={handleConnectWallet} walletAddress={walletAddress} />
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  )
}

export default App
