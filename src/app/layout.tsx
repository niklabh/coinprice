import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeProvider";
import Script from "next/script";
import { DbInitializer } from "@/components/DbInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coinprice.pro";

export const metadata: Metadata = {
  title: "CoinPrice - Cryptocurrency Tracker",
  description: "Track real-time cryptocurrency prices, manage your portfolio, and stay updated with the latest market trends. Get detailed information on Bitcoin, Ethereum, and top altcoins.",
  keywords: ["cryptocurrency", "crypto tracker", "bitcoin price", "ethereum price", "portfolio tracker", "crypto market", "altcoins", "blockchain", "digital assets"],
  authors: [{ name: "CoinPrice Team" }],
  creator: "CoinPrice",
  publisher: "CoinPrice",
  applicationName: "CoinPrice",
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "CoinPrice - Real-time Cryptocurrency Tracker",
    description: "Track crypto prices, manage your portfolio, and analyze market trends with CoinPrice's intuitive dashboard",
    siteName: "CoinPrice",
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CoinPrice - Cryptocurrency Tracker Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoinPrice - Real-time Cryptocurrency Tracker",
    description: "Track crypto prices, manage your portfolio, and analyze market trends with CoinPrice's intuitive dashboard",
    images: [`${siteUrl}/images/og-image.png`],
    creator: "@coinprice",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            try {
              let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              let savedTheme = localStorage.getItem('theme');
              
              if (savedTheme === 'dark' || (!savedTheme && isDarkMode)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {
              console.error('Dark mode initialization failed:', e);
            }
          `}
        </Script>
        <Script id="spa-support" strategy="beforeInteractive">
          {`
            // Block problematic RSC requests
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
              if (typeof url === 'string' && 
                  url.includes('.txt') && 
                  url.includes('_rsc')) {
                return Promise.resolve(new Response(JSON.stringify({}), {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                }));
              }
              return originalFetch(url, options);
            };

            // Support SPA navigation
            (function() {
              // Handle initial navigation
              function handleInitialNavigation() {
                const path = window.location.pathname;
                
                // Check if this is a direct link to a dynamic route
                if (path !== '/' && !path.endsWith('.html')) {
                  // Store the path to be used by our client component
                  window.__initialPath = path;
                  
                  // For deep links like /coin/uniswap that would normally 404
                  if (path.startsWith('/coin/') || 
                      path.startsWith('/portfolio/') || 
                      path.startsWith('/trending/') || 
                      path.startsWith('/marketcapof/')) {
                        
                    console.log('SPA: Handling dynamic route', path);
                    
                    // Store the current URL to handle in our SPA
                    try {
                      window.sessionStorage.setItem('spa_navigation_path', path);
                    } catch (e) {
                      console.error('Failed to store navigation path:', e);
                    }
                  }
                }
              }
              
              // Call on initial load
              handleInitialNavigation();
            })();
          `}
        </Script>
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <DbInitializer>
            {children}
          </DbInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
