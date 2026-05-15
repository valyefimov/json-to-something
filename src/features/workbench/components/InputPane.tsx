import { Trash2 } from 'lucide-react';
import Prism from 'prismjs';
import SimpleCodeEditor from 'react-simple-code-editor';
import type { Mode } from '@/features/workbench/types';
import type { ComponentType, CSSProperties } from 'react';
import { CODE_FONT } from '@/features/workbench/constants';

const Editor = ((SimpleCodeEditor as unknown as { default?: unknown }).default ??
  SimpleCodeEditor) as ComponentType<{
  className?: string;
  highlight: (code: string) => string;
  onValueChange: (code: string) => void;
  padding?: number;
  preClassName?: string;
  style?: CSSProperties;
  textareaClassName?: string;
  textareaId?: string;
  value: string;
}>;

type InputPaneProps = {
  input: string;
  inputLanguage: 'json' | 'yaml';
  mode: Mode;
  onClear: () => void;
  onInputChange: (value: string) => void;
  status: string;
  valid: boolean;
};

export function InputPane({
  input,
  inputLanguage,
  mode,
  onClear,
  onInputChange,
  status,
  valid
}: InputPaneProps) {
  return (
    <div className="flex min-h-155 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <div>
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            {mode === 'types' ? 'Input JSON' : 'Input YAML'}
          </h2>
          <p className={valid ? 'mt-1 text-sm text-emerald-400' : 'mt-1 text-sm text-red-400'}>
            {status}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          onClick={onClear}
          title="Clear input"
        >
          <Trash2 size={17} />
        </button>
      </div>
      <label htmlFor="json-input" className="sr-only">
        {mode === 'types' ? 'JSON input' : 'YAML input'}
      </label>
      <Editor
        value={input}
        onValueChange={onInputChange}
        highlight={(code) => {
          const grammar = Prism.languages[inputLanguage];
          return grammar ? Prism.highlight(code, grammar, inputLanguage) : code;
        }}
        padding={16}
        textareaId="json-input"
        textareaClassName="code-editor-textarea"
        preClassName={`code-editor-pre language-${inputLanguage}`}
        className="code-editor flex-1"
        style={{
          flex: 1,
          fontFamily: CODE_FONT,
          fontSize: 14,
          lineHeight: 1.55,
          minHeight: 0
        }}
      />
    </div>
  );
}
