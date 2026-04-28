import { Context } from 'hono';

export function rowToCamel(row: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = row[key];
  }
  return result;
}

export function jsonRow(c: Context, row: Record<string, any> | null) {
  if (!row) return c.json({ error: 'Tidak dijumpai' }, 404);
  return c.json(rowToCamel(row));
}

export function jsonMany(c: Context, rows: Record<string, any>[]) {
  return c.json(rows.map(rowToCamel));
}
