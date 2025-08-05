import React, { useState } from 'react';
import { Menu, X, Home, Users, Settings, Star } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/campaigns', label: 'Campaigns', icon: Users },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-blue-600 fill-current" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-white text-xl font-bold">VoteStream</span>
              <div className="text-xs text-gray-400">Blockchain Voting</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Wallet Button */}
          <div className="hidden md:block">
            <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !hover:from-blue-700 !hover:to-purple-700 !text-white !px-6 !py-3 !rounded-xl !font-semibold !transition-all !duration-300 !flex !items-center !gap-2 !shadow-lg !hover:shadow-blue-500/25 !transform !hover:-translate-y-1 !border-0" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-6 border-t border-slate-800">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Wallet Button */}
              <div className="pt-4 border-t border-slate-800">
                <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !hover:from-blue-700 !hover:to-purple-700 !text-white !px-6 !py-3 !rounded-xl !font-semibold !transition-all !duration-300 !flex !items-center !gap-2 !shadow-lg !hover:shadow-blue-500/25 !w-full !justify-center" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;