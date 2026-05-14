import { Trash2 } from 'lucide-react';
import Prism from 'prismjs';
import SimpleCodeEditor from 'react-simple-code-editor';
import type { Mode } from '@/features/workbench/types';
import type { ComponentType, CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="flex min-h-[620px] flex-col overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>{mode === 'types' ? 'Input JSON' : 'Input YAML'}</CardTitle>
          <p className={valid ? 'mt-1 text-sm text-emerald-400' : 'mt-1 text-sm text-red-400'}>
            {status}
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onClear} title="Clear input">
          <Trash2 size={17} />
        </Button>
      </CardHeader>
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
    </Card>
  );
}
