import React from 'react';
import { TextStats } from '../types';

interface TextStatsBarProps {
  stats: TextStats;
  className?: string;
}

export const TextStatsBar: React.FC<TextStatsBarProps> = ({ stats, className = '' }) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 font-normal px-4 py-2 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
          {stats.words}
        </span>
        <span>{stats.words === 1 ? 'word' : 'words'}</span>
      </div>

      <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>

      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
          {stats.characters}
        </span>
        <span>characters</span>
      </div>

      <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>

      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
          {stats.sentences}
        </span>
        <span>{stats.sentences === 1 ? 'sentence' : 'sentences'}</span>
      </div>

      <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>

      <div className="hidden sm:flex items-center gap-1.5">
        <span>Read time:</span>
        <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
          ~{stats.readingTimeMinutes} min
        </span>
      </div>

      <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700 hidden md:inline">·</span>

      <div className="hidden md:flex items-center gap-1.5">
        <span>Readability:</span>
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          {stats.readabilityGrade}
        </span>
        <span className="text-[11px] text-neutral-400 font-mono tabular-nums">
          ({stats.fleschScore}/100)
        </span>
      </div>
    </div>
  );
};
