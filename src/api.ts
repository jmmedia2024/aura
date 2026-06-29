import { Hono } from 'hono';
import { requireAuth } from './middleware/auth.ts';
import { getOrCreateProfile, updateProfile, getProfile } from './db/profiles.ts';
import { createApplication, getApplications, getApplicationsByUser, updateApplicationStatus } from './db/applications.ts';
import { getCardDesigns, upsertCardDesign, deleteCardDesign } from './db/designs.ts';
import { getAllSettings, upsertSetting } from './db/settings.ts';
import { db, createWorkerDb, dbContext } from './db/index.ts';
import { profiles } from './db/schema.ts';
import { desc, sql } from 'drizzle-orm';

type Env = {
  Bindings: {
    HYPERDRIVE: {
      connectionString: string;
    };
  };
  Variables: {
    user: { uid: string; email?: string };
  };
};

const app = new Hono<Env>().basePath('/api');

// Middleware to inject Hyperdrive db connection for Cloudflare Workers
app.use('*', async (c, next) => {
  if (c.env?.HYPERDRIVE?.connectionString) {
    const { db: workerDb, client } = createWorkerDb(c.env.HYPERDRIVE.connectionString);
    await client.connect();
    
    return dbContext.run({ db: workerDb, client }, async () => {
      try {
        await next();
      } finally {
        c.executionCtx.waitUntil(client.end());
      }
    });
  }
  return next();
});

// API routes
app.get('/health', (c) => c.json({ status: 'ok' }));

// Profile routes
app.get('/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getOrCreateProfile(user.uid, user.email!);
    return c.json(profile);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.patch('/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const updatedProfile = await updateProfile(user.uid, body);
    return c.json(updatedProfile);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Profile: Get downline
app.get('/profile/downline', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    try {
      const downline = await db.select().from(profiles).where(sql`${profiles.ancestors} @> ARRAY[${user.email}]::text[]`);
      return c.json(downline);
    } catch (dbError) {
      console.error('DB error fetching downline:', dbError);
      return c.json([]);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Applications routes
app.get('/applications', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getProfile(user.uid);
    
    if (profile?.role === 'Admin') {
      const apps = await getApplications();
      return c.json(apps);
    } else {
      const apps = await getApplicationsByUser(user.uid);
      return c.json(apps);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/applications', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const appData = { ...body, user_id: user.uid };
    const newApp = await createApplication(appData);
    return c.json(newApp);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.patch('/applications/:id/status', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getProfile(user.uid);
    if (profile?.role !== 'Admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }
    const body = await c.req.json();
    const id = parseInt(c.req.param('id'));
    const updatedApp = await updateApplicationStatus(id, body.status);
    return c.json(updatedApp);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Designs routes
app.get('/designs', async (c) => {
  try {
    const designs = await getCardDesigns();
    return c.json(designs);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/designs', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getProfile(user.uid);
    if (profile?.role !== 'Admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }
    const body = await c.req.json();
    const design = await upsertCardDesign(body);
    return c.json(design);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.delete('/designs/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getProfile(user.uid);
    if (profile?.role !== 'Admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }
    const id = c.req.param('id');
    await deleteCardDesign(id);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.patch('/admin/users/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const adminProfile = await getProfile(user.uid);
    if (adminProfile?.role !== 'Admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }
    const id = c.req.param('id');
    const body = await c.req.json();
    const updatedProfile = await updateProfile(id, body);
    return c.json(updatedProfile);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Settings routes
app.get('/settings', async (c) => {
  try {
    const settings = await getAllSettings();
    return c.json(settings);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/settings', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getProfile(user.uid);
    if (profile?.role !== 'Admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }
    const { key, value } = await c.req.json();
    const setting = await upsertSetting(key, value);
    return c.json(setting);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Admin: Get all users
app.get('/admin/users', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getProfile(user.uid);
    if (profile?.role !== 'Admin') {
      return c.json({ error: 'Forbidden' }, 403);
    }
    try {
      const allUsers = await db.select().from(profiles).orderBy(desc(profiles.created_at));
      return c.json(allUsers);
    } catch (dbError) {
      console.error('DB error fetching users:', dbError);
      return c.json([]);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Export the Hono app (handles /api/*)
export default app;
