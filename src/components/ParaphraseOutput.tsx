import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCw,
  ArrowLeftRight,
  Download,
  Eye,
  Sliders,
} from 'lucide-react';
import { DiffToken, ParaphraseResult } from '../types';

interface ParaphraseOutputProps {
  result: ParaphraseResult | null;
  isProcessing: boolean;
  onRephrase: () => void;
  onReplaceInput: (newText: string) => void;
  onUpdateTokenText: (tokenId: string, newWord: string) => void;
}

export const ParaphraseOutput: React.FC<ParaphraseOutputProps> = ({
  result,
  isProcessing,
  onRephrase,
  onReplaceInput,
  onUpdateTokenText,
}) => {
  const [showDiff, setShowDiff] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTokenPopover, setActiveTokenPopover] = useState<{
    token: DiffToken;
    rect: DOMRect;
  } | null>(null);

  const handleCopy = async () => {
    if (!result?.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSpeak = () => {
    if (!result?.text || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleExportTxt = () => {
    if (!result?.text) return;
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NovaText-paraphrased-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTokenClick = (e: React.MouseEvent<HTMLElement>, token: DiffToken) => {
    e.stopPropagation();
    if (token.synonyms && token.synonyms.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveTokenPopover({ token, rect });
    }
  };

  // Close popover when clicking anywhere else
  React.useEffect(() => {
    const handleOutside = () => setActiveTokenPopover(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 relative min-h-[420px] lg:min-h-[580px]">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50/30 dark:bg-neutral-900/40">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Paraphrased Output
          </span>
          {result && (
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">
              · {result.changesCount} {result.changesCount === 1 ? 'change' : 'changes'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Diff Highlight Toggle */}
          <button
            onClick={() => setShowDiff(!showDiff)}
            disabled={!result}
            className={`px-2 py-1 rounded transition-colors text-xs inline-flex items-center gap-1 ${
              showDiff
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            } disabled:opacity-40`}
            title="Toggle word change highlights"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Highlight Changes</span>
          </button>

          {/* Speech Audio */}
          <button
            onClick={handleSpeak}
            disabled={!result?.text}
            className={`px-2 py-1 rounded transition-colors text-xs inline-flex items-center gap-1 ${
              isSpeaking
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            } disabled:opacity-40`}
            title={isSpeaking ? 'Stop narration' : 'Listen with text-to-speech'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>

          {/* Rephrase Button */}
          <button
            onClick={onRephrase}
            disabled={!result || isProcessing}
            className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 inline-flex items-center gap-1"
            title="Rephrase again"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Rephrase</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!result?.text}
            className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 inline-flex items-center gap-1"
            title="Copy rewritten text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Replace Input Button */}
          <button
            onClick={() => result?.text && onReplaceInput(result.text)}
            disabled={!result?.text}
            className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 inline-flex items-center gap-1"
            title="Transfer paraphrased text into input editor"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Use as Input</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportTxt}
            disabled={!result?.text}
            className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 inline-flex items-center gap-1"
            title="Download TXT"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-5 overflow-y-auto">
        {isProcessing ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Generating contextual paraphrase...
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Analyzing semantics, sentence syntax, and tone calibration
            </p>
          </div>
        ) : !result || !result.text ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 dark:text-neutral-600">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-3">
              <Sliders className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Paraphrased Text Will Appear Here
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1 leading-relaxed">
              Enter your sentences on the left and select a tone mode. Click &ldquo;Paraphrase Text&rdquo; to generate natural, polished variations.
            </p>
          </div>
        ) : (
          <div className="text-base leading-relaxed text-neutral-900 dark:text-neutral-100 font-normal select-text">
            {showDiff ? (
              <p className="whitespace-pre-wrap">
                {result.tokens.map((token) => {
                  if (token.type === 'replaced') {
                    return (
                      <span
                        key={token.id}
                        onClick={(e) => handleTokenClick(e, token)}
                        className="cursor-pointer text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-xs px-0.5 mx-0.5 transition-colors"
                        title={
                          token.synonyms && token.synonyms.length > 0
                            ? `Original: "${token.originalText}" • Click to view ${token.synonyms.length} synonyms`
                            : `Original: "${token.originalText}"`
                        }
                      >
                        {token.text}
                      </span>
                    );
                  } else if (token.type === 'added') {
                    return (
                      <span
                        key={token.id}
                        onClick={(e) => handleTokenClick(e, token)}
                        className={`mx-0.5 px-0.5 rounded-xs transition-colors ${
                          token.synonyms && token.synonyms.length > 0
                            ? 'cursor-pointer text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                            : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {token.text}
                      </span>
                    );
                  }
                  return <span key={token.id}>{token.text} </span>;
                })}
              </p>
            ) : (
              <p className="whitespace-pre-wrap">{result.text}</p>
            )}
          </div>
        )}
      </div>

      {/* Interactive Synonym Swap Popover */}
      {activeTokenPopover && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 rounded-xl shadow-2xl p-2.5 w-60 text-left animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: `${Math.min(window.innerHeight - 200, activeTokenPopover.rect.bottom + 6)}px`,
            left: `${Math.min(window.innerWidth - 260, Math.max(10, activeTokenPopover.rect.left))}px`,
          }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Synonym Alternatives
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              current: &ldquo;{activeTokenPopover.token.text}&rdquo;
            </span>
          </div>

          <div className="mt-1.5 flex flex-col gap-1 max-h-48 overflow-y-auto">
            {activeTokenPopover.token.synonyms?.map((syn) => (
              <button
                key={syn}
                onClick={() => {
                  onUpdateTokenText(activeTokenPopover.token.id, syn);
                  setActiveTokenPopover(null);
                }}
                className="w-full text-left px-2 py-1 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors flex items-center justify-between group"
              >
                <span>{syn}</span>
                <span className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100">
                  Select ↵
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info / Tip */}
      <div className="px-4 py-2 bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
        <span>Click highlighted words to select alternative synonyms</span>
        <span>100% Free · No Sign-Up</span>
      </div>
    </div>
  );
};
