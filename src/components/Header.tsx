import React from 'react';
import { Feather, Sun, Moon, History, Cpu, FileText, ChevronDown } from 'lucide-react';
import { AppMode } from '../types';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samples';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onOpenApiSettings: () => void;
  onLoadSample: (sample: SamplePreset) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  isDarkMode,
  onToggleTheme,
  onOpenHistory,
  onOpenApiSettings,
  onLoadSample,
}) => {
  const [sampleDropdownOpen, setSampleDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSampleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Feather className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
            NovaText <span className="text-indigo-600 dark:text-indigo-400 font-normal">Write</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, 4 items) */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onSelectMode('paraphrase')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              currentMode === 'paraphrase'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            Paraphraser
          </button>
          <button
            onClick={() => onSelectMode('grammar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              currentMode === 'grammar'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            Grammar Checker
          </button>
          <button
            onClick={() => onSelectMode('summarize')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              currentMode === 'summarize'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            Summarizer
          </button>
          <button
            onClick={() => onSelectMode('plagiarism')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              currentMode === 'plagiarism'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            Originality Scanner
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sample Text Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setSampleDropdownOpen(!sampleDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors whitespace-nowrap"
              title="Load demo text"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Try Sample</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {sampleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 p-1.5 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-lg shadow-lg z-50 text-left">
                <div className="px-2 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Test Presets
                </div>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onLoadSample(preset);
                      setSampleDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                  >
                    <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Inference / Open-Source Models Button */}
          <button
            onClick={onOpenApiSettings}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title="Configure Open-Source AI Inference (Free HF / Local)"
          >
            <Cpu className="w-4 h-4" />
          </button>

          {/* Recent History Button */}
          <button
            onClick={onOpenHistory}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title="Recent History"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
