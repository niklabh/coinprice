import '../app/globals.css';
import { ThemeProvider } from '@/lib/ThemeProvider';

// Simple _app.js wrapper for SPA mode
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
} 