'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

import { buildShareableUrl } from '../utils/stateSerializer';

export function ShareButton({ state }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = buildShareableUrl(state);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        copied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-[rgb(219,211,196)]/30 hover:bg-[rgb(219,211,196)]/50 text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)]'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share
        </>
      )}
    </button>
  );
}
