import './globals.css';
import ErrorBoundary from '../components/ErrorBoundary';
import GlobalNewsletterSignup from '../components/GlobalNewsletterSignup';
import { LanguageProvider } from '../context/LanguageContext';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL('https://nepalisoch.com'),
  title: {
    default: 'NepaliSoch — Data-Driven Nepal Election Analysis',
    template: '%s | NepaliSoch',
  },
  description:
    'Interactive election simulator, seat projections, polling analysis, and data journalism for Nepal politics.',
  keywords: [
    'Nepal election',
    'election simulator',
    'Nepal politics',
    'vote projection',
    'polling analysis',
    'Nepali politics',
  ],
  authors: [{ name: 'NepaliSoch' }],
  creator: 'NepaliSoch',
  publisher: 'NepaliSoch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NepaliSoch',
    url: 'https://nepalisoch.com',
    title: 'NepaliSoch — Data-Driven Nepal Election Analysis',
    description:
      'Interactive election simulator, seat projections, polling analysis, and data journalism for Nepal politics.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'NepaliSoch' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NepaliSoch — Data-Driven Nepal Election Analysis',
    description:
      'Interactive election simulator, seat projections, polling analysis, and data journalism for Nepal politics.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Lora:wght@400;500;600;700;800&family=Libre+Baskerville:wght@400;700&family=Spectral:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ErrorBoundary>
          <LanguageProvider>
            {children}
            <GlobalNewsletterSignup />
          </LanguageProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
