import { Metadata } from 'next';
import CoinPageClient from '../CoinPageClient';

// This is a server component that's used for static generation
export async function generateStaticParams() {
  // Pre-render common multi-segment coin IDs
  const multiSegmentCoins = [
    ['usd', 'coin'],
    ['bitcoin', 'cash'],
    ['shiba', 'inu'],
    ['wrapped', 'bitcoin'],
    ['staked', 'ether'],
    ['binance', 'usd'],
    ['internet', 'computer'],
    ['ethereum', 'classic']
  ];
  return multiSegmentCoins.map((segments) => ({
    slug: segments,
  }));
}

export const metadata: Metadata = {
  title: 'Coin Details | CoinPrice',
  description: 'Detailed information about cryptocurrencies including price, market cap, and historical data.',
};

// This is the server component that Next.js uses for routing
export default function CoinPageWrapper({ params }: { params: { slug: string[] } }) {
  // Join the slug parts with hyphens to reconstruct the coin id
  const id = params.slug.join('-');
  return <CoinPageClient id={id} />;
} 