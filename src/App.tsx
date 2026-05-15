import { HelpCircle } from 'lucide-react';
import { ExamplesPanel } from '@/features/workbench/components/ExamplesPanel';
import { HistoryPanel } from '@/features/workbench/components/HistoryPanel';
import { InputPane } from '@/features/workbench/components/InputPane';
import { OptionsPanel } from '@/features/workbench/components/OptionsPanel';
import { OutputPane } from '@/features/workbench/components/OutputPane';
import { TopBar } from '@/features/workbench/components/TopBar';
import { useWorkbench } from '@/features/workbench/hooks/useWorkbench';
import packageJson from '../package.json';

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

      <section className="mb-4 flex gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
        <HelpCircle size={20} className="mt-0.5 flex-none text-emerald-300" />
        <div className="grid gap-2">
          <p className="text-[15px] font-medium leading-6 text-foreground">
            Your data stays local. Paste JSON or YAML, then format, minify, share, or export.
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium leading-5 text-muted-foreground">
            <span className="uppercase tracking-[0.08em] text-emerald-300/90">Hotkeys</span>
            {[
              ['Ctrl/Cmd+Enter', 'format'],
              ['Ctrl/Cmd+Shift+M', 'minify'],
              ['Ctrl/Cmd+Shift+S', 'share'],
              ['Ctrl/Cmd+Shift+C', 'copy output']
            ].map(([keys, action]) => (
              <span key={keys} className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-emerald-500/30 bg-background/70 px-1.5 py-0.5 font-mono text-[12px] font-semibold leading-none text-foreground shadow-sm">
                  {keys}
                </kbd>
                <span>{action}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-h-155 grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] gap-3.5 max-[1050px]:grid-cols-1 max-[1050px]:min-h-0">
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

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4 text-sm text-muted-foreground">
        <span>
          Created by Valentyn Yefimov.{' '}
          <a
            href="https://github.com/valyefimov/json-to-something"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Open source on GitHub
          </a>
          .
        </span>
        <span className="font-mono text-xs">v{packageJson.version}</span>
      </footer>
    </main>
  );
}
