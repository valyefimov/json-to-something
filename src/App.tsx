import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { ExamplesPanel } from '@/features/workbench/components/ExamplesPanel';
import { InputPane } from '@/features/workbench/components/InputPane';
import { OptionsPanel } from '@/features/workbench/components/OptionsPanel';
import { OutputPane } from '@/features/workbench/components/OutputPane';
import { TopBar } from '@/features/workbench/components/TopBar';
import { useWorkbench } from '@/features/workbench/hooks/useWorkbench';
import packageJson from '../package.json';

export default function App() {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const {
    activeTab,
    availableTabs,
    clearInput,
    copyOutput,
    downloadOutput,
    formatInput,
    highlightedOutput,
    input,
    inputLanguage,
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
        instructionsOpen={instructionsOpen}
        onShare={shareState}
        onToggleInstructions={() => setInstructionsOpen((current) => !current)}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        theme={theme}
      />

      {instructionsOpen ? (
        <section className="mb-4">
          <div
            id="instructions-panel"
            className="flex gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3"
          >
            <HelpCircle size={20} className="mt-0.5 flex-none text-emerald-300" />
            <div className="grid gap-2">
              <p className="text-[15px] font-medium leading-6 text-foreground">
                Your data stays local. Parsing, conversion, history, and link encoding all run
                client-side.
              </p>
              <p className="text-[15px] font-medium leading-6 text-foreground">
                Paste JSON or YAML, then format, minify, share, or export.
              </p>
              <p className="text-sm font-medium leading-6 text-muted-foreground">
                Hotkeys: Ctrl/Cmd+Enter format, Ctrl/Cmd+Shift+M minify, Ctrl/Cmd+Shift+S share,
                Ctrl/Cmd+Shift+C copy output.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid min-h-155 grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] gap-3.5 max-[1050px]:grid-cols-1 max-[1050px]:min-h-0">
        <InputPane
          input={input}
          inputLanguage={inputLanguage}
          mode={mode}
          onClear={clearInput}
          onFormat={formatInput}
          onInputChange={setInput}
          onMinify={minifyInput}
          onPaste={pasteInput}
          onSwitchMode={switchMode}
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

      <section className="mt-3.5 grid grid-cols-2 gap-3.5 max-[680px]:grid-cols-1">
        <OptionsPanel mode={mode} onUpdateOption={updateOption} options={options} />
        <ExamplesPanel mode={mode} onSelect={setInput} />
      </section>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">
        <span>
          Created by Valentyn Yefimov.{' '}
          <a
            href="https://github.com/valyefimov/json-to-something"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Open source on GitHub
          </a>
          .
        </span>
        <span className="font-mono text-[11px] text-muted-foreground/80">v{packageJson.version}</span>
      </footer>
    </main>
  );
}
