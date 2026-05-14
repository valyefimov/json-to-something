export type PrimitiveKind = 'string' | 'number' | 'boolean';

export type InferredNode =
  | { kind: 'primitive'; type: PrimitiveKind }
  | { kind: 'null' }
  | { kind: 'unknown' }
  | { kind: 'array'; element: InferredNode }
  | { kind: 'object'; fields: Record<string, InferredField> }
  | { kind: 'union'; variants: InferredNode[] };

export type InferredField = {
  node: InferredNode;
  optional: boolean;
};

export type ParseResult = { ok: true; value: unknown } | { ok: false; error: string };

export type GeneratorOptions = {
  rootName: string;
  preferInterface: boolean;
  semicolons: boolean;
  readonly: boolean;
  optionalNullable: boolean;
  zodStrict: boolean;
};

export const defaultOptions: GeneratorOptions = {
  optionalNullable: false,
  preferInterface: true,
  readonly: false,
  rootName: 'Root',
  semicolons: true,
  zodStrict: true
};

export function parseJsonInput(input: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid JSON input',
      ok: false
    };
  }
}

export function inferSchema(value: unknown): InferredNode {
  if (value === null) return { kind: 'null' };

  if (Array.isArray(value)) {
    if (value.length === 0) return { element: { kind: 'unknown' }, kind: 'array' };
    return { element: mergeNodes(value.map(inferSchema)), kind: 'array' };
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return {
      fields: Object.fromEntries(
        entries.map(([key, fieldValue]) => [
          key,
          { node: inferSchema(fieldValue), optional: false }
        ])
      ),
      kind: 'object'
    };
  }

  const valueType = typeof value;
  if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
    return { kind: 'primitive', type: valueType };
  }

  return { kind: 'unknown' };
}

export function generateTypeScript(
  node: InferredNode,
  options: GeneratorOptions = defaultOptions
): string {
  const ctx: TypeContext = { declarations: [], names: new Set() };
  const rootName = toTypeName(options.rootName || 'Root');

  if (node.kind === 'object') {
    emitObjectDeclaration(rootName, node, options, ctx);
  } else {
    ctx.declarations.push(
      `export type ${rootName} = ${typeForNode(node, rootName, options, ctx)}${end(options)}`
    );
  }

  return ctx.declarations.join('\n\n');
}

export function generateZod(
  node: InferredNode,
  options: GeneratorOptions = defaultOptions
): string {
  const rootName = toTypeName(options.rootName || 'Root');
  return `import { z } from "zod";\n\nexport const ${rootName}Schema = ${zodForNode(node, options)}${end(options)}\n\nexport type ${rootName} = z.infer<typeof ${rootName}Schema>${end(options)}`;
}

export function generateJsonSchema(
  node: InferredNode,
  options: GeneratorOptions = defaultOptions
): object {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: toTypeName(options.rootName || 'Root'),
    ...jsonSchemaForNode(node)
  };
}

type TypeContext = {
  declarations: string[];
  names: Set<string>;
};

function mergeNodes(nodes: InferredNode[]): InferredNode {
  const flattened = nodes.flatMap((node) => (node.kind === 'union' ? node.variants : [node]));
  const objects = flattened.filter(
    (node): node is Extract<InferredNode, { kind: 'object' }> => node.kind === 'object'
  );

  if (objects.length === flattened.length) {
    return mergeObjects(objects);
  }

  const unique = dedupeNodes(flattened);
  return unique.length === 1 ? unique[0] : { kind: 'union', variants: unique };
}

function mergeObjects(objects: Extract<InferredNode, { kind: 'object' }>[]): InferredNode {
  const allKeys = new Set(objects.flatMap((object) => Object.keys(object.fields)));
  const fields: Record<string, InferredField> = {};

  for (const key of allKeys) {
    const present = objects
      .map((object) => object.fields[key])
      .filter((field): field is InferredField => Boolean(field));

    fields[key] = {
      node: mergeNodes(present.map((field) => field.node)),
      optional: present.length < objects.length || present.some((field) => field.optional)
    };
  }

  return { fields, kind: 'object' };
}

function dedupeNodes(nodes: InferredNode[]): InferredNode[] {
  const seen = new Set<string>();
  return nodes.filter((node) => {
    const key = signature(node);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function signature(node: InferredNode): string {
  if (node.kind === 'object') {
    return `object:${Object.entries(node.fields)
      .map(([key, field]) => `${key}${field.optional ? '?' : ''}:${signature(field.node)}`)
      .join(',')}`;
  }

  if (node.kind === 'array') return `array:${signature(node.element)}`;
  if (node.kind === 'union') return `union:${node.variants.map(signature).sort().join('|')}`;
  if (node.kind === 'primitive') return node.type;
  return node.kind;
}

function emitObjectDeclaration(
  name: string,
  node: Extract<InferredNode, { kind: 'object' }>,
  options: GeneratorOptions,
  ctx: TypeContext
) {
  const safeName = uniqueName(name, ctx);
  const lines = Object.entries(node.fields).map(([key, field]) => {
    const propertyName = propertyKey(key);
    const optional = field.optional || (options.optionalNullable && hasNull(field.node)) ? '?' : '';
    const readonly = options.readonly ? 'readonly ' : '';
    const type = typeForNode(
      options.optionalNullable ? withoutNull(field.node) : field.node,
      `${safeName}${toTypeName(key)}`,
      options,
      ctx
    );
    return `  ${readonly}${propertyName}${optional}: ${type}${end(options)}`;
  });

  const body = lines.length ? lines.join('\n') : '';
  if (options.preferInterface) {
    ctx.declarations.push(`export interface ${safeName} {\n${body}\n}`);
  } else {
    ctx.declarations.push(`export type ${safeName} = {\n${body}\n}${end(options)}`);
  }
}

function typeForNode(
  node: InferredNode,
  nameHint: string,
  options: GeneratorOptions,
  ctx: TypeContext
): string {
  switch (node.kind) {
    case 'primitive':
      return node.type;
    case 'null':
      return 'null';
    case 'unknown':
      return 'unknown';
    case 'array':
      return `${typeForNode(node.element, `${nameHint}Item`, options, ctx)}[]`;
    case 'union':
      return node.variants
        .map((variant) => typeForNode(variant, nameHint, options, ctx))
        .join(' | ');
    case 'object': {
      const typeName = toTypeName(nameHint);
      emitObjectDeclaration(typeName, node, options, ctx);
      return typeName;
    }
  }
}

function zodForNode(node: InferredNode, options: GeneratorOptions): string {
  switch (node.kind) {
    case 'primitive':
      return `z.${node.type}()`;
    case 'null':
      return 'z.null()';
    case 'unknown':
      return 'z.unknown()';
    case 'array':
      return `z.array(${zodForNode(node.element, options)})`;
    case 'union':
      return `z.union([${node.variants.map((variant) => zodForNode(variant, options)).join(', ')}])`;
    case 'object': {
      const entries = Object.entries(node.fields)
        .map(([key, field]) => {
          let value = zodForNode(
            options.optionalNullable ? withoutNull(field.node) : field.node,
            options
          );
          if (hasNull(field.node) && !options.optionalNullable && field.node.kind !== 'null')
            value += '.nullable()';
          if (field.optional || (options.optionalNullable && hasNull(field.node)))
            value += '.optional()';
          return `  ${propertyKey(key)}: ${value}`;
        })
        .join(',\n');
      return `z.object({\n${entries}\n})${options.zodStrict ? '.strict()' : ''}`;
    }
  }
}

function jsonSchemaForNode(node: InferredNode): object {
  switch (node.kind) {
    case 'primitive':
      return { type: node.type === 'number' ? 'number' : node.type };
    case 'null':
      return { type: 'null' };
    case 'unknown':
      return {};
    case 'array':
      return { items: jsonSchemaForNode(node.element), type: 'array' };
    case 'union':
      return { anyOf: node.variants.map(jsonSchemaForNode) };
    case 'object': {
      const required = Object.entries(node.fields)
        .filter(([, field]) => !field.optional)
        .map(([key]) => key);
      return {
        properties: Object.fromEntries(
          Object.entries(node.fields).map(([key, field]) => [key, jsonSchemaForNode(field.node)])
        ),
        type: 'object',
        ...(required.length ? { required } : {}),
        additionalProperties: false
      };
    }
  }
}

function hasNull(node: InferredNode): boolean {
  return node.kind === 'null' || (node.kind === 'union' && node.variants.some(hasNull));
}

function withoutNull(node: InferredNode): InferredNode {
  if (node.kind !== 'union') return node.kind === 'null' ? { kind: 'unknown' } : node;
  const variants = node.variants.filter((variant) => variant.kind !== 'null');
  if (variants.length === 0) return { kind: 'unknown' };
  return variants.length === 1 ? variants[0] : { kind: 'union', variants };
}

function toTypeName(value: string): string {
  const words = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').match(/[A-Za-z0-9]+/g) ?? ['Root'];
  const name = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  return /^[0-9]/.test(name) ? `T${name}` : name;
}

function uniqueName(name: string, ctx: TypeContext): string {
  let candidate = name;
  let i = 2;
  while (ctx.names.has(candidate)) {
    candidate = `${name}${i}`;
    i += 1;
  }
  ctx.names.add(candidate);
  return candidate;
}

function propertyKey(key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function end(options: GeneratorOptions): string {
  return options.semicolons ? ';' : '';
}
