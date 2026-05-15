import { Check, Copy, Download } from 'lucide-react';
import type { OutputTab } from '@/features/workbench/types';
import { getTabLabel } from '@/features/workbench/viewModel';
import { cn } from '@/lib/utils';

type OutputPaneProps = {
  activeTab: OutputTab;
  availableTabs: OutputTab[];
  highlightedOutput: string;
  onCopyOutput: () => void;
  onDownloadOutput: () => void;
  onSelectTab: (tab: OutputTab) => void;
  output: string;
  outputCopied: boolean;
  outputLanguage: 'json' | 'nginx' | 'typescript' | 'yaml';
  valid: boolean;
};

export function OutputPane({
  activeTab,
  availableTabs,
  highlightedOutput,
  onCopyOutput,
  onDownloadOutput,
  onSelectTab,
  output,
  outputCopied,
  outputLanguage,
  valid
}: OutputPaneProps) {
  return (
    <div className="flex min-h-155 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col gap-2 p-6 md:flex-row md:items-center">
        <div
          className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
          aria-label="Output formats"
          role="tablist"
        >
          {availableTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={cn(
                'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => onSelectTab(tab)}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            onClick={onCopyOutput}
            disabled={!output}
            title={outputCopied ? 'Copied' : 'Copy output'}
          >
            {outputCopied ? <Check size={17} /> : <Copy size={17} />}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            onClick={onDownloadOutput}
            disabled={!output}
            title="Download output"
          >
            <Download size={17} />
          </button>
        </div>
      </div>
      <pre
        aria-label="Generated output"
        className={`language-${outputLanguage} m-0 flex-1 overflow-auto bg-transparent p-4 font-mono text-sm leading-[1.55]`}
      >
        {valid ? (
          <code
            dangerouslySetInnerHTML={{ __html: highlightedOutput }}
            className={`language-${outputLanguage}`}
          />
        ) : (
          <code>Fix the input to generate output.</code>
        )}
      </pre>
    </div>
  );
}
