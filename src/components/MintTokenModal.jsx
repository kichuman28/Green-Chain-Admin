import React, { useState } from 'react'
import { XMarkIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET

const MintTokenModal = ({ company, onClose, onMint }) => {
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    description: '',
    evidence: null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true)
      
      // Create form data for Pinata
      const formData = new FormData()
      formData.append('file', file)

      // Upload to Pinata
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      })

      const ipfsUrl = `ipfs://${response.data.IpfsHash}`
      setUploadedUrl(ipfsUrl)
      setFormData(prev => ({
        ...prev,
        evidence: ipfsUrl
      }))
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      alert('Failed to upload file to IPFS. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!formData.evidence) {
        alert('Please upload evidence document first')
        return
      }
      await onMint(company.companyWallet, formData)
      onClose()
    } catch (error) {
      console.error('Error transferring tokens:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    
    if (name === 'evidenceFile' && files?.length > 0) {
      handleFileUpload(files[0])
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Transfer Tokens to {company.companyName}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token Amount to Transfer
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-primary focus:border-green-primary"
              required
              min="1"
              placeholder="Enter amount of tokens to transfer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-primary focus:border-green-primary"
              required
              placeholder="Enter a name for this transaction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-primary focus:border-green-primary"
              required
              rows="3"
              placeholder="Enter transaction description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-primary hover:text-green-secondary">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name="evidenceFile"
                      className="sr-only"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </div>
                {isUploading && <p className="text-xs text-gray-500">Uploading...</p>}
                {uploadedUrl && <p className="text-xs text-green-500">File uploaded successfully!</p>}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <p>• Tokens will be transferred from your account to {company.companyName}</p>
            <p>• Evidence document will be stored on IPFS</p>
            <p>• This transaction will be recorded permanently</p>
            <p>• Make sure you have sufficient balance</p>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !uploadedUrl}
              className={`px-4 py-2 bg-green-primary text-white rounded-lg ${
                isUploading || !uploadedUrl 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-green-secondary'
              }`}
            >
              Transfer Tokens
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MintTokenModal 