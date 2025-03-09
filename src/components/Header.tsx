'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';
import CoinSearch from './CoinSearch';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
}

const Header = () => {
  const router = useRouter();

  const handleCoinSelect = (coin: Coin) => {
    router.push(`/coin/${coin.id}`);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Logo />
            <Navigation />
          </div>
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="w-64 md:w-80">
              <CoinSearch onSelect={handleCoinSelect} />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 