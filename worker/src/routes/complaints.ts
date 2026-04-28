import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { createComplaintSchema, updateComplaintSchema } from '../utils/validators';
import { generateId } from '../utils/jwt';

const complaints = new Hono<{ Bindings: { DB: D1Database } }>();

complaints.use('*', authMiddleware);

complaints.get('/categories', async (c) => {
  const db = c.env.DB;
  const rows = (await db.prepare('SELECT * FROM categories ORDER BY name').all()).results;
  return c.json(rows);
});

complaints.post('/', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  const data = createComplaintSchema.parse(body);

  const cat = await db.prepare('SELECT id FROM categories WHERE id = ?').bind(data.categoryId).first();
  if (!cat) return c.json({ error: 'Kategori tidak wujud' }, 400);

  const id = generateId();
  await db.prepare(
    'INSERT INTO complaints (id, title, description, priority, category_id, customer_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, data.title, data.description, data.priority || 'MEDIUM', data.categoryId, c.get('userId')).run();

  const complaint = await db.prepare(`
    SELECT c.*, cat.name as category_name
    FROM complaints c
    JOIN categories cat ON c.category_id = cat.id
    WHERE c.id = ?
  `).bind(id).first();

  return c.json(complaint, 201);
});

complaints.get('/my', async (c) => {
  const db = c.env.DB;
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;

  const countRow = await db.prepare('SELECT COUNT(*) as total FROM complaints WHERE customer_id = ?')
    .bind(c.get('userId')).first();
  const total = (countRow?.total as number) || 0;

  const rows = (await db.prepare(`
    SELECT c.*, cat.name as category_name,
      u.name as assigned_admin_name, u.email as assigned_admin_email
    FROM complaints c
    JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN users u ON c.assigned_admin_id = u.id
    WHERE c.customer_id = ?
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(c.get('userId'), limit, offset).all()).results;

  return c.json({ data: rows, total, page, limit });
});

complaints.get('/:id', async (c) => {
  const db = c.env.DB;
  const row = await db.prepare(`
    SELECT c.*, cat.name as category_name,
      u.name as assigned_admin_name, u.email as assigned_admin_email
    FROM complaints c
    JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN users u ON c.assigned_admin_id = u.id
    WHERE c.id = ?
  `).bind(c.req.param('id')).first();

  if (!row) return c.json({ error: 'Complaint tidak dijumpai' }, 404);
  if (c.get('userRole') === 'CUSTOMER' && row.customer_id !== c.get('userId')) {
    return c.json({ error: 'Akses ditolak' }, 403);
  }
  return c.json(row);
});

complaints.put('/:id', async (c) => {
  const db = c.env.DB;
  const complaint = await db.prepare('SELECT * FROM complaints WHERE id = ?')
    .bind(c.req.param('id')).first();
  if (!complaint) return c.json({ error: 'Complaint tidak dijumpai' }, 404);
  if (complaint.customer_id !== c.get('userId')) return c.json({ error: 'Akses ditolak' }, 403);
  if (complaint.status === 'CLOSED') return c.json({ error: 'Complaint Closed tidak boleh dikemaskini' }, 400);

  const body = await c.req.json();
  const data = updateComplaintSchema.parse(body);

  const sets: string[] = [];
  const vals: any[] = [];
  if (data.title) { sets.push('title = ?'); vals.push(data.title); }
  if (data.description) { sets.push('description = ?'); vals.push(data.description); }
  if (data.categoryId) { sets.push('category_id = ?'); vals.push(data.categoryId); }
  if (data.priority) { sets.push('priority = ?'); vals.push(data.priority); }
  sets.push("updated_at = datetime('now')");
  vals.push(c.req.param('id'));

  await db.prepare(`UPDATE complaints SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();

  const updated = await db.prepare(`
    SELECT c.*, cat.name as category_name
    FROM complaints c JOIN categories cat ON c.category_id = cat.id WHERE c.id = ?
  `).bind(c.req.param('id')).first();
  return c.json(updated);
});

complaints.delete('/:id', async (c) => {
  const db = c.env.DB;
  const complaint = await db.prepare('SELECT * FROM complaints WHERE id = ?')
    .bind(c.req.param('id')).first();
  if (!complaint) return c.json({ error: 'Complaint tidak dijumpai' }, 404);
  if (complaint.customer_id !== c.get('userId')) return c.json({ error: 'Akses ditolak' }, 403);
  if (complaint.status !== 'NEW') return c.json({ error: 'Hanya complaint status New boleh dipadam' }, 400);

  await db.prepare('DELETE FROM complaints WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ message: 'Complaint berjaya dipadam' });
});

export default complaints;
