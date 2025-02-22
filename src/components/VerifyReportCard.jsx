import React, { useState, useEffect } from 'react';
import { verificationService } from '../services/verificationService';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const VerifyReportCard = ({ report, onVerificationComplete }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkOwnerStatus();
  }, []);

  const checkOwnerStatus = async () => {
    try {
      const ownerStatus = await verificationService.isOwner();
      setIsOwner(ownerStatus);
    } catch (error) {
      console.error('Error checking owner status:', error);
    }
  };

  const handleVerify = async () => {
    if (!rewardAmount || isNaN(rewardAmount) || parseFloat(rewardAmount) <= 0) {
      toast.error('Please enter a valid reward amount');
      return;
    }

    setIsLoading(true);
    try {
      await verificationService.verifyAndRewardReport(report.id, rewardAmount);
      onVerificationComplete?.();
      toast.success('Report verified successfully!');
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner || report.verified) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Verify Report</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reward Amount (ETH)
          </label>
          <div className="relative rounded-lg shadow-sm">
            <input
              type="number"
              step="0.001"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              className="block w-full rounded-lg border-gray-200 pl-4 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="0.00"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400 sm:text-sm">ETH</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter the reward amount for this report verification
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm 
              ${isLoading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify & Send Reward'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyReportCard; 