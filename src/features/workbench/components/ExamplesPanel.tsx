import type { Mode } from '@/features/workbench/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { YAML_EXAMPLE } from '@/features/workbench/constants';
import { examples } from '@/lib/examples';

type ExamplesPanelProps = {
  mode: Mode;
  onSelect: (value: string) => void;
};

export function ExamplesPanel({ mode, onSelect }: ExamplesPanelProps) {
  const items =
    mode === 'types'
      ? examples
      : [
          {
            description: 'Basic gateway with two upstream services and path-based routing.',
            id: 'gateway-basic',
            label: 'Gateway basics',
            value: YAML_EXAMPLE
          }
        ];

  return (
    <Card className="min-w-0">
      <CardContent className="space-y-3.5">
        <CardTitle>Examples</CardTitle>
        <div className="grid gap-2">
          {items.map((example) => (
            <Button
              type="button"
              variant="ghost"
              key={example.id}
              className="h-auto w-full items-start justify-start whitespace-normal break-words rounded-md border border-border px-4 py-3 text-left"
              onClick={() => onSelect(example.value)}
            >
              <span className="grid min-w-0 gap-0.5">
                <strong className="text-lg">{example.label}</strong>
                <span className="text-base text-muted-foreground">{example.description}</span>
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
