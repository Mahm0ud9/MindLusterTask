import jsonServer from 'json-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Standard path for Vercel
const dbPath = path.join(__dirname, 'db.json');
let data;

try {
  data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
} catch (e) {
  // Fallback path
  data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db.json'), 'utf-8'));
}

const router = jsonServer.router(data);

server.use(middlewares);

// Add custom middleware to handle the /api prefix from Vercel rewrites
server.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

server.use(router);

export default server;
