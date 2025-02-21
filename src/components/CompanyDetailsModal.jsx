import React from 'react'
import { XMarkIcon, BuildingOfficeIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, IdentificationIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const CompanyDetailsModal = ({ company, onClose }) => {
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-green-light rounded-lg">
        <Icon className="w-5 h-5 text-green-primary" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium mt-0.5">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-800">Company Details</h2>
              <p className="text-gray-500 mt-1">Review company information before verification</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Company Status Banner */}
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                Pending Verification
              </span>
              <span className="text-sm text-yellow-700">
                Registered on {new Date(company.registrationDate).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">
              Wallet: {company.companyWallet.slice(0, 6)}...{company.companyWallet.slice(-4)}
            </p>
          </div>
        </div>

        {/* Company Information */}
        <div className="p-6 space-y-2">
          <InfoRow
            icon={BuildingOfficeIcon}
            label="Company Name"
            value={company.companyName}
          />
          <InfoRow
            icon={IdentificationIcon}
            label="Company Type"
            value={company.companyType}
          />
          <InfoRow
            icon={GlobeAltIcon}
            label="Registration Number"
            value={company.registrationNumber}
          />
          <InfoRow
            icon={MapPinIcon}
            label="Location"
            value={`${company.city}, ${company.country}`}
          />
          <InfoRow
            icon={BuildingOfficeIcon}
            label="Physical Address"
            value={company.physicalAddress}
          />
          <InfoRow
            icon={EnvelopeIcon}
            label="Contact Email"
            value={company.contactEmail}
          />
          <InfoRow
            icon={PhoneIcon}
            label="Contact Number"
            value={company.contactNumber}
          />
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Handle verify action
                onClose()
              }}
              className="px-6 py-2 bg-green-primary text-white rounded-xl hover:bg-green-secondary font-medium transition-all duration-200"
            >
              Verify Company
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsModal 