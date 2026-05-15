# JSON-to-Something

Developer toolbox that runs fully in the browser:

- Live app: [https://json2smth.yefimov.tech/](https://json2smth.yefimov.tech/)
- `JSON -> TypeScript`
- `JSON -> Zod`
- `JSON -> JSON Schema`
- `YAML -> Nginx`
- `YAML -> Envoy`

No backend, no database, no server-side processing.

## Features

- Dual mode workspace:
  - `JSON to Types`
  - `YAML to Envoy/Nginx`
- Syntax-highlighted input and output editors
- Format, minify, paste, copy, download, and share actions
- Built-in examples
- Local history (`localStorage`)
- Shareable URL hash state (compressed)
- Light/dark theme
- Smart paste + keyboard shortcuts

## Privacy

Everything is processed client-side in your browser.
Your input data is not sent to any backend.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- shadcn-style Tailwind component patterns
- PrismJS for highlighting
- Vitest + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

```bash
npm run dev         # start local dev server
npm run build       # typecheck + production build
npm run preview     # preview production build
npm run test        # run tests
npm run lint        # run eslint
npm run lint:fix    # autofix eslint issues
npm run format      # format with prettier
npm run format:check
```

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` -> Format input
- `Ctrl/Cmd + Shift + M` -> Minify/compact input
- `Ctrl/Cmd + Shift + S` -> Copy share link
- `Ctrl/Cmd + Shift + C` -> Copy output
