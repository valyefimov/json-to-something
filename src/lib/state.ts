import lzString from 'lz-string';
import { defaultOptions, type GeneratorOptions } from '@/lib/transform';

const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString;

export type EncodedState = {
  input: string;
  options: GeneratorOptions;
};

const hashPrefixV1 = '#state=';
const hashPrefixV2 = '#lz=';
const maxHashLength = 24000;

export function encodeState(state: EncodedState): string | null {
  try {
    const compressed = compressToEncodedURIComponent(JSON.stringify(state));
    const hash = `${hashPrefixV2}${compressed}`;
    return hash.length <= maxHashLength ? hash : null;
  } catch {
    return null;
  }
}

export function decodeState(hash: string): EncodedState | null {
  if (hash.startsWith(hashPrefixV2)) {
    try {
      const raw = decompressFromEncodedURIComponent(hash.slice(hashPrefixV2.length));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<EncodedState>;
      if (typeof parsed.input !== 'string' || !parsed.options) return null;
      return {
        input: parsed.input,
        options: normalizeOptions(parsed.options)
      };
    } catch {
      return null;
    }
  }

  // Backward compatibility for older base64-hash links.
  if (hash.startsWith(hashPrefixV1)) {
    try {
      const parsed = JSON.parse(
        decodeURIComponent(atob(hash.slice(hashPrefixV1.length)))
      ) as Partial<EncodedState>;
      if (typeof parsed.input !== 'string' || !parsed.options) return null;
      return {
        input: parsed.input,
        options: normalizeOptions(parsed.options)
      };
    } catch {
      return null;
    }
  }

  return null;
}

export function normalizeOptions(options: Partial<GeneratorOptions>): GeneratorOptions {
  return {
    ...defaultOptions,
    ...options,
    optionalNullable: Boolean(options.optionalNullable),
    preferInterface: Boolean(options.preferInterface),
    readonly: Boolean(options.readonly),
    rootName:
      typeof options.rootName === 'string' && options.rootName.trim()
        ? options.rootName
        : defaultOptions.rootName,
    semicolons: options.semicolons !== false,
    zodStrict: options.zodStrict !== false
  };
}

export function safeReadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safeWriteStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private windows; the app should still work.
  }
}
