import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  position: 'top-header' | 'sidebar';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position, className = '' }) => {
  if (position === 'top-header') {
    return (
      <div
        className={`w-full max-w-4xl mx-auto my-2 px-4 py-2 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 dark:from-neutral-900 dark:via-neutral-850 dark:to-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-lg flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 shadow-xs ${className}`}
        aria-label="Sponsorship notice"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            Ad
          </span>
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            NovaText Cloud Workspace — Unlimited collaborative documents & offline desktop apps
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400">
            Sponsored Writing Partner
          </span>
          <a
            href="#features"
            className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Learn More
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Sidebar / Right panel monetization slot
  return (
    <div
      className={`p-3.5 bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-xl flex flex-col gap-2 text-xs text-neutral-600 dark:text-neutral-400 ${className}`}
      aria-label="Monetization advertisement banner"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          Ad
        </span>
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">Sponsored</span>
      </div>

      <div className="flex items-start gap-2.5">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
            Academic Citation Generator
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
            Generate APA, MLA, and Chicago format references in seconds. Free forever.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Free Forever</span>
        <a
          href="#citation-tool"
          onClick={(e) => e.preventDefault()}
          className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
        >
          Explore Tool →
        </a>
      </div>
    </div>
  );
};
