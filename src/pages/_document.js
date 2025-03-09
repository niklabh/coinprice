import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Detect and handle direct navigation to dynamic routes
                (function() {
                  const path = window.location.pathname;
                  
                  // If accessing a dynamic route directly, store the path for client-side handling
                  if (path.match(/^\\/coin\\/[\\w-]+$/) || 
                      path.match(/^\\/portfolio\\/[\\w-]+$/) ||
                      path.match(/^\\/marketcapof\\/[\\w-]+$/)) {
                    sessionStorage.setItem('spaNavigationPath', path);
                    // Only redirect if we're not already at the root
                    if (path !== '/') {
                      window.location.href = '/';
                    }
                  }

                  // Block RSC requests
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
                })();
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 