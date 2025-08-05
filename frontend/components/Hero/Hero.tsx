import React from 'react';
import { PlayCircle, ArrowRight, Star, Users, Trophy } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-slate-900 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce">
          <Star className="w-6 h-6 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-1000">
          <Trophy className="w-8 h-8 text-blue-400 opacity-60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-2000">
          <Users className="w-6 h-6 text-green-400 opacity-60" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Enhanced Title with Animation */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Vote with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse">
              Trust
            </span>
            , Win with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 animate-pulse delay-500">
              Pride
            </span>
          </h1>
        </div>

        {/* Enhanced Description */}
        <p className="text-gray-300 text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
          Experience the future of entertainment voting with VoteStream. Secure, 
          transparent, and cross-chain. Your voice, amplified through blockchain technology.
        </p>

        {/* Enhanced Stats */}
        <div className="flex justify-center space-x-8 mb-12 text-gray-400 animate-fade-in-up delay-300">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm">50K+ Active Voters</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">100+ Campaigns</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-green-400" />
            <span className="text-sm">$2M+ Total Votes</span>
          </div>
        </div>

        {/* Enhanced Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up delay-500">
          <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !hover:from-blue-700 !hover:to-purple-700 !text-white !px-10 !py-4 !rounded-xl !font-semibold !text-lg !transition-all !duration-300 !flex !items-center !gap-3 !shadow-2xl !hover:shadow-blue-500/25 !transform !hover:-translate-y-1 !border-0" />
          
          <Link href="/campaigns">
            <button className="group bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 border border-slate-600 hover:border-slate-500 shadow-2xl hover:shadow-slate-500/25 transform hover:-translate-y-1">
              <PlayCircle size={24} className="group-hover:scale-110 transition-transform" />
              <span>Browse Shows</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Enhanced Call to Action */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6 max-w-2xl mx-auto animate-fade-in-up delay-700">
          <p className="text-gray-300 text-lg mb-4">
            🎉 Join the revolution in entertainment voting
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <span>✓ Secure Blockchain</span>
            <span>✓ Transparent Results</span>
            <span>✓ Instant Rewards</span>
          </div>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="mt-16 flex justify-center space-x-4 opacity-40">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
    </section>
  );
};

export default Hero;