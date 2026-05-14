import { Check } from 'lucide-react';
import { ExamplesPanel } from '@/features/workbench/components/ExamplesPanel';
import { HistoryPanel } from '@/features/workbench/components/HistoryPanel';
import { InputPane } from '@/features/workbench/components/InputPane';
import { OptionsPanel } from '@/features/workbench/components/OptionsPanel';
import { OutputPane } from '@/features/workbench/components/OutputPane';
import { TopBar } from '@/features/workbench/components/TopBar';
import { useWorkbench } from '@/features/workbench/hooks/useWorkbench';

export default function App() {
  const {
    activeTab,
    availableTabs,
    clearHistory,
    clearInput,
    copyOutput,
    deleteHistoryItem,
    downloadOutput,
    formatInput,
    highlightedOutput,
    history,
    input,
    inputLanguage,
    loadHistoryItem,
    minifyInput,
    mode,
    options,
    output,
    outputCopied,
    outputLanguage,
    parsed,
    pasteInput,
    setActiveTab,
    setInput,
    setTheme,
    shareState,
    status,
    switchMode,
    theme,
    updateOption
  } = useWorkbench();

  return (
    <main className="mx-auto w-[min(1500px,calc(100%-32px))] px-0 pb-8 pt-6 max-[680px]:w-[min(100%-20px,1500px)] max-[680px]:pt-3.5">
      <TopBar
        mode={mode}
        onFormat={formatInput}
        onMinify={minifyInput}
        onPaste={pasteInput}
        onShare={shareState}
        onSwitchMode={switchMode}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        theme={theme}
      />

      <section className="mb-4 flex flex-wrap items-center gap-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5">
        <Check size={18} />
        <span>
          Your data stays local. Parsing, conversion, history, and link encoding all run
          client-side.
        </span>
        <span className="text-sm text-muted-foreground">
          Hotkeys: Ctrl/Cmd+Enter format, Ctrl/Cmd+Shift+M minify, Ctrl/Cmd+Shift+S share,
          Ctrl/Cmd+Shift+C copy output.
        </span>
      </section>

      <section className="grid min-h-[620px] grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] gap-3.5 max-[1050px]:grid-cols-1 max-[1050px]:min-h-0">
        <InputPane
          input={input}
          inputLanguage={inputLanguage}
          mode={mode}
          onClear={clearInput}
          onInputChange={setInput}
          status={status}
          valid={parsed.ok}
        />
        <OutputPane
          activeTab={activeTab}
          availableTabs={availableTabs}
          highlightedOutput={highlightedOutput}
          onCopyOutput={copyOutput}
          onDownloadOutput={downloadOutput}
          onSelectTab={setActiveTab}
          output={output}
          outputCopied={outputCopied}
          outputLanguage={outputLanguage}
          valid={parsed.ok}
        />
      </section>

      <section className="mt-3.5 grid grid-cols-3 gap-3.5 max-[1050px]:grid-cols-2 max-[680px]:grid-cols-1">
        <OptionsPanel mode={mode} onUpdateOption={updateOption} options={options} />
        <ExamplesPanel mode={mode} onSelect={setInput} />
        <HistoryPanel
          history={history}
          mode={mode}
          onClearHistory={clearHistory}
          onDeleteHistoryItem={deleteHistoryItem}
          onSelectHistoryItem={loadHistoryItem}
        />
      </section>
    </main>
  );
}
