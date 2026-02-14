import './globals.css'
import { LanguageProvider } from '../context/LanguageContext'

export const metadata = {
  title: 'NepaliSoch — Data-Driven Nepal Election Analysis',
  description: 'Interactive election simulator, seat projections, polling analysis, and data journalism for Nepal politics.',
}

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
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
