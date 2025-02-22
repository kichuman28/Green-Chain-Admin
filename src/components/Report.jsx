import React from 'react';
import { 
  MapPinIcon, 
  CalendarIcon, 
  UserCircleIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header with Status Badge */}
        <div className="flex justify-between items-start mb-4">
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
            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-green-700">
                Reward: {report.reward} ETH
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 leading-6">{report.description}</h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="p-2 bg-gray-50 rounded-lg">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm font-medium">{report.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-500">
              <div className="p-2 bg-gray-50 rounded-lg">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Submitted On</p>
                <p className="text-sm font-medium">{formatDate(report.timestamp)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-500">
              <div className="p-2 bg-gray-50 rounded-lg">
                <UserCircleIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Reporter</p>
                <p className="text-sm font-medium">{report.reporter.slice(0, 6)}...{report.reporter.slice(-4)}</p>
              </div>
            </div>

            {report.evidencelink && (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <DocumentIcon className="w-5 h-5 text-gray-500" />
                </div>
                <a
                  href={formatIPFSUrl(report.evidencelink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  <span className="text-sm font-medium">View Evidence</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            )}
          </div>
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