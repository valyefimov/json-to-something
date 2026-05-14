import { History, Trash2, X } from 'lucide-react';
import type { HistoryItem, Mode } from '@/features/workbench/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

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
    <Card className="min-w-0">
      <CardContent className="space-y-3.5">
        <div className="flex items-center justify-between">
          <CardTitle>Local history</CardTitle>
          <div className="flex items-center gap-1.5">
            {history.length > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md"
                title="Clear all history"
                onClick={onClearHistory}
              >
                <Trash2 size={16} />
              </Button>
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
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto flex-1 items-start justify-start whitespace-normal break-words rounded-md px-3 py-2 text-left"
                  onClick={() => onSelectHistoryItem(item)}
                >
                  <span className="grid min-w-0 gap-0.5">
                    <strong className="text-lg">{item.label}</strong>
                    <span className="text-base text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  title="Delete history entry"
                  onClick={() => onDeleteHistoryItem(item.id)}
                >
                  <X size={15} />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
