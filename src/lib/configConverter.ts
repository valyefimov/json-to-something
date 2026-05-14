import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export type ParseResult = { ok: true; value: unknown } | { ok: false; error: string };

type UpstreamServer = {
  host: string;
  port: number;
  weight?: number;
};

type Upstream = {
  name: string;
  servers: UpstreamServer[];
};

type Route = {
  path: string;
  rewrite?: string;
  service: string;
};

type Listener = {
  host: string;
  port: number;
};

export type NormalizedConfig = {
  listeners: Listener[];
  routes: Route[];
  upstreams: Upstream[];
};

export function parseYamlInput(input: string): ParseResult {
  try {
    return { ok: true, value: parseYaml(input) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid YAML input',
      ok: false
    };
  }
}

export function normalizeConfig(value: unknown): NormalizedConfig {
  const source = isRecord(value) ? value : {};

  const listeners = toListeners(source.listeners ?? source.listener);
  const routes = toRoutes(source.routes);
  const upstreams = toUpstreams(source.upstreams ?? source.services);

  return {
    listeners: listeners.length > 0 ? listeners : [{ host: '0.0.0.0', port: 80 }],
    routes,
    upstreams
  };
}

export function generateNginxConfig(config: NormalizedConfig): string {
  const upstreamBlocks = config.upstreams
    .map((upstream) => {
      const servers = upstream.servers
        .map((server) => {
          const weightPart = server.weight ? ` weight=${server.weight}` : '';
          return `    server ${server.host}:${server.port}${weightPart};`;
        })
        .join('\n');
      return `upstream ${sanitizeName(upstream.name)} {\n${servers}\n}`;
    })
    .join('\n\n');

  const primaryListener = config.listeners[0];
  const locationBlocks = config.routes
    .map((route) => {
      const rewriteLine = route.rewrite
        ? `    rewrite ^${route.path}(.*)$ ${route.rewrite}$1 break;\n`
        : '';
      return `  location ${route.path} {\n${rewriteLine}    proxy_pass http://${sanitizeName(route.service)};\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header X-Forwarded-Proto $scheme;\n  }`;
    })
    .join('\n\n');

  return `${upstreamBlocks}\n\nserver {\n  listen ${primaryListener.port};\n  server_name ${primaryListener.host};\n\n${locationBlocks || '  location / {\n    return 404;\n  }'}\n}`;
}

export function generateEnvoyConfig(config: NormalizedConfig): string {
  const clusters = config.upstreams.map((upstream) => ({
    connect_timeout: '2s',
    lb_policy: 'ROUND_ROBIN',
    load_assignment: {
      cluster_name: sanitizeName(upstream.name),
      endpoints: [
        {
          lb_endpoints: upstream.servers.map((server) => ({
            endpoint: {
              address: {
                socket_address: {
                  address: server.host,
                  port_value: server.port
                }
              }
            },
            load_balancing_weight: server.weight ?? 1
          }))
        }
      ]
    },
    name: sanitizeName(upstream.name),
    type: 'STRICT_DNS'
  }));

  const listener = config.listeners[0];
  const envoyObject = {
    static_resources: {
      clusters,
      listeners: [
        {
          address: {
            socket_address: {
              address: listener.host === '*' ? '0.0.0.0' : listener.host,
              port_value: listener.port
            }
          },
          filter_chains: [
            {
              filters: [
                {
                  name: 'envoy.filters.network.http_connection_manager',
                  typed_config: {
                    '@type':
                      'type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager',
                    codec_type: 'AUTO',
                    http_filters: [{ name: 'envoy.filters.http.router' }],
                    route_config: {
                      name: 'local_route',
                      virtual_hosts: [
                        {
                          domains: ['*'],
                          name: 'backend',
                          routes:
                            config.routes.length > 0
                              ? config.routes.map((route) => ({
                                  match: { prefix: route.path },
                                  route: { cluster: sanitizeName(route.service) }
                                }))
                              : [{ direct_response: { status: 404 }, match: { prefix: '/' } }]
                        }
                      ]
                    },
                    stat_prefix: 'ingress_http'
                  }
                }
              ]
            }
          ],
          name: 'listener_0'
        }
      ]
    }
  };

  return toYamlString(envoyObject);
}

export function stringifyNormalizedConfig(config: NormalizedConfig): string {
  return stringifyYaml({
    listeners: config.listeners.map((listener) => ({
      host: listener.host,
      port: listener.port
    })),
    routes: config.routes.map((route) => ({
      ...(route.rewrite ? { rewrite: route.rewrite } : {}),
      path: route.path,
      service: route.service
    })),
    upstreams: Object.fromEntries(
      config.upstreams.map((upstream) => [
        upstream.name,
        {
          servers: upstream.servers.map((server) => ({
            ...(server.weight ? { weight: server.weight } : {}),
            host: server.host,
            port: server.port
          }))
        }
      ])
    )
  });
}

function toListeners(value: unknown): Listener[] {
  const rows = Array.isArray(value) ? value : value ? [value] : [];
  return rows
    .map((row) => {
      if (!isRecord(row)) return null;
      const host = asString(row.host ?? row.address ?? '*');
      const port = asNumber(row.port ?? row.listen ?? 80);
      if (!host || !port) return null;
      return { host, port };
    })
    .filter((row): row is Listener => Boolean(row));
}

function toRoutes(value: unknown): Route[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (!isRecord(row)) return null;
      const path = asString(row.path ?? row.prefix);
      const service = asString(row.service ?? row.upstream ?? row.cluster);
      if (!path || !service) return null;
      const rewrite = asString(row.rewrite);
      return { ...(rewrite ? { rewrite } : {}), path, service };
    })
    .filter((row): row is Route => Boolean(row));
}

function toUpstreams(value: unknown): Upstream[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((row) => {
        if (!isRecord(row)) return null;
        const name = asString(row.name);
        const servers = toServers(row.servers ?? row.endpoints);
        if (!name || servers.length === 0) return null;
        return { name, servers };
      })
      .filter((row): row is Upstream => Boolean(row));
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([name, row]) => {
        if (!isRecord(row)) return null;
        const servers = toServers(row.servers ?? row.endpoints ?? row.instances);
        if (servers.length === 0) return null;
        return { name, servers };
      })
      .filter((row): row is Upstream => Boolean(row));
  }

  return [];
}

function toServers(value: unknown): UpstreamServer[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (typeof row === 'string') {
        const [host, portRaw] = row.split(':');
        const port = asNumber(portRaw);
        return host && port ? { host, port } : null;
      }
      if (!isRecord(row)) return null;
      const host = asString(row.host ?? row.address);
      const port = asNumber(row.port);
      if (!host || !port) return null;
      return { host, port, weight: asNumber(row.weight) ?? undefined };
    })
    .filter((row): row is UpstreamServer => Boolean(row));
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

function toYamlString(value: unknown, indent = 0): string {
  const space = '  '.repeat(indent);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isRecord(item) || Array.isArray(item)) {
          return `${space}-\n${toYamlString(item, indent + 1)}`;
        }
        return `${space}- ${toYamlScalar(item)}`;
      })
      .join('\n');
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, entry]) => {
        if (isRecord(entry) || Array.isArray(entry)) {
          return `${space}${key}:\n${toYamlString(entry, indent + 1)}`;
        }
        return `${space}${key}: ${toYamlScalar(entry)}`;
      })
      .join('\n');
  }

  return `${space}${toYamlScalar(value)}`;
}

function toYamlScalar(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const text = String(value);
  return /^[a-zA-Z0-9_.:/-]+$/.test(text) ? text : `"${text.split('"').join('\\"')}"`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
