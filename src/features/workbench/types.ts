import type { GeneratorOptions } from '@/lib/transform';

export type Mode = 'types' | 'config';
export type OutputTab = 'typescript' | 'zod' | 'json-schema' | 'nginx' | 'envoy';
export type Theme = 'dark' | 'light';

export type HistoryItem = {
  id: string;
  input: string;
  createdAt: string;
  label: string;
};

export type WorkbenchHashState = {
  input: string;
  options: GeneratorOptions;
};
