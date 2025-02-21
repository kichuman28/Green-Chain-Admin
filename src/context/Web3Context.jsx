import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI, INFURA_RPC } from '../config/web3Config'

const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(() => localStorage.getItem('account'))
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true')
  const [pendingCompanies, setPendingCompanies] = useState(() => {
    const stored = localStorage.getItem('pendingCompanies')
    return stored ? JSON.parse(stored) : []
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [eventListenersSet, setEventListenersSet] = useState(false)

  // Memoize the handleNewRegistration function
  const handleNewRegistration = useCallback((companyWallet, companyName, companyType, registrationNumber, country, city, physicalAddress, contactEmail, contactNumber, isVerified) => {
    const newCompany = {
      companyWallet,
      companyName,
      companyType,
      registrationNumber,
      country,
      city,
      physicalAddress,
      contactEmail,
      contactNumber,
      isVerified,
      registrationDate: new Date().toISOString(),
    }

    if (!isVerified) {
      setPendingCompanies(prev => [newCompany, ...prev])
    }
  }, [])

  // Initialize Web3 only once
  useEffect(() => {
    let isSubscribed = true

    const initializeWeb3 = async () => {
      try {
        const infuraProvider = new ethers.JsonRpcProvider(INFURA_RPC)
        const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, infuraProvider)
        
        if (isSubscribed) {
          setProvider(infuraProvider)
          setContract(readOnlyContract)
        }

        if (localStorage.getItem('account') && isSubscribed) {
          await connectWallet()
        }
      } catch (error) {
        console.error('Error initializing Web3:', error)
      }
    }

    initializeWeb3()

    return () => {
      isSubscribed = false
    }
  }, []) // Empty dependency array as this should only run once

  // Set up event listeners
  useEffect(() => {
    if (!contract) return

    let isSubscribed = true
    const filter = contract.filters.UserRegistered()
    const verifiedFilter = contract.filters.CompanyVerified()

    const handleUserRegistered = (...args) => {
      if (isSubscribed) {
        handleNewRegistration(...args)
      }
    }

    const handleCompanyVerified = (companyAddress) => {
      if (isSubscribed) {
        setPendingCompanies(prev => 
          prev.filter(company => 
            company.companyWallet.toLowerCase() !== companyAddress.toLowerCase()
          )
        )
      }
    }

    // Add event listeners
    contract.on(filter, handleUserRegistered)
    contract.on(verifiedFilter, handleCompanyVerified)

    // Fetch past events only once when contract is set
    const fetchPastEvents = async () => {
      try {
        const events = await contract.queryFilter(filter)
        const verifiedEvents = await contract.queryFilter(verifiedFilter)
        const verifiedAddresses = new Set(
          verifiedEvents.map(event => event.args[0].toLowerCase())
        )

        if (!isSubscribed) return

        const newPendingCompanies = []
        for (const event of events) {
          if (!isSubscribed) break

          const companyWallet = event.args[0].toLowerCase()
          if (!verifiedAddresses.has(companyWallet)) {
            const block = await event.getBlock()
            const registrationDate = new Date(Number(block.timestamp) * 1000).toISOString()

            newPendingCompanies.push({
              companyWallet,
              companyName: event.args[1],
              companyType: event.args[2],
              registrationNumber: event.args[3],
              country: event.args[4],
              city: event.args[5],
              physicalAddress: event.args[6],
              contactEmail: event.args[7],
              contactNumber: event.args[8],
              isVerified: false,
              registrationDate
            })
          }
        }

        if (isSubscribed) {
          setPendingCompanies(newPendingCompanies)
        }
      } catch (error) {
        console.error('Error fetching past events:', error)
      }
    }

    fetchPastEvents()

    return () => {
      isSubscribed = false
      contract.off(filter, handleUserRegistered)
      contract.off(verifiedFilter, handleCompanyVerified)
    }
  }, [contract, handleNewRegistration])

  // Handle account changes
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        await connectWallet()
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  // Save pendingCompanies to localStorage
  useEffect(() => {
    localStorage.setItem('pendingCompanies', JSON.stringify(pendingCompanies))
  }, [pendingCompanies])

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        // Create Web3 instances
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        const address = await signer.getAddress()
        
        // Check if connected account is admin (contract owner)
        const owner = await contract.owner()
        const isAdmin = owner.toLowerCase() === address.toLowerCase()

        setProvider(provider)
        setSigner(signer)
        setContract(contract)
        setAccount(address)
        setIsAdmin(isAdmin)

        // Store in localStorage
        localStorage.setItem('account', address)
        localStorage.setItem('isAdmin', isAdmin.toString())

        return address
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  const registerCompany = async (companyData) => {
    try {
      console.log('Registering company with data:', companyData)
      if (!contract || !signer) throw new Error('Please connect wallet first')
      
      const tx = await contract.registerUser(
        companyData.companyName,
        companyData.companyType,
        companyData.registrationNumber,
        companyData.country,
        companyData.city,
        companyData.physicalAddress,
        companyData.contactEmail,
        companyData.contactNumber
      )
      
      console.log('Registration transaction:', tx)
      await tx.wait()
      console.log('Transaction confirmed')
      return tx
    } catch (error) {
      console.error('Error registering company:', error)
      throw error
    }
  }

  const verifyCompany = async (companyAddress) => {
    try {
      if (isProcessing) return
      setIsProcessing(true)
      if (!contract || !signer) throw new Error('Please connect wallet first')
      if (!isAdmin) throw new Error('Only admin can verify companies')
      
      const tx = await contract.verifyCompany(companyAddress)
      await tx.wait()
      
      // Update pending companies immediately without waiting for event
      setPendingCompanies(prev => prev.filter(
        company => company.companyWallet.toLowerCase() !== companyAddress.toLowerCase()
      ))
      
      return tx
    } catch (error) {
      console.error('Error verifying company:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const mintTokens = async (to, amount, name) => {
    try {
      if (!contract || !signer) throw new Error('Please connect wallet first')
      if (!isAdmin) throw new Error('Only admin can mint tokens')
      
      const tx = await contract.mint(to, amount, name)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error minting tokens:', error)
      throw error
    }
  }

  const getCompanyDetails = async (address) => {
    try {
      if (!contract) throw new Error('Contract not initialized')
      
      const details = await contract.getRegisteredUser(address)
      return details
    } catch (error) {
      console.error('Error fetching company details:', error)
      throw error
    }
  }

  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setContract(null)
    setAccount(null)
    setIsAdmin(false)
    // Clear localStorage
    localStorage.removeItem('account')
    localStorage.removeItem('isAdmin')
  }

  const value = {
    provider,
    signer,
    contract,
    account,
    isAdmin,
    connectWallet,
    registerCompany,
    verifyCompany,
    mintTokens,
    getCompanyDetails,
    disconnect,
    pendingCompanies,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) throw new Error('useWeb3 must be used within a Web3Provider')
  return context
} 