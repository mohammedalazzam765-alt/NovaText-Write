import React from 'react';
import { ParaphraseTone, SynonymLevel } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface ToneSelectorProps {
  currentTone: ParaphraseTone;
  onSelectTone: (tone: ParaphraseTone) => void;
  synonymLevel: SynonymLevel;
  onSelectSynonymLevel: (level: SynonymLevel) => void;
  isProcessing: boolean;
}

const TONES: { id: ParaphraseTone; label: string; description: string }[] = [
  { id: 'standard', label: 'Standard', description: 'Reliable balance of natural rewording and clarity' },
  { id: 'fluency', label: 'Fluency', description: 'Smooth, native phrasing and flawless grammatical flow' },
  { id: 'formal', label: 'Formal', description: 'Elevated professional diction suited for corporate & executive writing' },
  { id: 'academic', label: 'Academic', description: 'Scholarly, rigorous phrasing with analytical tone' },
  { id: 'creative', label: 'Creative', description: 'Vivid expressions, sensory vocabulary, and varied rhythm' },
  { id: 'casual', label: 'Casual', description: 'Conversational, friendly, and approachable wording' },
  { id: 'shorten', label: 'Shorten', description: 'Concise syntax that strips filler words and redundancy' },
  { id: 'expand', label: 'Expand', description: 'Enriches sentences with explanatory context and nuances' },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  currentTone,
  onSelectTone,
  synonymLevel,
  onSelectSynonymLevel,
  isProcessing,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      {/* Tones scrollable bar */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1.5 shrink-0">
          Modes:
        </span>
        {TONES.map((tone) => {
          const isActive = currentTone === tone.id;
          return (
            <button
              key={tone.id}
              onClick={() => onSelectTone(tone.id)}
              disabled={isProcessing}
              title={tone.description}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              } disabled:opacity-50`}
            >
              {tone.label}
            </button>
          );
        })}
      </div>

      {/* Synonym Sensitivity Slider */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-xs text-neutral-600 dark:text-neutral-400">
        <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[11px] font-medium hidden sm:inline">Synonyms:</span>
        <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => onSelectSynonymLevel('few')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
              synonymLevel === 'few'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Few
          </button>
          <button
            onClick={() => onSelectSynonymLevel('balanced')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
              synonymLevel === 'balanced'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Balanced
          </button>
          <button
            onClick={() => onSelectSynonymLevel('more')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
              synonymLevel === 'more'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            More
          </button>
        </div>
      </div>
    </div>
  );
};
