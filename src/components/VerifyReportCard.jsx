import React, { useState, useEffect } from 'react';
import { verificationService } from '../services/VerificationService';
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
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner || report.verified) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Verify Report</h3>
      
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reward Amount (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
        >
          {isLoading ? 'Verifying...' : 'Verify & Send Reward'}
        </button>
      </div>
    </div>
  );
};

export default VerifyReportCard; 