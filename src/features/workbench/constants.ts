import type { OutputTab } from '@/features/workbench/types';
import { examples } from '@/lib/examples';

export const THEME_KEY = 'json-to-something:theme';
export const CODE_FONT = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

export const INITIAL_JSON_INPUT = examples[0].value;

export const YAML_EXAMPLE = `listeners:
  - host: "*"
    port: 8080
upstreams:
  users_api:
    servers:
      - host: users.internal
        port: 9000
      - host: users-backup.internal
        port: 9000
        weight: 1
  billing_api:
    servers:
      - host: billing.internal
        port: 9100
routes:
  - path: /users
    service: users_api
  - path: /billing
    service: billing_api`;

export const TYPE_TABS: OutputTab[] = ['typescript', 'zod', 'json-schema'];
export const CONFIG_TABS: OutputTab[] = ['nginx', 'envoy'];
