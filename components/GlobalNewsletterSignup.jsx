'use client';

import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useLanguage } from '../context/LanguageContext';

export function GlobalNewsletterSignup() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || pathname?.startsWith('/newsletter')) {
    return null;
  }

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'global-widget' }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || (language === 'ne' ? 'त्रुटि भयो।' : 'Something went wrong.'));
        return;
      }
      setSubmitted(true);
      setEmail('');
    } catch {
      setError(language === 'ne' ? 'नेटवर्क त्रुटि भयो।' : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="fixed bottom-4 right-4 z-50 w-[92vw] max-w-sm rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-xl">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 rounded p-1 text-amber-800/70 hover:text-amber-900"
        aria-label={language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="pr-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          {language === 'ne' ? 'सदस्यता' : 'Newsletter'}
        </p>
        <p className="mb-3 text-sm font-semibold text-amber-900">
          {language === 'ne' ? 'अपडेटका लागि इमेल सदस्यता लिनुहोस्' : 'Subscribe for site updates'}
        </p>
      </div>

      {submitted ? (
        <p className="text-sm text-amber-900">
          {language === 'ne' ? 'धन्यवाद! तपाईं सदस्य हुनुभयो।' : 'Thanks, you are subscribed.'}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-2">
          <label htmlFor="global-newsletter-email" className="sr-only">
            {language === 'ne' ? 'इमेल' : 'Email'}
          </label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-amber-800" />
            <input
              id="global-newsletter-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={language === 'ne' ? 'you@example.com' : 'you@example.com'}
              className="w-full rounded border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded bg-amber-700 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? language === 'ne'
                ? 'सदस्यता...'
                : 'Subscribing...'
              : language === 'ne'
                ? 'सदस्यता लिनुहोस्'
                : 'Subscribe'}
          </button>
        </form>
      )}
    </aside>
  );
}

export default GlobalNewsletterSignup;
