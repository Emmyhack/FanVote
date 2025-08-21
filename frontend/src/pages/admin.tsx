import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Plus, Calendar, Image as ImageIcon, Users, Settings, TrendingUp, DollarSign, Activity, Star, Eye } from 'lucide-react';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import CivicSignInButton from '../../components/Auth/CivicSignInButton';

const AdminPage = () => {
  const { connected } = useWallet();
  const { gatewayStatus } = useGateway();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bannerUrl: '',
    startDate: '',
    endDate: '',
    platformFee: '5',
    category: 'Reality TV'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (gatewayStatus !== GatewayStatus.ACTIVE) {
      alert('Please verify with Civic to access admin features');
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
        platformFee: '5',
        category: 'Reality TV'
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
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-center max-w-md border border-slate-700">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">
            Connect your wallet to access the admin panel and create campaigns.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (gatewayStatus !== GatewayStatus.ACTIVE) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-center max-w-md border border-slate-700">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Civic Verification Required</h1>
          <p className="text-gray-400 mb-6">
            Please verify with Civic to access admin features.
          </p>
          <div className="flex justify-center">
            <CivicSignInButton size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Admin Panel
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl max-w-3xl mx-auto">
              Create and manage voting campaigns on the FanVote platform. Shape the future of entertainment voting.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-gray-400">Active Campaigns</div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 text-center">
            <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">15,420</div>
            <div className="text-gray-400">Total Votes</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6 text-center">
            <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$2,847</div>
            <div className="text-gray-400">Platform Fees (USDC)</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">+23%</div>
            <div className="text-gray-400">Growth Rate</div>
          </div>
        </div>

        {/* Enhanced Create Campaign Form */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="Reality TV">Reality TV</option>
                  <option value="Competition">Competition</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Music">Music</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Social Strategy">Social Strategy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Platform Fee (%) *
                </label>
                <input
                  type="number"
                  name="platformFee"
                  value={formData.platformFee}
                  onChange={handleInputChange}
                  min="0"
                  max="20"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="5"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Banner Image URL *
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="bannerUrl"
                    value={formData.bannerUrl}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="https://example.com/banner.jpg"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter campaign description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2 font-medium">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-700">
              <div className="text-gray-400 text-sm">
                <p>* Required fields. Campaign will be deployed to Solana blockchain.</p>
                <p className="mt-1">Ensure all information is accurate before submission.</p>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
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

        {/* Enhanced Instructions */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-400">Next Steps</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="text-gray-300 font-medium">Create your campaign</p>
                  <p className="text-gray-500 text-sm">Use the form above to set up your voting campaign</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="text-gray-300 font-medium">Add contestants</p>
                  <p className="text-gray-500 text-sm">Upload contestant profiles and information</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="text-gray-300 font-medium">Set up USDC accounts</p>
                  <p className="text-gray-500 text-sm">Configure token accounts for vote collection</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">4</div>
                <div>
                  <p className="text-gray-300 font-medium">Activate and share</p>
                  <p className="text-gray-500 text-sm">Launch voting and promote to your audience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Real-time Analytics</h4>
            <p className="text-gray-400 text-sm">Track voting patterns and engagement in real-time</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Transparent Results</h4>
            <p className="text-gray-400 text-sm">All votes are recorded on the blockchain for transparency</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Instant Payouts</h4>
            <p className="text-gray-400 text-sm">Automated USDC distributions to winners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;