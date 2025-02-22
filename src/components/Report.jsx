import React from 'react';
import { 
  MapPinIcon, 
  CalendarIcon, 
  UserCircleIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClockIcon
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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
      <div className="p-6">
        {/* Header with Status Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            {report.verified ? (
              <CheckCircleIcon className="w-6 h-6 text-green-primary" />
            ) : (
              <ClockIcon className="w-6 h-6 text-yellow-500" />
            )}
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                ${
                  report.verified
                    ? 'bg-green-light text-green-primary'
                    : 'bg-yellow-50 text-yellow-600'
                }`}
            >
              {report.verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
          {report.verified && (
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-green-primary">
                Reward: {report.reward} ETH
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-display font-semibold bg-gradient-to-r from-green-primary to-green-secondary bg-clip-text text-transparent leading-6">{report.description}</h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-green-light transition-colors duration-200">
                <MapPinIcon className="w-5 h-5 text-gray-500 group-hover:text-green-primary transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm font-medium group-hover:text-green-primary transition-colors duration-200">{report.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-green-light transition-colors duration-200">
                <CalendarIcon className="w-5 h-5 text-gray-500 group-hover:text-green-primary transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Submitted On</p>
                <p className="text-sm font-medium group-hover:text-green-primary transition-colors duration-200">{formatDate(report.timestamp)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-green-light transition-colors duration-200">
                <UserCircleIcon className="w-5 h-5 text-gray-500 group-hover:text-green-primary transition-colors duration-200" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Reporter</p>
                <p className="text-sm font-medium group-hover:text-green-primary transition-colors duration-200">{report.reporter.slice(0, 6)}...{report.reporter.slice(-4)}</p>
              </div>
            </div>

            {report.evidencelink && (
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-green-light transition-colors duration-200">
                  <DocumentIcon className="w-5 h-5 text-gray-500 group-hover:text-green-primary transition-colors duration-200" />
                </div>
                <a
                  href={formatIPFSUrl(report.evidencelink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-green-primary hover:text-green-secondary transition-colors duration-200"
                >
                  <span className="text-sm font-medium">View Evidence</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Verification Card */}
          <div className="pt-4">
            <VerifyReportCard
              report={report}
              onVerificationComplete={onVerificationComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report; 