import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('out');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : await readFile(resolve(root, '404.html')).catch(() => 'Run npm run build first.'));
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Production export preview: http://localhost:${port}`));
