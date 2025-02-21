import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const CompanyRegistrationModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    registrationNumber: '',
    country: '',
    city: '',
    physicalAddress: '',
    contactEmail: '',
    contactNumber: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-gray-800">Register Your Company</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Type
              </label>
              <input
                type="text"
                required
                value={formData.companyType}
                onChange={(e) => setFormData(prev => ({ ...prev, companyType: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="e.g., Energy Provider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="Enter registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physical Address
              </label>
              <input
                type="text"
                required
                value={formData.physicalAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, physicalAddress: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="Enter physical address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="Enter contact email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                required
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-primary focus:ring-1 focus:ring-green-primary outline-none"
                placeholder="Enter contact number"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-primary text-white rounded-xl hover:bg-green-secondary font-medium transition-all duration-200"
            >
              Register Company
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanyRegistrationModal 