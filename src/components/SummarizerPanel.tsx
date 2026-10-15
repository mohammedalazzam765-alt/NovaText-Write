import React, { useState } from 'react';
import { SummaryResult } from '../types';
import { Copy, Check, Download, FileText, List, Sparkles } from 'lucide-react';

interface SummarizerPanelProps {
  summary: SummaryResult | null;
  isProcessing: boolean;
  onGenerateSummary: (format: 'paragraph' | 'bullets' | 'key_takeaways', length: 'short' | 'medium' | 'detailed') => void;
  hasInput: boolean;
}

export const SummarizerPanel: React.FC<SummarizerPanelProps> = ({
  summary,
  isProcessing,
  onGenerateSummary,
  hasInput,
}) => {
  const [format, setFormat] = useState<'paragraph' | 'bullets' | 'key_takeaways'>('paragraph');
  const [length, setLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summary) return;
    const textToCopy =
      format === 'paragraph'
        ? summary.paragraph
        : format === 'bullets'
        ? summary.bulletPoints.map((b) => `• ${b}`).join('\n')
        : summary.keyTakeaways.join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleExport = () => {
    if (!summary) return;
    const content =
      format === 'paragraph'
        ? summary.paragraph
        : summary.bulletPoints.map((b) => `• ${b}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NovaText-summary-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 min-h-[420px] lg:min-h-[580px]">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Format:
            </span>
            <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <button
                onClick={() => {
                  setFormat('paragraph');
                  onGenerateSummary('paragraph', length);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                  format === 'paragraph'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Paragraph
              </button>
              <button
                onClick={() => {
                  setFormat('bullets');
                  onGenerateSummary('bullets', length);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                  format === 'bullets'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Bullet Points
              </button>
              <button
                onClick={() => {
                  setFormat('key_takeaways');
                  onGenerateSummary('key_takeaways', length);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                  format === 'key_takeaways'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Takeaways
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Length:
            </span>
            <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <button
                onClick={() => {
                  setLength('short');
                  onGenerateSummary(format, 'short');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  length === 'short'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Short
              </button>
              <button
                onClick={() => {
                  setLength('medium');
                  onGenerateSummary(format, 'medium');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  length === 'medium'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => {
                  setLength('detailed');
                  onGenerateSummary(format, 'detailed');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  length === 'detailed'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>

        {summary && (
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                Condensed by {summary.reductionPercentage}%
              </span>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="tabular-nums">
                {summary.originalWords} words → {summary.summaryWords} words
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="px-2 py-1 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-300 inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleExport}
                className="p-1 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-300"
                title="Download Summary"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {isProcessing ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Condensing document into core thesis...
            </p>
          </div>
        ) : !summary || !summary.paragraph ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Summarize Long Articles Instantly
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mt-1 leading-relaxed">
              Paste your article or essay on the left and click &ldquo;Summarize Text&rdquo; to condense it into structured bullet points or an executive brief.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {format === 'paragraph' ? (
              <p className="text-base leading-relaxed text-neutral-900 dark:text-neutral-100 font-normal">
                {summary.paragraph}
              </p>
            ) : format === 'bullets' ? (
              <ul className="space-y-2.5">
                {summary.bulletPoints.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2.5">
                {summary.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200/80 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200"
                  >
                    {takeaway}
                  </div>
                ))}
              </div>
            )}

            {/* Keyword tags (clean, unboxed text or subtle chips) */}
            {summary.keywords.length > 0 && (
              <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                  Salient Concepts:
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  {summary.keywords.map((kw, i) => (
                    <React.Fragment key={kw}>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{kw}</span>
                      {i < summary.keywords.length - 1 && (
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
