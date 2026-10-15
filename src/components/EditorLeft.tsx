import React, { useRef, useState } from 'react';
import { Copy, Trash2, Clipboard, Sparkles, Check, AlertCircle } from 'lucide-react';
import { GrammarIssue, TextStats } from '../types';
import { TextStatsBar } from './TextStatsBar';

interface EditorLeftProps {
  value: string;
  onChange: (val: string) => void;
  stats: TextStats;
  issues: GrammarIssue[];
  onApplyIssue: (issue: GrammarIssue) => void;
  onIgnoreIssue: (issueId: string) => void;
  isGrammarMode: boolean;
  placeholder?: string;
  onPasteSample: () => void;
}

export const EditorLeft: React.FC<EditorLeftProps> = ({
  value,
  onChange,
  stats,
  issues,
  onApplyIssue,
  onIgnoreIssue,
  isGrammarMode,
  placeholder = 'Type, paste (Ctrl+V), or load a sample text to begin writing and paraphrasing...',
  onPasteSample,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeIssue, setActiveIssue] = useState<GrammarIssue | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(value ? `${value}\n${text}` : text);
      }
    } catch {
      // clipboard permission might be denied
    }
  };

  const handleClear = () => {
    if (value.length > 50 && !window.confirm('Clear all input text?')) {
      return;
    }
    onChange('');
    setActiveIssue(null);
    setPopoverPos(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 relative min-h-[420px] lg:min-h-[580px]">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50/30 dark:bg-neutral-900/40">
        <div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
          <span>Input Text</span>
          {issues.length > 0 && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono ml-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {issues.length} {issues.length === 1 ? 'suggestion' : 'suggestions'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPasteSample}
            className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
            title="Insert demo sample text"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sample</span>
          </button>

          <button
            onClick={handlePaste}
            className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center gap-1"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!value}
            className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 inline-flex items-center gap-1"
            title="Copy text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleClear}
            disabled={!value}
            className="px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-40 inline-flex items-center gap-1"
            title="Clear text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Textarea Canvas */}
      <div className="flex-1 relative p-4 flex flex-col">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className="w-full flex-1 resize-none bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none text-base leading-relaxed font-normal selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300"
        />

        {/* Floating Quick Issue Popover if clicked */}
        {activeIssue && popoverPos && (
          <div
            className="absolute z-40 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-xl shadow-xl p-3 w-72 text-left"
            style={{ top: `${popoverPos.y}px`, left: `${popoverPos.x}px` }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {activeIssue.category}
              </span>
              <button
                onClick={() => {
                  setActiveIssue(null);
                  setPopoverPos(null);
                }}
                className="text-neutral-400 hover:text-neutral-600 text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 font-normal leading-relaxed">
              {activeIssue.explanation}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onApplyIssue(activeIssue);
                  setActiveIssue(null);
                  setPopoverPos(null);
                }}
                className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors text-center"
              >
                Replace with &ldquo;{activeIssue.replacement}&rdquo;
              </button>
              <button
                onClick={() => {
                  onIgnoreIssue(activeIssue.id);
                  setActiveIssue(null);
                  setPopoverPos(null);
                }}
                className="py-1.5 px-2.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                Ignore
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Text Stats */}
      <TextStatsBar stats={stats} />
    </div>
  );
};
