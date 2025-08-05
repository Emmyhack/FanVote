import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Plus, Calendar, Image as ImageIcon, Users, Settings } from 'lucide-react';

const AdminPage = () => {
  const { connected } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bannerUrl: '',
    startDate: '',
    endDate: '',
    platformFee: '5'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      alert('Please connect your wallet to create a campaign');
      return;
    }

    setIsCreating(true);

    try {
      // TODO: Implement actual Solana program call to create campaign
      console.log('Creating campaign with data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Campaign created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        bannerUrl: '',
        startDate: '',
        endDate: '',
        platformFee: '5'
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 rounded-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">
            Connect your wallet to access the admin panel and create campaigns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Admin Panel
          </h1>
          <p className="text-gray-300 text-lg lg:text-xl max-w-3xl">
            Create and manage voting campaigns on the FanVote platform.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-gray-400">Active Campaigns</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">15,420</div>
            <div className="text-gray-400">Total Votes</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Settings className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$2,847</div>
            <div className="text-gray-400">Platform Fees (USDC)</div>
          </div>
        </div>

        {/* Create Campaign Form */}
        <div className="bg-slate-800 rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Plus className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Platform Fee (%) *
                </label>
                <input
                  type="number"
                  name="platformFee"
                  value={formData.platformFee}
                  onChange={handleInputChange}
                  min="0"
                  max="20"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter campaign description"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Banner Image URL *
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  name="bannerUrl"
                  value={formData.bannerUrl}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/banner.jpg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-700">
              <p className="text-gray-400 text-sm">
                * Required fields. Campaign will be deployed to Solana blockchain.
              </p>
              <button
                type="submit"
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Campaign</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Next Steps</h3>
          <ol className="text-gray-300 space-y-2">
            <li>1. Create your campaign using the form above</li>
            <li>2. Add contestants to your campaign (coming soon)</li>
            <li>3. Set up USDC token accounts for vote collection</li>
            <li>4. Activate voting and share with your audience</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;