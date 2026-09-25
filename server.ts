import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

// Serve static assets from Vite build output with optimal caching
const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.resolve(distPath, 'index.html');

// Fallback auto-build: If dist/index.html is missing (e.g. if the deploy command only ran 'bun install' or 'npm install')
if (!fs.existsSync(indexPath)) {
  console.log('⚠️ dist/index.html não foi encontrado na inicialização!');
  console.log('🔨 Executando build de produção automaticamente (vite build)...');
  try {
    execSync('npx vite build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Build concluído com sucesso pelo servidor!');
  } catch (err) {
    console.error('❌ Falha ao tentar executar vite build automaticamente:', err);
  }
}

// Enable gzip/deflate compression for fast asset transfers
app.use(compression());

// Basic body parser
app.use(express.json());

// Standard security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Healthcheck endpoint for Render zero-downtime deploy checks
app.get('/api/health', (_req, res) => {
  const memory = process.memoryUsage();
  res.status(200).json({
    status: 'ok',
    service: 'Casa de Bolos - Confeitaria',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    distExists: fs.existsSync(indexPath),
    memory: {
      rssMb: Math.round(memory.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
    },
    env: process.env.NODE_ENV || 'production',
  });
});

// Serve hashed Vite assets with long-term immutable caching
app.use(
  '/assets',
  express.static(path.join(distPath, 'assets'), {
    maxAge: '1y',
    immutable: true,
  })
);

// Serve other static files (favicons, images, manifest)
app.use(
  express.static(distPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        // HTML entry point should never be cached long-term to ensure immediate updates
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// SPA fallback: All non-API routes serve index.html without caching
app.get('*', (_req, res) => {
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(indexPath);
  } else {
    // If build hasn't completed or failed, provide helpful status
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Casa de Bolos - Inicializando</title>
        <meta http-equiv="refresh" content="3">
      </head>
      <body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 48px 20px; background: #FAF7F2; color: #2D241E;">
        <h1 style="color: #8C482A; margin-bottom: 8px;">🍰 Casa de Bolos</h1>
        <p style="font-size: 16px; color: #7E7267;">A aplicação está finalizando o build de produção no servidor.</p>
        <p style="font-size: 13px; color: #9E9185;">Esta página atualizará automaticamente em instantes...</p>
      </body>
      </html>
    `);
  }
});

// Start listening
const server = app.listen(PORT, HOST, () => {
  console.log(`🍰 Casa de Bolos rodando com sucesso no Render!`);
  console.log(`📍 Servidor ativo em: http://${HOST}:${PORT}`);
  console.log(`🚀 Node.js: ${process.version} | Ambiente: ${process.env.NODE_ENV || 'production'}`);
});

// Graceful shutdown for zero-downtime rolling deploys on Render
const shutdown = (signal: string) => {
  console.log(`Recebido sinal ${signal}. Encerrando servidor de forma graciosa...`);
  server.close(() => {
    console.log('Servidor HTTP finalizado com sucesso.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Encerramento forçado por tempo limite excedido.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
