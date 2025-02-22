import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const MintTokenModal = ({ company, onClose, onMint }) => {
  const [formData, setFormData] = useState({
    amount: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onMint(company.companyWallet, formData)
      onClose()
    } catch (error) {
      console.error('Error transferring tokens:', error)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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

          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <p>• Tokens will be transferred from your account to {company.companyName}</p>
            <p>• Make sure you have sufficient balance</p>
            <p>• This action cannot be undone</p>
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
              className="px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary"
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