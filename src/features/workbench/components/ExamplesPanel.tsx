import type { Mode } from '@/features/workbench/types';
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
    <div className="min-w-0 rounded-xl border bg-card text-card-foreground shadow">
      <div className="space-y-3.5 p-6">
        <h2 className="text-xl font-semibold leading-tight tracking-normal">Examples</h2>
        <div className="grid gap-2">
          {items.map((example) => (
            <button
              type="button"
              key={example.id}
              title={`Load example: ${example.label}`}
              className="inline-flex h-auto w-full cursor-pointer items-start justify-start gap-2 whitespace-normal wrap-break-word rounded-md border border-border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              onClick={() => onSelect(example.value)}
            >
              <span className="grid min-w-0 gap-0.5">
                <strong className="text-base">{example.label}</strong>
                <span className="text-sm text-muted-foreground">{example.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
