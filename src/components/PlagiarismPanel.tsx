import React from 'react';
import { PlagiarismReport } from '../types';
import { ShieldCheck, AlertTriangle, ExternalLink, RotateCw, Sparkles } from 'lucide-react';

interface PlagiarismPanelProps {
  report: PlagiarismReport | null;
  isScanning: boolean;
  onScan: () => void;
  onParaphraseSentence: (sentence: string) => void;
  hasInput: boolean;
}

export const PlagiarismPanel: React.FC<PlagiarismPanelProps> = ({
  report,
  isScanning,
  onScan,
  onParaphraseSentence,
  hasInput,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 min-h-[420px] lg:min-h-[580px]">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Originality & Plagiarism Scanner
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cross-examines sentences against academic repositories and web archives
          </p>
        </div>

        <button
          onClick={onScan}
          disabled={!hasInput || isScanning}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Originality'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {isScanning ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Scanning Document Against Web Index
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Calculating multi-gram hash signatures and cross-matching against scientific and open web literature...
            </p>
          </div>
        ) : !report ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Check Text Originality
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mt-1 leading-relaxed">
              Verify that your essays, research papers, and articles are 100% original before publishing. Click &ldquo;Scan Originality&rdquo; to start.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Scorecard Hero */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200/90 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-lg tabular-nums border-4 ${
                    report.originalityScore >= 90
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : report.originalityScore >= 75
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-red-500 text-red-600 dark:text-red-400'
                  }`}
                >
                  {report.originalityScore}%
                  <span className="text-[9px] uppercase font-medium text-neutral-400 -mt-1">
                    Original
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {report.riskLevel === 'clean'
                        ? 'High Originality & Authentic Tone'
                        : report.riskLevel === 'low'
                        ? 'Slight Similarity Detected'
                        : report.riskLevel === 'moderate'
                        ? 'Moderate Phrasing Overlap'
                        : 'Elevated Similarity Risk'}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {report.matchedSentencesCount === 0
                      ? 'All sentences are uniquely phrased with no flagged source overlaps.'
                      : `Found ${report.matchedSentencesCount} sentence ${
                          report.matchedSentencesCount === 1 ? 'match' : 'matches'
                        } across indexed publications.`}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                <span>Indexed Sentences: <strong className="text-neutral-800 dark:text-neutral-200 tabular-nums">{report.totalSentences}</strong></span>
                <span>Flagged: <strong className="text-neutral-800 dark:text-neutral-200 tabular-nums">{report.matchedSentencesCount}</strong></span>
              </div>
            </div>

            {/* Matched Passages List */}
            {report.matches.length > 0 ? (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                  Flagged Phrases & Potential Sources:
                </span>
                {report.matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-3.5 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>~{match.similarityScore}% phrasing similarity</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {match.sourceDomain}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 italic border-l-2 border-amber-400 pl-2.5 my-1">
                      &ldquo;{match.sentence}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-neutral-500 line-clamp-1">
                        Matched with: <em>{match.sourceTitle}</em>
                      </span>
                      <button
                        onClick={() => onParaphraseSentence(match.sentence)}
                        className="px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-md text-[11px] font-medium transition-colors inline-flex items-center gap-1 shrink-0 ml-2"
                      >
                        <Sparkles className="w-3 h-3" />
                        Paraphrase this line
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl text-center py-6 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <p className="font-semibold text-sm">100% Original Content</p>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                  No matching passages were detected. Your prose displays strong individual vocabulary and composition.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
