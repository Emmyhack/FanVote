import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { Vote, Star, Trophy, Users, Timer, DollarSign, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Contestant {
  id: number;
  name: string;
  image: string;
  bio: string;
  voteCount: number;
  percentage: number;
  rank: number;
  isEliminated: boolean;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  banner: string;
  startTime: Date;
  endTime: Date;
  totalVotes: number;
  isActive: boolean;
  contestants: Contestant[];
  category: string;
  viewers: string;
  rating: number;
  featured: boolean;
}

const CampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { connected } = useWallet();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContestant, setSelectedContestant] = useState<number | null>(null);
  const [voteAmount, setVoteAmount] = useState<string>('1');
  const [isVoting, setIsVoting] = useState(false);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);

  // Enhanced mock data with more details
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        setCampaign({
          id: id as string,
          title: "Big Brother Naija 2024",
          description: "Vote for your favorite housemate and shape the game. Your votes matter in this ultimate social experiment where every vote counts towards determining the winner.",
          banner: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=1200&h=400&fit=crop",
          startTime: new Date('2024-01-01'),
          endTime: new Date('2024-12-31'),
          totalVotes: 15420,
          isActive: true,
          category: "Reality TV",
          viewers: "2.5M",
          rating: 4.8,
          featured: true,
          contestants: [
            {
              id: 1,
              name: "Alex Johnson",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
              bio: "Strategic player with a heart of gold. Known for bringing people together and creating alliances that last.",
              voteCount: 5240,
              percentage: 34,
              rank: 1,
              isEliminated: false
            },
            {
              id: 2,
              name: "Maria Rodriguez",
              image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
              bio: "Fierce competitor and natural leader. Always fighting for what's right and inspiring others to do the same.",
              voteCount: 4680,
              percentage: 30,
              rank: 2,
              isEliminated: false
            },
            {
              id: 3,
              name: "James Wilson",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
              bio: "The entertainer of the house. Keeps everyone's spirits high with humor and positive energy.",
              voteCount: 3420,
              percentage: 22,
              rank: 3,
              isEliminated: false
            },
            {
              id: 4,
              name: "Sarah Chen",
              image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
              bio: "Intelligent strategist with a compassionate side. Master of alliances and social dynamics.",
              voteCount: 2080,
              percentage: 14,
              rank: 4,
              isEliminated: false
            }
          ]
        });
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleVote = async () => {
    if (!connected || !selectedContestant || !campaign) {
      alert('Please connect your wallet and select a contestant');
      return;
    }

    setIsVoting(true);

    try {
      // TODO: Implement actual Solana program call
      console.log(`Voting ${voteAmount} USDC for contestant ${selectedContestant}`);
      
      // Simulate voting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowVoteSuccess(true);
      setTimeout(() => setShowVoteSuccess(false), 3000);
      
      // Reset form
      setSelectedContestant(null);
      setVoteAmount('1');
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error submitting vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const isVotingOpen = campaign?.isActive && campaign?.endTime > new Date();
  const timeRemaining = campaign ? Math.max(0, campaign.endTime.getTime() - new Date().getTime()) : 0;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading campaign...</div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <div className="text-white text-xl mb-4">Campaign not found</div>
          <Link href="/campaigns">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Back to Campaigns
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Banner Section */}
      <div className="relative h-80 lg:h-96 overflow-hidden">
        <Image
          src={campaign.banner}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
            <div className="flex items-center gap-3 mb-4">
              {campaign.featured && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {campaign.category}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              {campaign.title}
            </h1>
            <p className="text-gray-200 text-lg lg:text-xl max-w-3xl">
              {campaign.description}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Campaign Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{campaign.totalVotes.toLocaleString()}</div>
            <div className="text-gray-400">Total Votes</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{campaign.contestants.length}</div>
            <div className="text-gray-400">Contestants</div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 text-center">
            <Timer className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{daysRemaining}d {hoursRemaining}h</div>
            <div className="text-gray-400">Time Left</div>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl p-6 text-center">
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${isVotingOpen ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <div className="text-2xl font-bold text-white">{isVotingOpen ? 'OPEN' : 'CLOSED'}</div>
            <div className="text-gray-400">Voting Status</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Contestants */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Contestants</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Eye className="w-4 h-4" />
                <span>{campaign.viewers} watching</span>
              </div>
            </div>
            <div className="space-y-4">
              {campaign.contestants.map((contestant) => (
                <div
                  key={contestant.id}
                  className={`bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    selectedContestant === contestant.id
                      ? 'border-blue-500 bg-slate-700 shadow-blue-500/20'
                      : 'border-transparent hover:border-slate-600'
                  } ${contestant.isEliminated ? 'opacity-50' : ''}`}
                  onClick={() => isVotingOpen && !contestant.isEliminated ? setSelectedContestant(contestant.id) : null}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank Badge */}
                    <div className="relative">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={contestant.image}
                          alt={contestant.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        #{contestant.rank}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{contestant.name}</h3>
                        {selectedContestant === contestant.id && (
                          <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{contestant.bio}</p>
                      <div className="flex items-center space-x-6">
                        <span className="text-blue-400 font-semibold">
                          {contestant.voteCount.toLocaleString()} votes
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          {contestant.percentage}%
                        </span>
                        {contestant.isEliminated && (
                          <span className="text-red-400 font-semibold text-sm">
                            Eliminated
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Vote percentage bar */}
                  <div className="mt-4 bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${contestant.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Voting Panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Cast Your Vote</h2>
              
              {!connected ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Vote className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-4">Connect your wallet to vote</p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                    Connect Wallet
                  </button>
                </div>
              ) : !isVotingOpen ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Timer className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-gray-400 mb-4">Voting is currently closed</p>
                  <p className="text-sm text-gray-500">Check back later for new campaigns</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedContestant ? (
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Voting for:</p>
                      <p className="text-white font-semibold">
                        {campaign.contestants.find(c => c.id === selectedContestant)?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-gray-400 text-center">Select a contestant above</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Vote Amount (USDC)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={voteAmount}
                        onChange={(e) => setVoteAmount(e.target.value)}
                        className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleVote}
                    disabled={!selectedContestant || !voteAmount || parseFloat(voteAmount) <= 0 || isVoting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
                  >
                    {isVoting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Vote className="w-5 h-5" />
                        <span>Submit Vote</span>
                      </>
                    )}
                  </button>

                  <div className="text-center space-y-2">
                    <p className="text-gray-400 text-xs">
                      A 5% platform fee will be applied to your vote
                    </p>
                    <div className="flex justify-center space-x-4 text-xs text-gray-500">
                      <span>✓ Secure</span>
                      <span>✓ Transparent</span>
                      <span>✓ Instant</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {showVoteSuccess && (
                <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-semibold">Vote submitted successfully!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;