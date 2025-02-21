import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI, INFURA_RPC } from '../config/web3Config'

const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const initializeWeb3 = async () => {
      // Initialize read-only provider
      const infuraProvider = new ethers.JsonRpcProvider(INFURA_RPC)
      const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, infuraProvider)
      setProvider(infuraProvider)
      setContract(readOnlyContract)
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

        return address
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  const registerCompany = async (companyData) => {
    try {
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
      
      await tx.wait()
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
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) throw new Error('useWeb3 must be used within a Web3Provider')
  return context
} 