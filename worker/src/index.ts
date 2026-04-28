import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth';
import complaintRoutes from './routes/complaints';
import adminRoutes from './routes/admin';

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.use('*', cors({
  origin: (origin) => {
    const allowed = ['https://ccms.pages.dev', 'http://localhost:5173'];
    if (allowed.includes(origin)) return origin;
    if (origin.endsWith('.ccms.pages.dev')) return origin;
    return allowed[0];
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.route('/api/auth', authRoutes);
app.route('/api/complaints', complaintRoutes);
app.route('/api/admin', adminRoutes);

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.all('*', (c) => {
  return c.json({ error: 'Not found' }, 404);
});

export default app;
