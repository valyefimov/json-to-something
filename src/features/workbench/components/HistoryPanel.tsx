import { History, Trash2, X } from 'lucide-react';
import type { HistoryItem, Mode } from '@/features/workbench/types';

type HistoryPanelProps = {
  history: HistoryItem[];
  mode: Mode;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
};

export function HistoryPanel({
  history,
  mode,
  onClearHistory,
  onDeleteHistoryItem,
  onSelectHistoryItem
}: HistoryPanelProps) {
  return (
    <div className="min-w-0 rounded-xl border bg-card text-card-foreground shadow">
      <div className="space-y-3.5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight tracking-normal">Local history</h2>
          <div className="flex items-center gap-1.5">
            {history.length > 0 ? (
              <button
                type="button"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                title="Clear all history"
                onClick={onClearHistory}
              >
                <Trash2 size={16} />
              </button>
            ) : null}
            <History size={17} />
          </div>
        </div>
        <div className="grid gap-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {mode === 'types'
                ? 'Format or minify valid JSON to save a local entry.'
                : 'Format YAML to save a local entry.'}
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-1 rounded-md border border-border bg-secondary/30 p-1"
              >
                <button
                  type="button"
                  title={`Load history entry: ${item.label}`}
                  className="inline-flex h-auto flex-1 cursor-pointer items-start justify-start gap-2 whitespace-normal wrap-break-word rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  onClick={() => onSelectHistoryItem(item)}
                >
                  <span className="grid min-w-0 gap-0.5">
                    <strong className="text-base">{item.label}</strong>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  title="Delete history entry"
                  onClick={() => onDeleteHistoryItem(item.id)}
                >
                  <X size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
