import { Vote } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function SimpleHeader() {
  return (
    <header className="bg-surface/80 backdrop-blur-sm border-b border-neutral sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-gradient-to-br from-nc/20 to-uml/20 rounded-lg">
              <Vote className="w-8 h-8 text-white" />
            </Link>
            <div>
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-outfit font-bold text-white tracking-tight">
                  Nepal Election Simulator
                </h1>
              </Link>
              <p className="text-sm text-gray-400 font-mono">
                165 FPTP + 110 PR = 275 Seats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-neutral/60 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/simulator"
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-neutral/60 rounded-lg transition-colors"
              >
                Simulator
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default SimpleHeader;
