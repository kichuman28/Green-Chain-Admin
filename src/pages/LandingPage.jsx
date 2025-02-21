import React from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const LandingPage = ({ onConnectWallet }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-light/30 to-white font-body">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img className="h-12 w-auto" src="/logo.png" alt="Green Token" />
            <span className="ml-3 text-2xl font-display font-bold text-green-primary tracking-tight">Green Token</span>
          </div>
          <button
            onClick={onConnectWallet}
            className="bg-green-primary text-white px-8 py-3 rounded-xl hover:bg-green-secondary transition-all transform hover:scale-105 duration-200 shadow-lg hover:shadow-green-primary/20 font-semibold"
          >
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-32">
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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onConnectWallet}
                className="flex items-center justify-center gap-2 bg-green-primary text-white px-10 py-4 rounded-xl hover:bg-green-secondary transition-all transform hover:scale-105 duration-200 shadow-xl hover:shadow-green-primary/30 text-lg font-semibold"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button className="px-10 py-4 rounded-xl border-2 border-green-primary text-green-primary hover:bg-green-light transition-all duration-200 text-lg font-semibold hover:shadow-lg">
                Learn More
              </button>
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
      <div className="bg-white py-32">
        <div className="container mx-auto px-6">
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