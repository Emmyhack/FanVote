import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-slate-900 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-white text-xl font-semibold">VoteStream</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/campaigns" className="text-gray-300 hover:text-white transition-colors duration-200">
            Campaigns
          </Link>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">
            How it Works
          </a>
          <a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200">
            FAQ
          </a>
        </div>
        <div className="hidden md:block">
          <WalletMultiButton className="!bg-blue-600 !hover:bg-blue-700 !text-white !px-6 !py-2 !rounded-lg !font-medium !transition-colors !duration-200" />
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/campaigns" 
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Campaigns
            </Link>
            <a 
              href="#how-it-works" 
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </a>
            <a 
              href="#faq" 
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="mt-4">
              <WalletMultiButton className="!bg-blue-600 !hover:bg-blue-700 !text-white !px-6 !py-2 !rounded-lg !font-medium !transition-colors !duration-200 !w-full" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;