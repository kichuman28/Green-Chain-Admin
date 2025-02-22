import React, { useState, useEffect } from 'react';
import { verificationService } from '../services/VerificationService';
import Report from '../components/Report';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Reports');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Initialize verification service if needed
      if (!verificationService.contract) {
        await verificationService.initialize();
      }
      
      // Get visible reports using the verification service contract
      const visibleReports = await verificationService.contract.getVisibleReports();
      setReports(visibleReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports. Please make sure your wallet is connected.');
    } finally {
      setLoading(false);
    }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500 mt-1">Manage and verify sustainability reports</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Reports',
            value: reports.length.toString(),
            change: `${reports.length} total submissions`
          },
          {
            label: 'Pending Verification',
            value: reports.filter(r => !r.verified).length.toString(),
            change: 'Awaiting review'
          },
          {
            label: 'Verified Reports',
            value: reports.filter(r => r.verified).length.toString(),
            change: 'Successfully verified'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-display font-bold mt-2">{stat.value}</p>
            <p className="text-sm text-green-primary mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            {['All Reports', 'Pending Reports', 'Verified Reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-green-primary border-b-2 border-green-primary'
                    : 'text-gray-500 hover:text-gray-700'
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
              <Report
                key={report.id}
                report={report}
                onVerificationComplete={handleVerificationComplete}
              />
            ))}
            {filteredReports().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No reports found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 