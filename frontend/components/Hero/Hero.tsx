import React from 'react';
import { PlayCircle } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-slate-900 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Vote with{' '}
          <span className="text-blue-400">Trust</span>
          , Win with{' '}
          <span className="text-blue-400">Pride</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
          Experience the future of entertainment voting with VoteStream. Secure, 
          transparent, and cross-chain. Your voice, amplified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <WalletMultiButton className="!bg-blue-600 !hover:bg-blue-700 !text-white !px-8 !py-4 !rounded-lg !font-semibold !text-lg !transition-all !duration-300 !flex !items-center !gap-3 !shadow-lg !hover:shadow-xl !transform !hover:-translate-y-1" />
          
          <Link href="/campaigns">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center gap-3 border border-slate-600 hover:border-slate-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <PlayCircle size={24} />
              Browse Shows
            </button>
          </Link>
        </div>

        <div className="mt-16 flex justify-center space-x-8 opacity-30">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};

export default Hero;