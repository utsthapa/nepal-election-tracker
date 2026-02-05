import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { LanguageProvider } from '../context/LanguageContext'

export const metadata = {
  title: 'Nepal Election Simulator',
  description: 'Interactive seat projection sandbox for Nepal: adjust FPTP, PR, alliances, and constituency overrides with instant feedback.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:wght@500;600;700&family=Outfit:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <LanguageProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
