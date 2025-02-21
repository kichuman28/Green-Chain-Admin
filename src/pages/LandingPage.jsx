import React from 'react'
import { ArrowRightIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useWeb3 } from '../context/Web3Context'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()
  const { connectWallet, account, isAdmin } = useWeb3()

  const handleConnectWallet = async () => {
    try {
      await connectWallet()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const handleAdminLogin = async () => {
    if (!account) {
      toast.error('Please connect your wallet first')
      return
    }
    
    if (!isAdmin) {
      toast.error('This wallet is not authorized as admin')
      return
    }
    
    toast.success('Successfully authenticated as admin')
    navigate('/dashboard')
  }

  const handleCompanyLogin = async () => {
    if (!account) {
      toast.error('Please connect your wallet first')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-b from-green-light/30 to-white font-body">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 max-w-[1440px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img className="h-12 w-auto" src="/logo.png" alt="Green Token" />
            <span className="ml-3 text-2xl font-display font-bold text-green-primary tracking-tight">Green Token</span>
          </div>
          {account ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-light/30 rounded-xl border border-green-primary/20">
              <span className="text-sm font-medium text-green-primary">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-green-primary text-white px-6 py-2.5 rounded-xl hover:bg-green-secondary transition-all transform hover:scale-105 duration-200 shadow-lg hover:shadow-green-primary/20 font-semibold text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-32 max-w-[1440px]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h1 className="font-display text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Empowering
              <span className="text-green-primary block mt-2"> Sustainable </span>
              Future Through Blockchain
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join the revolution of sustainable business practices with Green Token. Track, trade, and verify your environmental impact on the blockchain.
            </p>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAdminLogin}
                  className="flex items-center justify-center gap-2 bg-white border-2 border-green-primary text-green-primary px-8 py-4 rounded-xl hover:bg-green-light transition-all duration-200 shadow-xl hover:shadow-green-primary/10 text-lg font-semibold group"
                >
                  <ShieldCheckIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  Login as Admin
                </button>
                <button
                  onClick={handleCompanyLogin}
                  className="flex items-center justify-center gap-2 bg-green-primary text-white px-8 py-4 rounded-xl hover:bg-green-secondary transition-all transform hover:scale-105 duration-200 shadow-xl hover:shadow-green-primary/30 text-lg font-semibold group"
                >
                  <UserCircleIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  Login as Company
                </button>
              </div>
              {!account && (
                <p className="text-sm text-gray-500 text-center">
                  Please connect your wallet first to proceed with login
                </p>
              )}
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-primary/20 rounded-full blur-3xl"></div>
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-10">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: 'Active Companies', value: '500+' },
                  { label: 'Carbon Offset', value: '1.2M tons' },
                  { label: 'Green Tokens', value: '850K' },
                  { label: 'Projects Verified', value: '2.5K' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-6 bg-white rounded-xl shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
                    <p className="text-3xl font-display font-bold text-green-primary mb-2">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-32 w-full">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <h2 className="text-4xl font-display font-bold text-center mb-20">Why Choose Green Token?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Transparent Tracking',
                description: 'Monitor your environmental impact with blockchain-verified data and real-time analytics.',
              },
              {
                title: 'Token Trading',
                description: 'Trade environmental credits seamlessly in our decentralized marketplace.',
              },
              {
                title: 'Verified Impact',
                description: 'Get your sustainability initiatives verified by trusted authorities.',
              },
            ].map((feature) => (
              <div key={feature.title} 
                className="bg-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-12 h-12 bg-green-light rounded-lg mb-6"></div>
                <h3 className="text-xl font-display font-semibold text-green-primary mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage 