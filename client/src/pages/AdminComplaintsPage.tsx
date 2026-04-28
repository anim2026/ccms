import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin';
import { Complaint } from '../api/complaints';
import Layout from '../components/Layout';

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  NEW: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  RESOLVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  CLOSED: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    adminApi
      .getAllComplaints({ page, limit, search: search || undefined, status: statusFilter || undefined, priority: priorityFilter || undefined })
      .then((res) => { setComplaints(res.data.data); setTotal(res.data.total); })
      .finally(() => setLoading(false));
  }, [page, search, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Semua Aduan</h1>
        <p className="text-gray-400 mb-6">{total} aduan direkodkan</p>

        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Cari aduan..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-10 py-2.5"
              />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto py-2.5">
              <option value="">Semua Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} className="input-field w-auto py-2.5">
              <option value="">Semua Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="skeleton rounded-xl h-14" />)}</div>
        ) : complaints.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tiada Aduan</h3>
            <p className="text-gray-400">Tiada aduan sepadan dengan carian</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="px-5 py-3 font-medium">Tajuk Aduan</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Customer</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Kategori</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Priority</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Admin</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Tarikh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map((c) => {
                  const sCfg = statusConfig[c.status] || statusConfig.NEW;
                  return (
                    <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/admin/complaints/${c.id}`} className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                          {c.title.length > 50 ? c.title.slice(0, 50) + '...' : c.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{c.customer?.name || '-'}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs hidden sm:table-cell">{c.category.name}</td>
                      <td className="px-5 py-3.5">
                        <span className={`status-badge text-[11px] ${sCfg.bg} ${sCfg.text} ${sCfg.border}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className={`text-xs font-semibold ${c.priority === 'HIGH' ? 'text-red-600' : c.priority === 'MEDIUM' ? 'text-orange-600' : 'text-gray-500'}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs hidden lg:table-cell">{c.assignedAdmin?.name || <span className="text-amber-500">Belum assign</span>}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs hidden sm:table-cell">
                        {new Date(c.createdAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
