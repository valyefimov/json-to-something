import type { Mode } from '@/features/workbench/types';
import type { GeneratorOptions } from '@/lib/transform';

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
    <div className="min-w-0 rounded-xl border bg-card text-card-foreground shadow">
      <div className="space-y-3.5 p-6">
        <h2 className="text-2xl font-semibold leading-none tracking-tight">Options</h2>
        {mode === 'types' ? (
          <>
            <label className="grid gap-2 text-sm text-muted-foreground">
              <span>Root type name</span>
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
      </div>
    </div>
  );
}
