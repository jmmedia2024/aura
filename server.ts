import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, type AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateProfile, updateProfile, getProfile } from "./src/db/profiles.ts";
import { createApplication, getApplications, getApplicationsByUser, updateApplicationStatus } from "./src/db/applications.ts";
import { getCardDesigns, upsertCardDesign, deleteCardDesign } from "./src/db/designs.ts";
import { getAllSettings, upsertSetting } from "./src/db/settings.ts";
import { db } from "./src/db/index.ts";
import { profiles } from "./src/db/schema.ts";
import { desc, sql } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Profile routes
  app.get("/api/profile", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email!;
      const profile = await getOrCreateProfile(uid, email);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/profile", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const updatedProfile = await updateProfile(uid, req.body);
      res.json(updatedProfile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile: Get downline
  app.get("/api/profile/downline", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user!.email!;
      const downline = await db.select().from(profiles).where(sql`${profiles.ancestors} @> ARRAY[${email}]::text[]`);
      res.json(downline);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Applications routes
  app.get("/api/applications", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const profile = await getProfile(uid);
      
      if (profile?.role === 'Admin') {
        const apps = await getApplications();
        res.json(apps);
      } else {
        const apps = await getApplicationsByUser(uid);
        res.json(apps);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/applications", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const appData = { ...req.body, user_id: uid };
      const newApp = await createApplication(appData);
      res.json(newApp);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/applications/:id/status", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const profile = await getProfile(uid);
      if (profile?.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const updatedApp = await updateApplicationStatus(parseInt(req.params.id), req.body.status);
      res.json(updatedApp);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Designs routes
  app.get("/api/designs", async (req, res) => {
    try {
      const designs = await getCardDesigns();
      res.json(designs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/designs", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const profile = await getProfile(uid);
      if (profile?.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const design = await upsertCardDesign(req.body);
      res.json(design);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/designs/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const profile = await getProfile(uid);
      if (profile?.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      await deleteCardDesign(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/settings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const profile = await getProfile(uid);
      if (profile?.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const { key, value } = req.body;
      const setting = await upsertSetting(key, value);
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin: Get all users
  app.get("/api/admin/users", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const profile = await getProfile(uid);
      if (profile?.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      const allUsers = await db.select().from(profiles).orderBy(desc(profiles.created_at));
      res.json(allUsers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
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
