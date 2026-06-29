import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getRequestListener } from "@hono/node-server";
import honoApp from "./src/api.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount Hono app on /api
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      return getRequestListener(honoApp.fetch)(req, res);
    }
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
