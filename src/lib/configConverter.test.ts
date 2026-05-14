import { describe, expect, it } from 'vitest';
import {
  generateEnvoyConfig,
  generateNginxConfig,
  normalizeConfig,
  parseYamlInput,
  stringifyNormalizedConfig
} from '@/lib/configConverter';

describe('configConverter', () => {
  it('parses valid YAML and reports invalid YAML', () => {
    expect(parseYamlInput('routes:\n  - path: /users')).toMatchObject({ ok: true });
    expect(parseYamlInput('routes:\n  - path: /users: :')).toMatchObject({ ok: false });
  });

  it('normalizes and generates nginx and envoy configs', () => {
    const parsed = parseYamlInput(`
listeners:
  - host: "*"
    port: 8080
upstreams:
  users_api:
    servers:
      - host: users.internal
        port: 9000
routes:
  - path: /users
    service: users_api
`);

    if (!parsed.ok) throw new Error(parsed.error);
    const normalized = normalizeConfig(parsed.value);
    const nginx = generateNginxConfig(normalized);
    const envoy = generateEnvoyConfig(normalized);

    expect(nginx).toContain('upstream users_api');
    expect(nginx).toContain('location /users');
    expect(envoy).toContain('envoy.filters.network.http_connection_manager');
    expect(envoy).toContain('cluster: users_api');
  });

  it('stringifies normalized configs as yaml', () => {
    const normalized = normalizeConfig({
      routes: [{ path: '/healthz', service: 'health_api' }],
      upstreams: {
        health_api: {
          servers: [{ host: 'health.internal', port: 9200 }]
        }
      }
    });

    const yaml = stringifyNormalizedConfig(normalized);
    expect(yaml).toContain('upstreams:');
    expect(yaml).toContain('health_api:');
    expect(yaml).toContain('path: /healthz');
  });
});
