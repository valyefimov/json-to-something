import type { Mode } from '@/features/workbench/types';
import type { GeneratorOptions } from '@/lib/transform';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type OptionsPanelProps = {
  mode: Mode;
  onUpdateOption: <Key extends keyof GeneratorOptions>(
    key: Key,
    value: GeneratorOptions[Key]
  ) => void;
  options: GeneratorOptions;
};

export function OptionsPanel({ mode, onUpdateOption, options }: OptionsPanelProps) {
  return (
    <Card className="min-w-0">
      <CardContent className="space-y-3.5">
        <CardTitle>Options</CardTitle>
        {mode === 'types' ? (
          <>
            <label className="grid gap-2 text-sm text-muted-foreground">
              <span>Root type name</span>
              <Input
                value={options.rootName}
                onChange={(event) => onUpdateOption('rootName', event.target.value)}
              />
            </label>
            <div className="grid gap-2.5 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                  checked={options.preferInterface}
                  onChange={(event) => onUpdateOption('preferInterface', event.target.checked)}
                />
                Interfaces
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                  checked={options.semicolons}
                  onChange={(event) => onUpdateOption('semicolons', event.target.checked)}
                />
                Semicolons
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                  checked={options.readonly}
                  onChange={(event) => onUpdateOption('readonly', event.target.checked)}
                />
                Readonly fields
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                  checked={options.optionalNullable}
                  onChange={(event) => onUpdateOption('optionalNullable', event.target.checked)}
                />
                Nullable as optional
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                  checked={options.zodStrict}
                  onChange={(event) => onUpdateOption('zodStrict', event.target.checked)}
                />
                Zod strict objects
              </label>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            YAML mode expects `listeners`, `upstreams/services`, and `routes`. Generate Nginx and
            Envoy from one source config.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
