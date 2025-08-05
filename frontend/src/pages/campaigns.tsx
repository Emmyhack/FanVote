import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Calendar, Users, Trophy, Clock, Eye, Search, Star } from 'lucide-react';
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
  rating: number;
  viewers: string;
  featured: boolean;
}

const CampaignsPage = () => {
  const { connected } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'ending'>('popular');

  // Enhanced mock data with more details
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
          category: 'Reality TV',
          rating: 4.8,
          viewers: '2.5M',
          featured: true
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
          category: 'Competition',
          rating: 4.9,
          viewers: '1.8M',
          featured: true
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
          category: 'Social Strategy',
          rating: 4.7,
          viewers: '1.2M',
          featured: false
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
          category: 'Entertainment',
          rating: 4.6,
          viewers: '3.1M',
          featured: false
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
          category: 'Cooking',
          rating: 4.8,
          viewers: '1.5M',
          featured: false
        },
        {
          id: 'voice-competition',
          title: 'The Voice: Season Finale',
          description: 'Vote for the most talented vocalist in this epic singing competition finale.',
          banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
          startTime: new Date('2024-05-01'),
          endTime: new Date('2024-05-10'),
          totalVotes: 28750,
          isActive: true,
          contestantCount: 4,
          category: 'Music',
          rating: 4.9,
          viewers: '2.8M',
          featured: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const now = new Date();
      switch (filter) {
        case 'active':
          return campaign.isActive && campaign.endTime > now && matchesSearch;
        case 'upcoming':
          return campaign.startTime > now && matchesSearch;
        case 'ended':
          return campaign.endTime <= now && matchesSearch;
        case 'featured':
          return campaign.featured && matchesSearch;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.totalVotes - a.totalVotes;
        case 'newest':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'ending':
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        default:
          return 0;
      }
    });

  const getStatusBadge = (campaign: Campaign) => {
    const now = new Date();
    if (campaign.startTime > now) {
      return <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Upcoming</span>;
    } else if (campaign.isActive && campaign.endTime > now) {
      return <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Active</span>;
    } else {
      return <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Ended</span>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading campaigns...</div>
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
              Active Campaigns
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl max-w-3xl mx-auto">
              Discover and participate in exciting voting campaigns. Your voice matters in shaping entertainment.
            </p>
          </div>

          {/* Enhanced Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="ending">Ending Soon</option>
              </select>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { key: 'all', label: 'All Campaigns' },
                { key: 'featured', label: 'Featured' },
                { key: 'active', label: 'Active' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'ended', label: 'Ended' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as typeof filter)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filter === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Campaigns Grid */}
        {filteredAndSortedCampaigns.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-400 text-xl mb-4">No campaigns found</p>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-slate-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20 border border-slate-700 hover:border-slate-600 group">
                {/* Enhanced Campaign Banner */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={campaign.banner}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Status and Featured Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {getStatusBadge(campaign)}
                    {campaign.featured && (
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {campaign.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black bg-opacity-60 px-2 py-1 rounded">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">{campaign.rating}</span>
                  </div>
                </div>

                {/* Enhanced Campaign Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  {/* Enhanced Stats */}
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
                        {getDaysRemaining(campaign.endTime)} days left
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Action Button */}
                  <Link href={`/campaign/${campaign.id}`}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1">
                      <Eye className="w-4 h-4" />
                      <span>View Campaign</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Call to Action */}
        {!connected && (
          <div className="mt-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Start Voting?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Connect your wallet to participate in any of these exciting campaigns and make your voice heard. 
              Join thousands of voters already making a difference.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1">
              Connect Wallet to Vote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;