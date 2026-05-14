import { describe, expect, it } from 'vitest';
import {
  defaultOptions,
  generateJsonSchema,
  generateTypeScript,
  generateZod,
  inferSchema,
  parseJsonInput
} from '@/lib/transform';

describe('parseJsonInput', () => {
  it('parses valid JSON and reports invalid JSON', () => {
    expect(parseJsonInput('{"ok":true}')).toEqual({ ok: true, value: { ok: true } });
    expect(parseJsonInput('{nope')).toMatchObject({ ok: false });
  });
});

describe('generators', () => {
  it('generates TypeScript and Zod for nested objects', () => {
    const node = inferSchema({ id: 'usr_1', profile: { active: true, avatarUrl: null } });

    expect(generateTypeScript(node, defaultOptions)).toContain('export interface Root');
    expect(generateTypeScript(node, defaultOptions)).toContain('avatarUrl: null;');
    expect(generateZod(node, defaultOptions)).toContain('z.object');
    expect(generateZod(node, defaultOptions)).toContain('z.null()');
  });

  it('merges mixed object arrays into optional fields', () => {
    const node = inferSchema([
      { type: 'text', value: 'hello' },
      { type: 'image', url: 'https://example.com/image.png' }
    ]);

    const ts = generateTypeScript(node, { ...defaultOptions, rootName: 'BlockList' });

    expect(ts).toContain('export type BlockList');
    expect(ts).toContain('value?: string;');
    expect(ts).toContain('url?: string;');
  });

  it('supports nullable-as-optional output', () => {
    const node = inferSchema({ completedAt: null });
    const ts = generateTypeScript(node, { ...defaultOptions, optionalNullable: true });
    const zod = generateZod(node, { ...defaultOptions, optionalNullable: true });

    expect(ts).toContain('completedAt?: unknown;');
    expect(zod).toContain('completedAt: z.unknown().optional()');
  });

  it('generates JSON Schema', () => {
    const node = inferSchema({ count: 2, id: 'one', tags: ['a'] });
    const schema = generateJsonSchema(node, defaultOptions);

    expect(schema).toMatchObject({
      additionalProperties: false,
      title: 'Root',
      type: 'object'
    });
  });
});
