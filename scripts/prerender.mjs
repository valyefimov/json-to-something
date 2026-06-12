import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { render } from '../dist-ssr/entry-server.js';

const distPath = resolve('dist/index.html');
const html = await readFile(distPath, 'utf8');
const appHtml = render();
const appHtmlPattern = /<!--app-html-->[\s\S]*?<!--\/app-html-->/;

if (!appHtmlPattern.test(html)) {
  throw new Error('Could not find #root placeholder in dist/index.html');
}

const prerendered = html.replace(appHtmlPattern, `<!--app-html-->${appHtml}<!--/app-html-->`);

await writeFile(distPath, prerendered);
