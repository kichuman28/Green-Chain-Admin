import { ethers } from 'ethers';
import { VERIFY_CONFIG } from '../config/verifyConfig';
import toast from 'react-hot-toast';

class VerificationService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.initialize();
  }

  async initialize() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      this.contract = new ethers.Contract(
        VERIFY_CONFIG.contractAddress,
        VERIFY_CONFIG.contractAbi,
        this.signer
      );
    } catch (error) {
      console.error('Failed to initialize verification service:', error);
      toast.error('Failed to connect to blockchain');
    }
  }

  async verifyAndRewardReport(reportId, rewardAmount) {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      // Convert reward to Wei
      const rewardInWei = ethers.parseEther(rewardAmount.toString());

      // Check contract balance
      const contractBalance = await this.provider.getBalance(
        VERIFY_CONFIG.contractAddress
      );

      if (contractBalance < rewardInWei) {
        throw new Error('Insufficient contract balance for reward');
      }

      // Send verification transaction
      const tx = await this.contract.verifyReport(reportId, rewardInWei, {
        value: rewardInWei
      });

      // Show pending toast
      toast.loading('Verifying report...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Check for ReportVerified event
      const verifiedEvent = receipt.logs.find(
        (log) => log.eventName === 'ReportVerified'
      );

      if (!verifiedEvent) {
        throw new Error('Verification failed - event not emitted');
      }

      toast.success('Report verified successfully!');

      return {
        success: true,
        transactionHash: receipt.hash,
        reportId: reportId,
        reward: rewardAmount
      };

    } catch (error) {
      console.error('Verification failed:', error);
      toast.error(`Verification failed: ${error.message}`);
      throw error;
    }
  }

  async isOwner() {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      const owner = await this.contract.owner();
      const currentAddress = await this.signer.getAddress();
      return owner.toLowerCase() === currentAddress.toLowerCase();
    } catch (error) {
      console.error('Error checking owner status:', error);
      return false;
    }
  }

  async getReportStatus(reportId) {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      const report = await this.contract.reports(reportId);
      return {
        isVerified: report.verified,
        reward: ethers.formatEther(report.reward),
        reporter: report.reporter
      };
    } catch (error) {
      console.error('Error getting report status:', error);
      throw error;
    }
  }
}

export const verificationService = new VerificationService(); 