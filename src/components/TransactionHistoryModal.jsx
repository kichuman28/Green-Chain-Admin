import React, { useState, useEffect } from 'react';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useWeb3 } from '../context/Web3Context';

const TransactionHistoryModal = ({ address, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { contract } = useWeb3();

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const history = await contract.getUserDetails(address);
        // Convert BigInt values to regular numbers and format data
        const formattedHistory = history.map(tx => ({
          name: tx.name,
          companyName: tx.companyName,
          registrationNumber: tx.registrationNumber,
          mintedAmount: Number(tx.mintedAmount),
          timestamp: new Date(Number(tx.timestamp) * 1000),
          evidence: tx.evidence,
          description: tx.description
        }));
        setTransactions(formattedHistory);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchTransactionHistory();
    }
  }, [address, contract]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatIPFSUrl = (evidence) => {
    // Remove 'ipfs:' prefix if it exists and any leading/trailing slashes
    const cid = evidence.replace('ipfs:', '').replace(/^\/+|\/+$/g, '');
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-display font-bold">Transaction History</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transaction history found
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-xl p-4 hover:border-green-light transition-all duration-200"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-lg">{tx.name}</h4>
                      <p className="text-sm text-gray-500">{tx.companyName}</p>
                      <p className="text-sm text-gray-400">Reg: {tx.registrationNumber}</p>
                      <p className="text-sm font-medium text-green-primary mt-2">
                        {tx.mintedAmount} Tokens
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(tx.timestamp)}</p>
                      <div className="flex justify-end gap-2 mt-2">
                        {tx.evidence && (
                          <a
                            href={formatIPFSUrl(tx.evidence)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-light text-green-primary rounded-lg text-sm hover:bg-green-light/80 transition-colors"
                          >
                            <DocumentIcon className="w-4 h-4" />
                            View Document
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {tx.description && (
                    <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
                      {tx.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal; 