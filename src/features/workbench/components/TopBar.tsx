import { Clipboard, FileJson, Moon, PanelRight, Share2, Sun, Wand2 } from 'lucide-react';
import type { Mode, Theme } from '@/features/workbench/types';
import { Button } from '@/components/ui/button';
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
    <header className="mb-4 flex flex-col items-start justify-between gap-5 xl:flex-row xl:items-center">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-lg bg-[#1f7a54] text-white shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
          <FileJson size={24} />
        </div>
        <div>
          <h1 className="text-[clamp(1.55rem,3vw,2.35rem)] font-bold leading-[1.05] tracking-normal">
            JSON-to-Something
          </h1>
          <p className="text-muted-foreground">
            Type generator and config converter in your browser.
          </p>
        </div>
      </div>
      <ModeSwitch mode={mode} onSwitchMode={onSwitchMode} />
      <div className="flex flex-wrap items-center justify-end gap-2.5" aria-label="Global actions">
        <Button
          type="button"
          onClick={onPaste}
          title="Paste JSON"
          className="h-11 rounded-lg px-5 text-base"
        >
          <Clipboard size={17} />
          <span>Paste</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onFormat}
          title="Format JSON"
          className="h-11 rounded-lg px-5 text-base"
        >
          <Wand2 size={17} />
          <span>Format</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onMinify}
          title="Minify JSON"
          className="h-11 rounded-lg px-5 text-base"
        >
          <PanelRight size={17} />
          <span>Minify</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onShare}
          title="Copy share link"
          className="h-11 rounded-lg px-5 text-base"
        >
          <Share2 size={17} />
          <span>Share</span>
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onToggleTheme}
          title="Toggle theme"
          className="h-11 w-11 rounded-lg"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </Button>
      </div>
    </header>
  );
}
