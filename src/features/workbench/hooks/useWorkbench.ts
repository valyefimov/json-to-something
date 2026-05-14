import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HistoryItem, Mode, OutputTab, Theme } from '@/features/workbench/types';
import {
  CONFIG_TABS,
  HISTORY_KEY,
  INITIAL_JSON_INPUT,
  THEME_KEY,
  TYPE_TABS,
  YAML_EXAMPLE
} from '@/features/workbench/constants';
import {
  buildHistoryLabel,
  getDownloadExtension,
  getOutputLanguage
} from '@/features/workbench/viewModel';
import {
  generateEnvoyConfig,
  generateNginxConfig,
  normalizeConfig,
  parseYamlInput,
  stringifyNormalizedConfig
} from '@/lib/configConverter';
import { examples } from '@/lib/examples';
import { decodeState, encodeState, safeReadStorage, safeWriteStorage } from '@/lib/state';
import {
  defaultOptions,
  generateJsonSchema,
  generateTypeScript,
  generateZod,
  inferSchema,
  parseJsonInput,
  type GeneratorOptions
} from '@/lib/transform';

export function useWorkbench() {
  const hashState = typeof window !== 'undefined' ? decodeState(window.location.hash) : null;
  const [mode, setMode] = useState<Mode>('types');
  const [input, setInput] = useState(hashState?.input ?? INITIAL_JSON_INPUT);
  const [options, setOptions] = useState<GeneratorOptions>(hashState?.options ?? defaultOptions);
  const [activeTab, setActiveTab] = useState<OutputTab>('typescript');
  const [history, setHistory] = useState<HistoryItem[]>(() => safeReadStorage(HISTORY_KEY, []));
  const [outputCopied, setOutputCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => safeReadStorage(THEME_KEY, 'dark'));
  const [status, setStatus] = useState('Ready');
  const copyFeedbackTimeoutRef = useRef<number | null>(null);

  const parsed = useMemo(
    () => (mode === 'types' ? parseJsonInput(input) : parseYamlInput(input)),
    [input, mode]
  );

  const result = useMemo(() => {
    if (!parsed.ok) return null;
    if (mode === 'types') {
      const schema = inferSchema(parsed.value);
      return {
        'json-schema': JSON.stringify(generateJsonSchema(schema, options), null, 2),
        typescript: generateTypeScript(schema, options),
        zod: generateZod(schema, options)
      };
    }

    const normalized = normalizeConfig(parsed.value);
    return {
      envoy: generateEnvoyConfig(normalized),
      nginx: generateNginxConfig(normalized)
    };
  }, [mode, options, parsed]);

  const output = result?.[activeTab] ?? '';
  const outputLanguage = getOutputLanguage(activeTab);
  const inputLanguage: 'json' | 'yaml' = mode === 'types' ? 'json' : 'yaml';
  const availableTabs: OutputTab[] = mode === 'types' ? TYPE_TABS : CONFIG_TABS;
  const highlightedOutput = useMemo(() => {
    const grammar = Prism.languages[outputLanguage];
    if (!grammar) return output;
    return Prism.highlight(output, grammar, outputLanguage);
  }, [output, outputLanguage]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    safeWriteStorage(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    safeWriteStorage(HISTORY_KEY, history);
  }, [history]);

  useEffect(() => {
    const encoded = encodeState({ input, options });
    if (encoded && window.location.hash !== encoded) {
      window.history.replaceState(null, '', encoded);
    }
  }, [input, options]);

  useEffect(() => {
    if (!parsed.ok) {
      setStatus(parsed.error);
      return;
    }
    setStatus(mode === 'types' ? 'Valid JSON' : 'Valid YAML');
  }, [mode, parsed]);

  function updateOption<Key extends keyof GeneratorOptions>(
    key: Key,
    value: GeneratorOptions[Key]
  ) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function switchMode(nextMode: Mode) {
    if (nextMode === 'types') {
      setMode('types');
      setActiveTab('typescript');
      setInput(examples[0].value);
      return;
    }
    setMode('config');
    setActiveTab('nginx');
    setInput(YAML_EXAMPLE);
  }

  async function pasteInput() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setStatus('Pasted from clipboard');
    } catch {
      setStatus('Clipboard read is unavailable');
    }
  }

  const copyOutput = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setOutputCopied(true);
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
      copyFeedbackTimeoutRef.current = window.setTimeout(() => {
        setOutputCopied(false);
        copyFeedbackTimeoutRef.current = null;
      }, 1500);
      setStatus('Copied output');
    } catch {
      setStatus('Clipboard write is unavailable');
    }
  }, [output]);

  useEffect(() => {
    setOutputCopied(false);
  }, [activeTab, output]);

  useEffect(
    () => () => {
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    },
    []
  );

  const shareState = useCallback(async () => {
    const encoded = encodeState({ input, options });
    if (!encoded) {
      setStatus('Share link is too large for the URL hash');
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Share link copied');
    } catch {
      setStatus('Share link is ready in the address bar');
    }
  }, [input, options]);

  const saveHistory = useCallback((value: unknown) => {
    const item: HistoryItem = {
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      input: JSON.stringify(value, null, 2),
      label: buildHistoryLabel(value)
    };

    setHistory((current) =>
      [item, ...current.filter((entry) => entry.input !== item.input)].slice(0, 8)
    );
  }, []);

  const formatInput = useCallback(() => {
    const next = mode === 'types' ? parseJsonInput(input) : parseYamlInput(input);
    if (!next.ok) {
      setStatus(next.error);
      return;
    }
    if (mode === 'types') {
      setInput(JSON.stringify(next.value, null, 2));
      saveHistory(next.value);
      setStatus('Formatted JSON');
      return;
    }
    setInput(stringifyNormalizedConfig(normalizeConfig(next.value)));
    saveHistory(next.value);
    setStatus('Formatted YAML');
  }, [input, mode, saveHistory]);

  const minifyInput = useCallback(() => {
    const next = mode === 'types' ? parseJsonInput(input) : parseYamlInput(input);
    if (!next.ok) {
      setStatus(next.error);
      return;
    }
    if (mode === 'types') {
      setInput(JSON.stringify(next.value));
      saveHistory(next.value);
      setStatus('Minified JSON');
      return;
    }
    setInput(stringifyNormalizedConfig(normalizeConfig(next.value)).trim());
    saveHistory(next.value);
    setStatus('Compacted YAML');
  }, [input, mode, saveHistory]);

  useEffect(() => {
    function isEditableElement(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      return Boolean(target.closest('input, textarea, [contenteditable="true"]'));
    }

    function onPaste(event: ClipboardEvent) {
      if (isEditableElement(event.target)) return;
      const text = event.clipboardData?.getData('text/plain')?.trim();
      if (!text) return;

      const next = mode === 'types' ? parseJsonInput(text) : parseYamlInput(text);
      if (!next.ok) return;

      event.preventDefault();
      setInput(text);
      setStatus(mode === 'types' ? 'Smart pasted JSON' : 'Smart pasted YAML');
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (isEditableElement(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === 'enter') {
        event.preventDefault();
        formatInput();
        return;
      }
      if (event.shiftKey && key === 'm') {
        event.preventDefault();
        minifyInput();
        return;
      }
      if (event.shiftKey && key === 's') {
        event.preventDefault();
        void shareState();
        return;
      }
      if (event.shiftKey && key === 'c') {
        event.preventDefault();
        void copyOutput();
      }
    }

    window.addEventListener('paste', onPaste);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('paste', onPaste);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [copyOutput, formatInput, minifyInput, mode, shareState]);

  function clearInput() {
    setInput('');
  }

  function downloadOutput() {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${options.rootName || 'Root'}.${getDownloadExtension(activeTab)}`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Downloaded output');
  }

  function loadHistoryItem(item: HistoryItem) {
    setInput(item.input);
  }

  function deleteHistoryItem(id: string) {
    setHistory((current) => current.filter((item) => item.id !== id));
    setStatus('History entry removed');
  }

  function clearHistory() {
    setHistory([]);
    setStatus('Local history cleared');
  }

  return {
    activeTab,
    availableTabs,
    clearHistory,
    clearInput,
    copyOutput,
    deleteHistoryItem,
    downloadOutput,
    formatInput,
    highlightedOutput,
    history,
    input,
    inputLanguage,
    loadHistoryItem,
    minifyInput,
    mode,
    options,
    output,
    outputCopied,
    outputLanguage,
    parsed,
    pasteInput,
    setActiveTab,
    setInput,
    setTheme,
    shareState,
    status,
    switchMode,
    theme,
    updateOption
  };
}
