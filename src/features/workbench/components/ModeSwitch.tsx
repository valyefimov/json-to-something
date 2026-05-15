import type { Mode } from '@/features/workbench/types';
import { cn } from '@/lib/utils';

type ModeSwitchProps = {
  mode: Mode;
  onSwitchMode: (mode: Mode) => void;
};

export function ModeSwitch({ mode, onSwitchMode }: ModeSwitchProps) {
  return (
    <div
      className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground max-[680px]:w-full"
      aria-label="Modes"
      role="tablist"
    >
      {(['types', 'config'] as const).map((value) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={mode === value}
          title={value === 'types' ? 'Switch to JSON to Types mode' : 'Switch to YAML to Envoy/Nginx mode'}
          onClick={() => onSwitchMode(value)}
          className={cn(
            'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all max-[680px]:flex-1 max-[680px]:px-2',
            mode === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === 'types' ? 'JSON to Types' : 'YAML to Envoy/Nginx'}
        </button>
      ))}
    </div>
  );
}
