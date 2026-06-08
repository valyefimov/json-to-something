import { FileJson, HelpCircle, Moon, Share2, Sun } from 'lucide-react';
import type { Theme } from '@/features/workbench/types';

type TopBarProps = {
  instructionsOpen: boolean;
  onShare: () => void;
  onToggleInstructions: () => void;
  onToggleTheme: () => void;
  theme: Theme;
};

export function TopBar({
  instructionsOpen,
  onShare,
  onToggleInstructions,
  onToggleTheme,
  theme
}: TopBarProps) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4 max-[760px]:flex-col max-[760px]:items-start max-[680px]:gap-3">
      <div className="flex min-w-0 items-center gap-3.5 max-[680px]:gap-3">
        <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-lg bg-[#1f7a54] text-white shadow-[0_18px_60px_rgba(0,0,0,0.32)] max-[680px]:h-11 max-[680px]:w-11">
          <FileJson size={24} />
        </div>
        <div>
          <h1 className="text-[clamp(1.55rem,3vw,2.35rem)] font-bold leading-[1.05] tracking-normal max-[680px]:text-[2rem]">
            JSON to TypeScript, Zod, JSON Schema and YAML config converter
          </h1>
          <p className="text-muted-foreground max-[680px]:text-sm">
            JSON-to-Something converts developer payloads locally in your browser.
          </p>
        </div>
      </div>
      <div
        className="flex flex-wrap items-center gap-2.5 max-[760px]:w-full max-[760px]:flex-nowrap"
        aria-label="Global actions"
      >
        <button
          type="button"
          onClick={onShare}
          title="Copy share link"
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-input bg-background px-5 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[760px]:h-10 max-[760px]:px-3 max-[760px]:text-sm max-[680px]:h-10 max-[680px]:w-auto max-[680px]:justify-self-start max-[680px]:px-3 max-[680px]:text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <Share2 size={17} />
          <span className="max-[760px]:hidden">Share</span>
        </button>
        <button
          type="button"
          aria-expanded={instructionsOpen}
          aria-controls="instructions-panel"
          onClick={onToggleInstructions}
          title={instructionsOpen ? 'Hide instructions' : 'Show instructions'}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-primary/40 bg-primary/10 text-[hsl(var(--success))] transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[680px]:h-10 max-[680px]:w-10 max-[680px]:justify-self-start [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <HelpCircle size={17} />
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          title="Toggle theme"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[680px]:h-10 max-[680px]:w-10 max-[680px]:justify-self-start [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
