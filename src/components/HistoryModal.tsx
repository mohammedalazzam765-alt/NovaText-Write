import React from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  items,
  onRestore,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Writing History
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Saved locally on your browser. No data ever leaves your device.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearHistory}
                className="px-2.5 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              No recent history yet. Paraphrases and rewrites will appear here automatically.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {item.mode} {item.tone ? `· ${item.tone}` : ''}
                  </span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2">
                  {item.outputText || item.inputText}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-800 text-xs">
                  <button
                    onClick={() => handleCopy(item.id, item.outputText || item.inputText)}
                    className="px-2 py-1 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
                  >
                    <span>Load into Editor</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
