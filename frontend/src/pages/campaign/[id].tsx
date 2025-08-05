import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { Vote, Star, Trophy, Users, Timer, DollarSign } from 'lucide-react';
import Image from 'next/image';

interface Contestant {
  id: number;
  name: string;
  image: string;
  bio: string;
  voteCount: number;
  percentage: number;
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
}

const CampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { connected } = useWallet();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContestant, setSelectedContestant] = useState<number | null>(null);
  const [voteAmount, setVoteAmount] = useState<string>('1');

  // Mock data for now - will be replaced with actual Solana program calls
  useEffect(() => {
    if (id) {
      // Simulate loading campaign data
      setTimeout(() => {
        setCampaign({
          id: id as string,
          title: "Big Brother Naija 2024",
          description: "Vote for your favorite housemate and shape the game. Your votes matter in this ultimate social experiment.",
          banner: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=1200&h=400&fit=crop",
          startTime: new Date('2024-01-01'),
          endTime: new Date('2024-12-31'),
          totalVotes: 15420,
          isActive: true,
          contestants: [
            {
              id: 1,
              name: "Alex Johnson",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
              bio: "Strategic player with a heart of gold. Known for bringing people together.",
              voteCount: 5240,
              percentage: 34
            },
            {
              id: 2,
              name: "Maria Rodriguez",
              image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
              bio: "Fierce competitor and natural leader. Always fighting for what's right.",
              voteCount: 4680,
              percentage: 30
            },
            {
              id: 3,
              name: "James Wilson",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
              bio: "The entertainer of the house. Keeps everyone's spirits high.",
              voteCount: 3420,
              percentage: 22
            },
            {
              id: 4,
              name: "Sarah Chen",
              image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
              bio: "Intelligent strategist with a compassionate side. Master of alliances.",
              voteCount: 2080,
              percentage: 14
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

    try {
      // TODO: Implement actual Solana program call
      console.log(`Voting ${voteAmount} USDC for contestant ${selectedContestant}`);
      alert(`Vote submitted! ${voteAmount} USDC voted for ${campaign.contestants.find(c => c.id === selectedContestant)?.name}`);
      
      // Reset form
      setSelectedContestant(null);
      setVoteAmount('1');
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error submitting vote. Please try again.');
    }
  };

  const isVotingOpen = campaign?.isActive && campaign?.endTime > new Date();
  const timeRemaining = campaign ? Math.max(0, campaign.endTime.getTime() - new Date().getTime()) : 0;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Campaign not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Banner Section */}
      <div className="relative h-80 lg:h-96 overflow-hidden">
        <Image
          src={campaign.banner}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              {campaign.title}
            </h1>
            <p className="text-gray-200 text-lg lg:text-xl max-w-3xl">
              {campaign.description}
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{campaign.totalVotes.toLocaleString()}</div>
            <div className="text-gray-400">Total Votes</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{campaign.contestants.length}</div>
            <div className="text-gray-400">Contestants</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Timer className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{daysRemaining}</div>
            <div className="text-gray-400">Days Left</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${isVotingOpen ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <div className="text-2xl font-bold text-white">{isVotingOpen ? 'OPEN' : 'CLOSED'}</div>
            <div className="text-gray-400">Voting Status</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contestants */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Contestants</h2>
            <div className="space-y-4">
              {campaign.contestants.map((contestant) => (
                <div
                  key={contestant.id}
                  className={`bg-slate-800 rounded-lg p-6 border-2 transition-colors cursor-pointer ${
                    selectedContestant === contestant.id
                      ? 'border-blue-500 bg-slate-700'
                      : 'border-transparent hover:border-slate-600'
                  }`}
                  onClick={() => isVotingOpen ? setSelectedContestant(contestant.id) : null}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={contestant.image}
                        alt={contestant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{contestant.name}</h3>
                      <p className="text-gray-400 text-sm">{contestant.bio}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-blue-400 font-semibold">
                          {contestant.voteCount.toLocaleString()} votes
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          {contestant.percentage}%
                        </span>
                      </div>
                    </div>
                    {selectedContestant === contestant.id && (
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    )}
                  </div>
                  
                  {/* Vote percentage bar */}
                  <div className="mt-4 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${contestant.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voting Panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6">Cast Your Vote</h2>
              
              {!connected ? (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">Connect your wallet to vote</p>
                </div>
              ) : !isVotingOpen ? (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">Voting is currently closed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedContestant ? (
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Voting for:</p>
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
                    disabled={!selectedContestant || !voteAmount || parseFloat(voteAmount) <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Vote className="w-5 h-5" />
                    <span>Submit Vote</span>
                  </button>

                  <p className="text-gray-400 text-xs text-center">
                    A 5% platform fee will be applied to your vote
                  </p>
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