import { Hono } from 'hono';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../utils/validators';
import { signToken, generateId, hashPassword, verifyPassword } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono<{ Bindings: { DB: D1Database } }>();

auth.post('/register', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = registerSchema.parse(body);

  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(data.email).first();
  if (existing) return c.json({ error: 'Email telah didaftarkan' }, 409);

  const id = generateId();
  const hashed = await hashPassword(data.password);
  await db.prepare('INSERT INTO users (id, email, password, name, role, verified) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, data.email, hashed, data.name, 'CUSTOMER', 0).run();

  const token = await signToken({ userId: id, email: data.email, role: 'CUSTOMER' });

  return c.json({
    message: 'Pendaftaran berjaya',
    token,
    user: { id, email: data.email, name: data.name, role: 'CUSTOMER', verified: false },
  }, 201);
});

auth.post('/login', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = loginSchema.parse(body);

  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(data.email).first();
  if (!user) return c.json({ error: 'Email atau password salah' }, 401);

  const valid = await verifyPassword(data.password, user.password as string);
  if (!valid) return c.json({ error: 'Email atau password salah' }, 401);

  const token = await signToken({ userId: user.id as string, email: user.email as string, role: user.role as string });

  return c.json({
    message: 'Log masuk berjaya',
    token,
    user: {
      id: user.id, email: user.email, name: user.name,
      role: user.role, verified: !!user.verified,
    },
  });
});

auth.post('/forgot-password', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = z.object({ email: z.string().email() }).parse(body);

  const user = await db.prepare('SELECT id FROM users WHERE email = ?').bind(data.email).first();
  if (!user) return c.json({ message: 'Jika email wujud, pautan reset akan dihantar.' });

  const token = generateId() + generateId();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await db.prepare('INSERT INTO email_tokens (id, token, type, user_id, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(generateId(), token, 'RESET', user.id as string, expiresAt).run();

  return c.json({ message: 'Jika email wujud, pautan reset akan dihantar.' });
});

auth.post('/reset-password', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = z.object({ token: z.string(), password: z.string().min(6) }).parse(body);

  const emailToken = await db.prepare('SELECT * FROM email_tokens WHERE token = ? AND type = ?')
    .bind(data.token, 'RESET').first();
  if (!emailToken || new Date(emailToken.expires_at as string) < new Date()) {
    return c.json({ error: 'Token tidak sah atau tamat tempoh' }, 400);
  }

  const hashed = await hashPassword(data.password);
  await db.prepare('UPDATE users SET password = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .bind(hashed, emailToken.user_id as string).run();
  await db.prepare('DELETE FROM email_tokens WHERE id = ?').bind(emailToken.id as string).run();

  return c.json({ message: 'Password berjaya diset semula' });
});

export default auth;
