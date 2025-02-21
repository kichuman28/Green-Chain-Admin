import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI, INFURA_RPC } from '../config/web3Config'

const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(() => localStorage.getItem('account'))
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true')
  const [pendingCompanies, setPendingCompanies] = useState([])

  useEffect(() => {
    const initializeWeb3 = async () => {
      // Initialize read-only provider
      const infuraProvider = new ethers.JsonRpcProvider(INFURA_RPC)
      const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, infuraProvider)
      setProvider(infuraProvider)
      setContract(readOnlyContract)
      
      // Reconnect if account exists
      if (localStorage.getItem('account')) {
        connectWallet()
      }
    }

    initializeWeb3()
  }, [])

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
      if (!contract || !signer) throw new Error('Please connect wallet first')
      if (!isAdmin) throw new Error('Only admin can verify companies')
      
      const tx = await contract.verifyCompany(companyAddress)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error verifying company:', error)
      throw error
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

  // Add listener for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect()
        } else {
          // User switched accounts, reconnect
          await connectWallet()
        }
      })
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', connectWallet)
      }
    }
  }, [])

  // Store pending companies in localStorage
  useEffect(() => {
    if (pendingCompanies.length > 0) {
      localStorage.setItem('pendingCompanies', JSON.stringify(pendingCompanies))
    }
  }, [pendingCompanies])

  // Initialize pendingCompanies from localStorage
  useEffect(() => {
    const storedCompanies = localStorage.getItem('pendingCompanies')
    if (storedCompanies) {
      setPendingCompanies(JSON.parse(storedCompanies))
    }
  }, [])

  // Function to handle new registration events
  const handleNewRegistration = (companyWallet, companyName, companyType, registrationNumber, country, city, physicalAddress, contactEmail, contactNumber, isVerified) => {
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

    setPendingCompanies(prev => [newCompany, ...prev])
  }

  // Set up event listener when contract is initialized
  useEffect(() => {
    if (contract) {
      // Listen for UserRegistered events
      const filter = contract.filters.UserRegistered()
      
      // Get past events
      const fetchPastEvents = async () => {
        try {
          const events = await contract.queryFilter(filter)
          console.log('Raw events:', events)
          // Process events sequentially
          const companies = []
          for (const event of events) {
            let registrationDate = new Date().toISOString()
            
            try {
              const block = await event.getBlock()
              registrationDate = new Date(Number(block.timestamp) * 1000).toISOString()
            } catch (error) {
              console.log('Error processing timestamp for event:', error)
            }
            
            companies.push({
              companyWallet: event.args[0],
              companyName: event.args[1],
              companyType: event.args[2],
              registrationNumber: event.args[3],
              country: event.args[4],
              city: event.args[5],
              physicalAddress: event.args[6],
              contactEmail: event.args[7],
              contactNumber: event.args[8],
              isVerified: event.args[9],
              registrationDate,
            })
          }
          console.log('Processed companies:', companies)
          setPendingCompanies(companies.filter(company => !company.isVerified))
        } catch (error) {
          console.error('Error fetching past events:', error)
        }
      }

      fetchPastEvents()

      // Listen for new events
      contract.on(filter, handleNewRegistration)

      // Cleanup
      return () => {
        contract.off(filter, handleNewRegistration)
      }
    }
  }, [contract])

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