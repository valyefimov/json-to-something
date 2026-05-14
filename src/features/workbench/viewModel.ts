import type { OutputTab } from '@/features/workbench/types';

const outputLanguageByTab = {
  envoy: 'yaml',
  'json-schema': 'json',
  nginx: 'nginx',
  typescript: 'typescript',
  zod: 'typescript'
} as const satisfies Record<OutputTab, 'json' | 'nginx' | 'typescript' | 'yaml'>;

const tabLabelByTab = {
  envoy: 'Envoy',
  'json-schema': 'JSON Schema',
  nginx: 'Nginx',
  typescript: 'TypeScript',
  zod: 'Zod'
} as const satisfies Record<OutputTab, string>;

const downloadExtensionByTab = {
  envoy: 'yaml',
  'json-schema': 'json',
  nginx: 'conf',
  typescript: 'ts',
  zod: 'ts'
} as const satisfies Record<OutputTab, 'conf' | 'json' | 'ts' | 'yaml'>;

export function getOutputLanguage(tab: OutputTab): 'json' | 'nginx' | 'typescript' | 'yaml' {
  return outputLanguageByTab[tab];
}

export function getTabLabel(tab: OutputTab): string {
  return tabLabelByTab[tab];
}

export function getDownloadExtension(tab: OutputTab): 'conf' | 'json' | 'ts' | 'yaml' {
  return downloadExtensionByTab[tab];
}

export function buildHistoryLabel(value: unknown): string {
  if (Array.isArray(value))
    return `Array with ${value.length} item${value.length === 1 ? '' : 's'}`;
  if (value && typeof value === 'object') {
    return (
      Object.keys(value as Record<string, unknown>)
        .slice(0, 3)
        .join(', ') || 'Object'
    );
  }
  return String(value);
}
