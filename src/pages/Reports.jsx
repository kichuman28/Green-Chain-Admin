import React, { useState, useEffect } from 'react';
import { verificationService } from '../services/VerificationService';
import Report from '../components/Report';
import toast from 'react-hot-toast';
import { 
  DocumentCheckIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Reports');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      if (!verificationService.contract) {
        await verificationService.initialize();
      }
      
      const visibleReports = await verificationService.contract.getVisibleReports();
      setReports(visibleReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports. Please make sure your wallet is connected.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const handleVerificationComplete = async () => {
    await fetchReports();
    toast.success('Report list updated');
  };

  const filteredReports = () => {
    switch (activeTab) {
      case 'Pending Reports':
        return reports.filter(report => !report.verified);
      case 'Verified Reports':
        return reports.filter(report => report.verified);
      default:
        return reports;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-gray-500 animate-pulse">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-8 shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Sustainability Reports
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Review and verify environmental impact reports
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-3 rounded-xl text-green-600 hover:bg-green-50 transition-all duration-200
            ${refreshing ? 'animate-spin' : 'hover:rotate-180 duration-500'}`}
          disabled={refreshing}
        >
          <ArrowPathIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Reports',
            value: reports.length.toString(),
            change: `${reports.length} total submissions`,
            icon: DocumentTextIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            label: 'Pending Verification',
            value: reports.filter(r => !r.verified).length.toString(),
            change: 'Awaiting review',
            icon: ClockIcon,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100'
          },
          {
            label: 'Verified Reports',
            value: reports.filter(r => r.verified).length.toString(),
            change: 'Successfully verified',
            icon: DocumentCheckIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          }
        ].map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-display font-bold mt-2">{stat.value}</p>
                <p className={`text-sm ${stat.color} mt-1 font-medium`}>{stat.change}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex p-2">
            {['All Reports', 'Pending Reports', 'Verified Reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-sm font-medium rounded-xl transition-all duration-200
                  ${activeTab === tab
                    ? 'text-green-600 bg-green-50 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="p-6">
          <div className="space-y-6">
            {filteredReports().map((report) => (
              <div 
                key={report.id}
                className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Report
                  report={report}
                  onVerificationComplete={handleVerificationComplete}
                />
              </div>
            ))}
            {filteredReports().length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reports found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {activeTab === 'Pending Reports' 
                    ? 'All reports have been verified!'
                    : activeTab === 'Verified Reports'
                    ? 'No reports have been verified yet.'
                    : 'No reports have been submitted yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 