import Link from 'next/link';
import Header from '@/components/Header';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="relative">
        <Header />
        
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 pt-8 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 