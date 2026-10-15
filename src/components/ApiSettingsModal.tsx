import React from 'react';
import { AiInferenceConfig } from '../types';
import { X, Cpu, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AiInferenceConfig;
  onSaveConfig: (cfg: AiInferenceConfig) => void;
}

const POPULAR_OPEN_MODELS = [
  { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B Instruct (Recommended)' },
  { id: 'meta-llama/Llama-3.2-3B-Instruct', name: 'Meta Llama 3.2 3B Instruct' },
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B Instruct v0.3' },
];

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [useExternal, setUseExternal] = React.useState(config.useExternalHuggingFace);
  const [model, setModel] = React.useState(config.hfModel);
  const [apiKey, setApiKey] = React.useState(config.hfApiKey);
  const [savedNotice, setSavedNotice] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      useExternalHuggingFace: useExternal,
      hfModel: model,
      hfApiKey: apiKey,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                AI Inference Engine
              </h3>
              <p className="text-xs text-neutral-500">
                100% Free client-side processing & optional open LLM inference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Default Engine Info Card */}
          <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">
                Zero-Cost Client-Side Engine (Default & Active)
              </h4>
              <p className="text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                NovaText Write includes an embedded client-side linguistic rules and semantic synonym engine. It runs 100% in your browser with zero latency, zero server hosting costs, and requires no API keys or accounts.
              </p>
            </div>
          </div>

          {/* Toggle for optional Hugging Face API */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Enable Remote Open-Source LLMs (Hugging Face)
              </span>
              <input
                type="checkbox"
                checked={useExternal}
                onChange={(e) => setUseExternal(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-500"
              />
            </label>

            {useExternal && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Select Open LLM:
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {POPULAR_OPEN_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-neutral-700 dark:text-neutral-300">
                      Hugging Face User Access Token (Free):
                    </label>
                    <a
                      href="https://huggingface.co/settings/tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      Get free token <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="hf_xxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Stored only in your browser session. If empty or invalid, the app automatically uses the instant client-side engine.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            {savedNotice ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{savedNotice ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
