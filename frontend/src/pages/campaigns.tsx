import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Calendar, Users, Trophy, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  banner: string;
  startTime: Date;
  endTime: Date;
  totalVotes: number;
  isActive: boolean;
  contestantCount: number;
  category: string;
}

const CampaignsPage = () => {
  const { connected } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');

  // Mock data for now - will be replaced with actual Solana program calls
  useEffect(() => {
    setTimeout(() => {
      setCampaigns([
        {
          id: 'bb-naija-2024',
          title: 'Big Brother Naija 2024',
          description: 'Vote for your favorite housemate in the ultimate reality TV experience. Your voice matters in this social experiment.',
          banner: 'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&h=400&fit=crop',
          startTime: new Date('2024-01-01'),
          endTime: new Date('2024-12-31'),
          totalVotes: 15420,
          isActive: true,
          contestantCount: 12,
          category: 'Reality TV'
        },
        {
          id: 'survivor-legends',
          title: 'Survivor: Legends',
          description: 'Support your favorite castaway in the ultimate test of strategy, strength, and survival skills.',
          banner: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
          startTime: new Date('2024-02-01'),
          endTime: new Date('2024-06-30'),
          totalVotes: 8930,
          isActive: true,
          contestantCount: 16,
          category: 'Competition'
        },
        {
          id: 'the-circle-influencers',
          title: 'The Circle: Influencers',
          description: 'Choose the ultimate influencer in this digital age game of strategy and social manipulation.',
          banner: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
          startTime: new Date('2024-03-15'),
          endTime: new Date('2024-05-15'),
          totalVotes: 12650,
          isActive: true,
          contestantCount: 8,
          category: 'Social Strategy'
        },
        {
          id: 'dancing-stars',
          title: 'Dancing with the Stars',
          description: 'Vote for your favorite celebrity and professional dancer duo in this spectacular competition.',
          banner: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=400&fit=crop',
          startTime: new Date('2024-01-15'),
          endTime: new Date('2024-01-30'),
          totalVotes: 45320,
          isActive: false,
          contestantCount: 10,
          category: 'Entertainment'
        },
        {
          id: 'masterchef-finale',
          title: 'MasterChef Season Finale',
          description: 'Support your favorite home cook in the final battle for the MasterChef title.',
          banner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
          startTime: new Date('2024-04-01'),
          endTime: new Date('2024-04-15'),
          totalVotes: 0,
          isActive: false,
          contestantCount: 3,
          category: 'Cooking'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const now = new Date();
    switch (filter) {
      case 'active':
        return campaign.isActive && campaign.endTime > now;
      case 'upcoming':
        return campaign.startTime > now;
      case 'ended':
        return campaign.endTime <= now;
      default:
        return true;
    }
  });

  const getStatusBadge = (campaign: Campaign) => {
    const now = new Date();
    if (campaign.startTime > now) {
      return <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">Upcoming</span>;
    } else if (campaign.isActive && campaign.endTime > now) {
      return <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Active</span>;
    } else {
      return <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">Ended</span>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Active Campaigns
          </h1>
          <p className="text-gray-300 text-lg lg:text-xl max-w-3xl">
            Discover and participate in exciting voting campaigns. Your voice matters in shaping entertainment.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {['all', 'active', 'upcoming', 'ended'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as typeof filter)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No campaigns found for the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group">
                {/* Campaign Banner */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={campaign.banner}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(campaign)}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {campaign.category}
                    </span>
                  </div>
                </div>

                {/* Campaign Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">
                        {campaign.totalVotes.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm">
                        {campaign.contestantCount} contestants
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">
                        {formatDate(campaign.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className="text-gray-300 text-sm">
                        {formatDate(campaign.endTime)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/campaign/${campaign.id}`}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View Campaign</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!connected && (
          <div className="mt-16 bg-slate-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Start Voting?
            </h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to participate in any of these exciting campaigns and make your voice heard.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Connect Wallet to Vote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;