import { Check, Copy, Download } from 'lucide-react';
import type { OutputTab } from '@/features/workbench/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
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
    <Card className="flex min-h-[620px] flex-col overflow-hidden">
      <CardHeader className="flex-col gap-2 md:flex-row md:items-center">
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCopyOutput}
            disabled={!output}
            title={outputCopied ? 'Copied' : 'Copy output'}
          >
            {outputCopied ? <Check size={17} /> : <Copy size={17} />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDownloadOutput}
            disabled={!output}
            title="Download output"
          >
            <Download size={17} />
          </Button>
        </div>
      </CardHeader>
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
    </Card>
  );
}
