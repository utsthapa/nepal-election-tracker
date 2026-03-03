'use client';

import { Share2, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { buildShareableUrl } from '../utils/stateSerializer';

export function ShareButton({ state, year = 2026 }) {
  const [status, setStatus] = useState('idle');

  const copyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      return copied;
    }
  };

  const handleShare = async () => {
    setStatus('saving');

    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state, year }),
      });

      let url = null;
      if (response.ok) {
        const payload = await response.json();
        url = payload?.url || null;
      }

      if (!url) {
        // Fallback to compact local URL when backend share is unavailable
        url = buildShareableUrl(state, year);
      }

      if (!url) {
        setStatus('idle');
        return;
      }

      const copied = await copyToClipboard(url);
      setStatus(copied ? 'copied' : 'idle');
      if (copied) {
        setTimeout(() => setStatus('idle'), 2000);
      }
    } catch {
      // Last-resort fallback
      const fallbackUrl = buildShareableUrl(state, year);
      if (!fallbackUrl) {
        setStatus('idle');
        return;
      }
      const copied = await copyToClipboard(fallbackUrl);
      setStatus(copied ? 'copied' : 'idle');
      if (copied) {
        setTimeout(() => setStatus('idle'), 2000);
      }
    }
  };

  const isSaving = status === 'saving';
  const isCopied = status === 'copied';

  return (
    <button
      onClick={handleShare}
      disabled={isSaving}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        isCopied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : isSaving
            ? 'bg-[rgb(219,211,196)]/20 text-[rgb(100,110,130)] cursor-wait'
            : 'bg-[rgb(219,211,196)]/30 hover:bg-[rgb(219,211,196)]/50 text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)]'
      }`}
    >
      {isCopied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : isSaving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
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
