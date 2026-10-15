import React, { useState } from 'react';
import { GrammarIssue, IssueCategory } from '../types';
import { CheckCheck, Check, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface GrammarPanelProps {
  issues: GrammarIssue[];
  onApplyIssue: (issue: GrammarIssue) => void;
  onApplyAllIssues: () => void;
  onIgnoreIssue: (id: string) => void;
}

export const GrammarPanel: React.FC<GrammarPanelProps> = ({
  issues,
  onApplyIssue,
  onApplyAllIssues,
  onIgnoreIssue,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('all');

  const filteredIssues = issues.filter((iss) => {
    if (selectedCategory === 'all') return true;
    return iss.category === selectedCategory;
  });

  const spellingCount = issues.filter((i) => i.category === 'spelling').length;
  const grammarCount = issues.filter((i) => i.category === 'grammar').length;
  const punctuationCount = issues.filter((i) => i.category === 'punctuation').length;
  const styleCount = issues.filter((i) => i.category === 'style').length;

  const score = Math.max(60, 100 - issues.length * 5);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 min-h-[420px] lg:min-h-[580px]">
      {/* Top Header & Filter Bar */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Grammar & Spell Check
              </h3>
              <span className="text-xs text-neutral-500 font-mono tabular-nums">
                ({issues.length} {issues.length === 1 ? 'issue' : 'issues'})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
              <span>Overall Clarity Score:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
                {score}/100
              </span>
            </div>
          </div>

          {issues.length > 0 && (
            <button
              onClick={onApplyAllIssues}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs whitespace-nowrap"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Fix All ({issues.length}) Errors
            </button>
          )}
        </div>

        {/* Interactive Filter Controls */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setSelectedCategory('spelling')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'spelling'
                ? 'bg-red-600 text-white'
                : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100'
            }`}
          >
            Spelling ({spellingCount})
          </button>
          <button
            onClick={() => setSelectedCategory('grammar')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'grammar'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
            }`}
          >
            Grammar ({grammarCount})
          </button>
          <button
            onClick={() => setSelectedCategory('punctuation')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'punctuation'
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100'
            }`}
          >
            Punctuation ({punctuationCount})
          </button>
          <button
            onClick={() => setSelectedCategory('style')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'style'
                ? 'bg-purple-600 text-white'
                : 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100'
            }`}
          >
            Wordiness ({styleCount})
          </button>
        </div>
      </div>

      {/* Issues List View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {issues.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Flawless Prose!
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mt-1 leading-relaxed">
              No spelling mistakes, grammatical errors, or awkward redundancies detected in the current text.
            </p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-xs text-neutral-400">
            No issues found in the selected category.
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isSpelling = issue.category === 'spelling';
            const isGrammar = issue.category === 'grammar';
            const isPunctuation = issue.category === 'punctuation';

            return (
              <div
                key={issue.id}
                className="p-3.5 bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200/90 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-semibold tracking-wider ${
                          isSpelling
                            ? 'text-red-600 dark:text-red-400'
                            : isGrammar
                            ? 'text-amber-600 dark:text-amber-400'
                            : isPunctuation
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {issue.category}
                      </span>
                      <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        {issue.message}
                      </span>
                    </div>

                    {/* Replacement comparison */}
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="line-through text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded font-mono">
                        {issue.matchedText}
                      </span>
                      <span className="text-neutral-400">→</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono">
                        {issue.replacement}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                      {issue.explanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onApplyIssue(issue)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                      title="Apply suggestion"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept
                    </button>
                    <button
                      onClick={() => onIgnoreIssue(issue.id)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Ignore this suggestion"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Real-time rule engine & zero tracking
        </span>
        <span>Runs 100% offline in browser</span>
      </div>
    </div>
  );
};
