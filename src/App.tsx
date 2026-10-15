import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppMode,
  ParaphraseTone,
  SynonymLevel,
  GrammarIssue,
  ParaphraseResult,
  SummaryResult,
  PlagiarismReport,
  HistoryItem,
  AiInferenceConfig,
} from './types';
import { computeTextStats } from './services/readability';
import { analyzeGrammar, applySuggestion, applyAllSuggestions } from './services/grammarRules';
import { paraphraseText } from './services/paraphraser';
import { summarizeText } from './services/summarizer';
import { checkPlagiarism } from './services/plagiarism';
import { SAMPLE_PRESETS, SamplePreset } from './data/samples';

import { Header } from './components/Header';
import { ToneSelector } from './components/ToneSelector';
import { EditorLeft } from './components/EditorLeft';
import { ParaphraseOutput } from './components/ParaphraseOutput';
import { GrammarPanel } from './components/GrammarPanel';
import { SummarizerPanel } from './components/SummarizerPanel';
import { PlagiarismPanel } from './components/PlagiarismPanel';
import { AdBanner } from './components/AdBanner';
import { HistoryModal } from './components/HistoryModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';

import { Sparkles, ArrowRight, ShieldCheck, CheckCheck } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('novatext_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync theme class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('novatext_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('novatext_theme', 'light');
    }
  }, [isDarkMode]);

  // Primary Workspace state
  const [currentMode, setCurrentMode] = useState<AppMode>('paraphrase');
  const [inputText, setInputText] = useState<string>(() => {
    return SAMPLE_PRESETS[0].text;
  });
  const [currentTone, setCurrentTone] = useState<ParaphraseTone>('standard');
  const [synonymLevel, setSynonymLevel] = useState<SynonymLevel>('balanced');

  // Results state
  const [paraphraseResult, setParaphraseResult] = useState<ParaphraseResult | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [plagiarismReport, setPlagiarismReport] = useState<PlagiarismReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // History state
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('novatext_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Open Inference Config
  const [hfConfig, setHfConfig] = useState<AiInferenceConfig>(() => {
    try {
      const saved = localStorage.getItem('novatext_hf_config');
      return saved
        ? JSON.parse(saved)
        : {
            useExternalHuggingFace: false,
            hfModel: 'Qwen/Qwen2.5-72B-Instruct',
            hfApiKey: '',
          };
    } catch {
      return {
        useExternalHuggingFace: false,
        hfModel: 'Qwen/Qwen2.5-72B-Instruct',
        hfApiKey: '',
      };
    }
  });

  // Modal visibility
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);

  // Live text stats calculation
  const stats = useMemo(() => computeTextStats(inputText), [inputText]);

  // Live grammar issues calculation
  const [ignoredIssueIds, setIgnoredIssueIds] = useState<Set<string>>(new Set());
  const allIssues = useMemo(() => analyzeGrammar(inputText), [inputText]);
  const activeIssues = useMemo(
    () => allIssues.filter((iss) => !ignoredIssueIds.has(iss.id)),
    [allIssues, ignoredIssueIds]
  );

  // Save history helper
  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    setHistoryItems((prev) => {
      const updated = [newItem, ...prev].slice(0, 30);
      try {
        localStorage.setItem('novatext_history', JSON.stringify(updated));
      } catch {
        // storage quota
      }
      return updated;
    });
  }, []);

  // Paraphrase execution
  const executeParaphrase = useCallback(async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    try {
      const res = await paraphraseText(
        inputText,
        currentTone,
        synonymLevel,
        hfConfig.useExternalHuggingFace
          ? { apiKey: hfConfig.hfApiKey, model: hfConfig.hfModel }
          : undefined
      );
      setParaphraseResult(res);
      addHistoryItem({
        mode: 'paraphrase',
        inputText,
        outputText: res.text,
        tone: currentTone,
      });
    } catch {
      // fallback
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, currentTone, synonymLevel, hfConfig, addHistoryItem]);

  // Summarize execution
  const executeSummarize = useCallback(
    (format: 'paragraph' | 'bullets' | 'key_takeaways' = 'paragraph', length: 'short' | 'medium' | 'detailed' = 'medium') => {
      if (!inputText.trim()) return;
      setIsProcessing(true);
      setTimeout(() => {
        const res = summarizeText(inputText, format, length);
        setSummaryResult(res);
        addHistoryItem({
          mode: 'summarize',
          inputText,
          outputText: format === 'paragraph' ? res.paragraph : res.bulletPoints.join('\n'),
        });
        setIsProcessing(false);
      }, 350);
    },
    [inputText, addHistoryItem]
  );

  // Plagiarism check execution
  const executePlagiarismCheck = useCallback(() => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const rep = checkPlagiarism(inputText);
      setPlagiarismReport(rep);
      addHistoryItem({
        mode: 'plagiarism',
        inputText,
        outputText: `Originality Score: ${rep.originalityScore}% (${rep.riskLevel})`,
      });
      setIsProcessing(false);
    }, 850);
  }, [inputText, addHistoryItem]);

  // Handle Action Trigger based on current mode
  const handlePrimaryAction = useCallback(() => {
    if (currentMode === 'paraphrase') {
      executeParaphrase();
    } else if (currentMode === 'summarize') {
      executeSummarize();
    } else if (currentMode === 'plagiarism') {
      executePlagiarismCheck();
    }
  }, [currentMode, executeParaphrase, executeSummarize, executePlagiarismCheck]);

  // Keyboard shortcut: Cmd/Ctrl + Enter to trigger action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handlePrimaryAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrimaryAction]);

  // Grammar actions
  const handleApplySingleIssue = (issue: GrammarIssue) => {
    const updated = applySuggestion(inputText, issue);
    setInputText(updated);
  };

  const handleApplyAllIssues = () => {
    const updated = applyAllSuggestions(inputText, activeIssues);
    setInputText(updated);
  };

  const handleIgnoreIssue = (id: string) => {
    setIgnoredIssueIds((prev) => new Set([...prev, id]));
  };

  // Synonym direct replacement inside ParaphraseResult
  const handleUpdateTokenText = (tokenId: string, newWord: string) => {
    if (!paraphraseResult) return;
    const newTokens = paraphraseResult.tokens.map((tok) => {
      if (tok.id === tokenId) {
        return { ...tok, text: newWord };
      }
      return tok;
    });
    const newText = newTokens.map((t) => t.text).join(' ');
    setParaphraseResult({
      ...paraphraseResult,
      tokens: newTokens,
      text: newText,
    });
  };

  // Load sample preset
  const handleLoadSample = (sample: SamplePreset) => {
    setInputText(sample.text);
    setIgnoredIssueIds(new Set());
    setParaphraseResult(null);
    setSummaryResult(null);
    setPlagiarismReport(null);
  };

  // Restore from history
  const handleRestoreHistory = (item: HistoryItem) => {
    setInputText(item.inputText);
    if (item.tone) setCurrentTone(item.tone);
    setCurrentMode(item.mode);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('novatext_history');
  };

  // Save HF Config
  const handleSaveHfConfig = (cfg: AiInferenceConfig) => {
    setHfConfig(cfg);
    localStorage.setItem('novatext_hf_config', JSON.stringify(cfg));
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onLoadSample={handleLoadSample}
      />

      {/* Top Header Monetization Ad Banner Placeholder */}
      <div className="px-4">
        <AdBanner position="top-header" />
      </div>

      {/* Mode Sub-navigation for mobile / compact screens */}
      <div className="md:hidden flex items-center justify-center gap-1 p-2 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
        <button
          onClick={() => setCurrentMode('paraphrase')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            currentMode === 'paraphrase'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Paraphraser
        </button>
        <button
          onClick={() => setCurrentMode('grammar')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            currentMode === 'grammar'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Grammar ({activeIssues.length})
        </button>
        <button
          onClick={() => setCurrentMode('summarize')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            currentMode === 'summarize'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Summarizer
        </button>
        <button
          onClick={() => setCurrentMode('plagiarism')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            currentMode === 'plagiarism'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Originality
        </button>
      </div>

      {/* Paraphraser Tone Selector (Visible in paraphrase mode) */}
      {currentMode === 'paraphrase' && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-3">
          <div className="rounded-t-xl overflow-hidden border border-b-0 border-neutral-200 dark:border-neutral-800">
            <ToneSelector
              currentTone={currentTone}
              onSelectTone={(t) => setCurrentTone(t)}
              synonymLevel={synonymLevel}
              onSelectSynonymLevel={(l) => setSynonymLevel(l)}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}

      {/* Main Split-Screen Workspace (QuillBot / Grammarly layout) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Main 2-Column Split Workspace (takes 9 or 12 cols) */}
          <div className="lg:col-span-9 flex flex-col">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xs bg-white dark:bg-neutral-900 ${
                currentMode === 'paraphrase' ? 'rounded-t-none border-t-0' : ''
              }`}
            >
              {/* Left Column: Input Text Editor */}
              <EditorLeft
                value={inputText}
                onChange={(val) => setInputText(val)}
                stats={stats}
                issues={activeIssues}
                onApplyIssue={handleApplySingleIssue}
                onIgnoreIssue={handleIgnoreIssue}
                isGrammarMode={currentMode === 'grammar'}
                onPasteSample={() => handleLoadSample(SAMPLE_PRESETS[0])}
              />

              {/* Right Column: AI Output Canvas according to mode */}
              <div className="flex-1 flex flex-col">
                {currentMode === 'paraphrase' && (
                  <ParaphraseOutput
                    result={paraphraseResult}
                    isProcessing={isProcessing}
                    onRephrase={executeParaphrase}
                    onReplaceInput={(t) => setInputText(t)}
                    onUpdateTokenText={handleUpdateTokenText}
                  />
                )}

                {currentMode === 'grammar' && (
                  <GrammarPanel
                    issues={activeIssues}
                    onApplyIssue={handleApplySingleIssue}
                    onApplyAllIssues={handleApplyAllIssues}
                    onIgnoreIssue={handleIgnoreIssue}
                  />
                )}

                {currentMode === 'summarize' && (
                  <SummarizerPanel
                    summary={summaryResult}
                    isProcessing={isProcessing}
                    onGenerateSummary={executeSummarize}
                    hasInput={Boolean(inputText.trim())}
                  />
                )}

                {currentMode === 'plagiarism' && (
                  <PlagiarismPanel
                    report={plagiarismReport}
                    isScanning={isProcessing}
                    onScan={executePlagiarismCheck}
                    onParaphraseSentence={(sent) => {
                      setInputText(sent);
                      setCurrentMode('paraphrase');
                    }}
                    hasInput={Boolean(inputText.trim())}
                  />
                )}
              </div>
            </div>

            {/* Central Primary Trigger Action Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Free · No Registration · Instant Processing</span>
              </div>

              <div className="flex items-center gap-2">
                {currentMode === 'paraphrase' && (
                  <button
                    onClick={executeParaphrase}
                    disabled={!inputText.trim() || isProcessing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isProcessing ? 'Rewriting...' : 'Paraphrase Text'}</span>
                    <span className="hidden sm:inline font-mono text-[10px] text-indigo-200 bg-indigo-700/60 px-1.5 py-0.5 rounded">
                      Ctrl+Enter
                    </span>
                  </button>
                )}

                {currentMode === 'grammar' && (
                  <button
                    onClick={handleApplyAllIssues}
                    disabled={activeIssues.length === 0}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Fix All ({activeIssues.length}) Issues</span>
                  </button>
                )}

                {currentMode === 'summarize' && (
                  <button
                    onClick={() => executeSummarize()}
                    disabled={!inputText.trim() || isProcessing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isProcessing ? 'Summarizing...' : 'Summarize Text'}</span>
                  </button>
                )}

                {currentMode === 'plagiarism' && (
                  <button
                    onClick={executePlagiarismCheck}
                    disabled={!inputText.trim() || isProcessing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isProcessing ? 'Scanning...' : 'Scan Originality'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Strategic Ad Placement + Tool Highlights */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Sidebar Monetization Container */}
            <AdBanner position="sidebar" />

            {/* Feature Highlights Card */}
            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 text-xs">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Why NovaText Write?
              </h4>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>100% Free Forever:</strong> No paywalls, word caps, or subscriptions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Private & Client-Side:</strong> Works completely within your browser session.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>8 Paraphrase Modes:</strong> Standard, Fluency, Formal, Academic, Creative, Casual, Shorten, Expand.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Clickable Synonyms:</strong> Swap individual words with context-matched choices.</span>
                </li>
              </ul>
            </div>

            {/* Quick Presets Launcher */}
            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2.5 text-xs">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Quick Sample Presets
              </span>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleLoadSample(p)}
                    className="text-left p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">
                        {p.description}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 py-6 px-4 bg-white dark:bg-neutral-900 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">NovaText Write</span>
            <span>·</span>
            <span>Free Writing, Paraphrasing & Grammar Assistant</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Client-side inference</span>
            <span>·</span>
            <span>Zero server telemetry</span>
            <span>·</span>
            <span>Unlimited free usage</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onRestore={handleRestoreHistory}
        onClearHistory={handleClearHistory}
      />

      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        config={hfConfig}
        onSaveConfig={handleSaveHfConfig}
      />
    </div>
  );
}
