import { Clipboard, FileJson, Moon, PanelRight, Share2, Sun, Wand2 } from 'lucide-react';
import type { Mode, Theme } from '@/features/workbench/types';
import { ModeSwitch } from '@/features/workbench/components/ModeSwitch';

type TopBarProps = {
  mode: Mode;
  onFormat: () => void;
  onMinify: () => void;
  onPaste: () => void;
  onShare: () => void;
  onSwitchMode: (mode: Mode) => void;
  onToggleTheme: () => void;
  theme: Theme;
};

export function TopBar({
  mode,
  onFormat,
  onMinify,
  onPaste,
  onShare,
  onSwitchMode,
  onToggleTheme,
  theme
}: TopBarProps) {
  return (
    <header className="mb-4 grid items-start gap-4 max-[680px]:gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 items-center gap-3.5 max-[680px]:gap-3">
        <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-lg bg-[#1f7a54] text-white shadow-[0_18px_60px_rgba(0,0,0,0.32)] max-[680px]:h-11 max-[680px]:w-11">
          <FileJson size={24} />
        </div>
        <div>
          <h1 className="text-[clamp(1.55rem,3vw,2.35rem)] font-bold leading-[1.05] tracking-normal max-[680px]:text-[2rem]">
            JSON-to-Something
          </h1>
          <p className="text-muted-foreground max-[680px]:text-sm">
            Type generator and config converter in your browser.
          </p>
        </div>
      </div>
      <div className="max-[680px]:w-full lg:col-start-1 lg:row-start-2">
        <ModeSwitch mode={mode} onSwitchMode={onSwitchMode} />
      </div>
      <div
        className="flex flex-wrap items-center gap-2.5 max-[680px]:grid max-[680px]:w-full max-[680px]:grid-cols-2 max-[680px]:gap-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-end"
        aria-label="Global actions"
      >
        <button
          type="button"
          onClick={onPaste}
          title="Paste JSON"
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[680px]:h-10 max-[680px]:px-3 max-[680px]:text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <Clipboard size={17} />
          <span>Paste</span>
        </button>
        <button
          type="button"
          onClick={onFormat}
          title="Format JSON"
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[680px]:h-10 max-[680px]:px-3 max-[680px]:text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <Wand2 size={17} />
          <span>Format</span>
        </button>
        <button
          type="button"
          onClick={onMinify}
          title="Minify JSON"
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[680px]:h-10 max-[680px]:px-3 max-[680px]:text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <PanelRight size={17} />
          <span>Minify</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          title="Copy share link"
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-input bg-background px-5 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[680px]:h-10 max-[680px]:px-3 max-[680px]:text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <Share2 size={17} />
          <span>Share</span>
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          title="Toggle theme"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 max-[680px]:col-span-2 max-[680px]:h-10 max-[680px]:w-10 max-[680px]:justify-self-end [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
