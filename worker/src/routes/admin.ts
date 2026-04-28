import { Hono } from 'hono';
import { authMiddleware, authorize } from '../middleware/auth';
import { adminUpdateSchema } from '../utils/validators';
import { canTransition } from '../utils/statusMachine';

const admin = new Hono<{ Bindings: { DB: D1Database } }>();

admin.use('*', authMiddleware, authorize('ADMIN'));

admin.get('/complaints', async (c) => {
  const db = c.env.DB;
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;
  const search = c.req.query('search') || '';
  const status = c.req.query('status');
  const priority = c.req.query('priority');

  let where = '1=1';
  const params: any[] = [];

  if (search) {
    where += ' AND (c.title LIKE ? OR c.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status) { where += ' AND c.status = ?'; params.push(status); }
  if (priority) { where += ' AND c.priority = ?'; params.push(priority); }

  const countRow = await db.prepare(`SELECT COUNT(*) as total FROM complaints c WHERE ${where}`).bind(...params).first();
  const total = (countRow?.total as number) || 0;

  params.push(limit, offset);
  const rows = (await db.prepare(`
    SELECT c.*, cat.name as category_name,
      cust.name as customer_name, cust.email as customer_email,
      adm.name as assigned_admin_name, adm.email as assigned_admin_email
    FROM complaints c
    JOIN categories cat ON c.category_id = cat.id
    JOIN users cust ON c.customer_id = cust.id
    LEFT JOIN users adm ON c.assigned_admin_id = adm.id
    WHERE ${where}
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(...params).all()).results;

  return c.json({ data: rows, total, page, limit });
});

admin.put('/complaints/:id', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = adminUpdateSchema.parse(body);

  const complaint = await db.prepare('SELECT * FROM complaints WHERE id = ?')
    .bind(c.req.param('id')).first();
  if (!complaint) return c.json({ error: 'Complaint tidak dijumpai' }, 404);

  if (data.status && !canTransition(complaint.status as string, data.status)) {
    return c.json({ error: `Status tidak boleh ditukar dari ${complaint.status} ke ${data.status}` }, 400);
  }

  if (data.assignedAdminId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE id = ? AND role = 'ADMIN'")
      .bind(data.assignedAdminId).first();
    if (!adminUser) return c.json({ error: 'Admin tidak wujud' }, 400);
  }

  const sets: string[] = [];
  const vals: any[] = [];
  if (data.status) { sets.push('status = ?'); vals.push(data.status); }
  if (data.assignedAdminId !== undefined) { sets.push('assigned_admin_id = ?'); vals.push(data.assignedAdminId || null); }
  sets.push("updated_at = datetime('now')");
  vals.push(c.req.param('id'));

  await db.prepare(`UPDATE complaints SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();

  const updated = await db.prepare(`
    SELECT c.*, cat.name as category_name,
      cust.name as customer_name, cust.email as customer_email,
      adm.name as assigned_admin_name, adm.email as assigned_admin_email
    FROM complaints c
    JOIN categories cat ON c.category_id = cat.id
    JOIN users cust ON c.customer_id = cust.id
    LEFT JOIN users adm ON c.assigned_admin_id = adm.id
    WHERE c.id = ?
  `).bind(c.req.param('id')).first();

  return c.json(updated);
});

admin.get('/dashboard', async (c) => {
  const db = c.env.DB;

  const totalRow = await db.prepare('SELECT COUNT(*) as total FROM complaints').first();
  const byStatus = (await db.prepare('SELECT status, COUNT(*) as count FROM complaints GROUP BY status').all()).results;
  const byPriority = (await db.prepare('SELECT priority, COUNT(*) as count FROM complaints GROUP BY priority').all()).results;
  const recent = (await db.prepare(`
    SELECT c.*, cat.name as category_name,
      cust.name as customer_name, cust.email as customer_email,
      adm.name as assigned_admin_name
    FROM complaints c
    JOIN categories cat ON c.category_id = cat.id
    JOIN users cust ON c.customer_id = cust.id
    LEFT JOIN users adm ON c.assigned_admin_id = adm.id
    ORDER BY c.created_at DESC LIMIT 5
  `).all()).results;

  const statusMap: Record<string, number> = { NEW: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
  byStatus.forEach((s: any) => { statusMap[s.status] = s.count; });

  const priorityMap: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  byPriority.forEach((p: any) => { priorityMap[p.priority] = p.count; });

  return c.json({
    total: (totalRow?.total as number) || 0,
    byStatus: statusMap,
    byPriority: priorityMap,
    recent,
  });
});

admin.get('/admins', async (c) => {
  const db = c.env.DB;
  const rows = (await db.prepare("SELECT id, name, email FROM users WHERE role = 'ADMIN'").all()).results;
  return c.json(rows);
});

admin.get('/categories', async (c) => {
  const db = c.env.DB;
  const rows = (await db.prepare('SELECT * FROM categories ORDER BY name').all()).results;
  return c.json(rows);
});

export default admin;
