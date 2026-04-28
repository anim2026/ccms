import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
    userEmail: string;
    userRole: string;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const header = c.req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return c.json({ error: 'Token tidak disertakan' }, 401);
  }
  try {
    const token = header.split(' ')[1];
    const payload = await verifyToken(token);
    c.set('userId', payload.userId);
    c.set('userEmail', payload.email);
    c.set('userRole', payload.role);
    await next();
  } catch {
    return c.json({ error: 'Token tidak sah atau tamat tempoh' }, 401);
  }
}

export function authorize(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const role = c.get('userRole');
    if (!roles.includes(role)) {
      return c.json({ error: 'Akses ditolak' }, 403);
    }
    await next();
  };
}
