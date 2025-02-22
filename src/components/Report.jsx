import React from 'react';
import { MapPinIcon, CalendarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import VerifyReportCard from './VerifyReportCard';

const Report = ({ report, onVerificationComplete }) => {
  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatIPFSUrl = (evidencelink) => {
    // Remove 'ipfs://' prefix if it exists
    const cleanHash = evidencelink.replace('ipfs://', '');
    // Remove any leading/trailing slashes
    const hash = cleanHash.replace(/^\/+|\/+$/g, '');
    return `https://ipfs.io/ipfs/${hash}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{report.description}</h3>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {report.location}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {formatDate(report.timestamp)}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <UserCircleIcon className="w-4 h-4 mr-1" />
              {report.reporter.slice(0, 6)}...{report.reporter.slice(-4)}
            </div>
          </div>
        </div>

        {/* Evidence Link */}
        {report.evidencelink && (
          <div className="mt-4">
            <a
              href={formatIPFSUrl(report.evidencelink)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View Evidence →
            </a>
          </div>
        )}

        {/* Status Badge */}
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${
                report.verified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {report.verified ? 'Verified' : 'Pending Verification'}
          </span>
          {report.verified && (
            <span className="ml-2 text-sm text-gray-500">
              Reward: {report.reward} ETH
            </span>
          )}
        </div>

        {/* Verification Card */}
        <VerifyReportCard
          report={report}
          onVerificationComplete={onVerificationComplete}
        />
      </div>
    </div>
  );
};

export default Report; 