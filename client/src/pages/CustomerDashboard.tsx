import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi, Complaint } from '../api/complaints';
import Layout from '../components/Layout';

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  NEW: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  RESOLVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  CLOSED: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
};

const priorityConfig: Record<string, { bg: string; text: string; icon: string }> = {
  HIGH: { bg: 'bg-red-50', text: 'text-red-700', icon: '🔴' },
  MEDIUM: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🟠' },
  LOW: { bg: 'bg-gray-50', text: 'text-gray-600', icon: '🟢' },
};

export default function CustomerDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    complaintApi
      .getMy(page, limit)
      .then((res) => {
        setComplaints(res.data.data);
        setTotal(res.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    complaintApi.getMy(1, 100).then((res) => {
      const s: Record<string, number> = {};
      res.data.data.forEach((c) => { s[c.status] = (s[c.status] || 0) + 1; });
      setStats(s);
    });
  }, []);

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <div className="mb-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Aduan Saya</h1>
            <p className="text-gray-400 mt-1">Jejak dan urus semua aduan anda</p>
          </div>
          <Link to="/complaints/new" className="btn-primary flex items-center gap-2 text-sm">
            <span className="text-lg">+</span> Aduan Baru
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Jumlah', value: total, color: 'from-blue-500 to-blue-600', icon: '📋' },
            { label: 'New', value: stats.NEW || 0, color: 'from-amber-500 to-amber-600', icon: '🟡' },
            { label: 'In Progress', value: stats.IN_PROGRESS || 0, color: 'from-blue-500 to-indigo-600', icon: '🔵' },
            { label: 'Resolved', value: (stats.RESOLVED || 0) + (stats.CLOSED || 0), color: 'from-emerald-500 to-emerald-600', icon: '✅' },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-lg`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton rounded-2xl h-28" />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tiada Aduan</h3>
          <p className="text-gray-400 mb-6">Anda belum menghantar sebarang aduan</p>
          <Link to="/complaints/new" className="btn-primary text-sm">+ Hantar Aduan Pertama</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c, i) => {
            const sCfg = statusConfig[c.status] || statusConfig.NEW;
            const pCfg = priorityConfig[c.priority] || priorityConfig.MEDIUM;
            return (
              <Link
                key={c.id}
                to={`/complaints/${c.id}`}
                className="card-hover glass rounded-2xl p-5 block animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-semibold text-gray-900 truncate text-lg">{c.title}</h2>
                      <span className={`status-badge ${sCfg.bg} ${sCfg.text} ${sCfg.border} flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{c.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">📂 {c.category.name}</span>
                      <span className="flex items-center gap-1">
                        <span className={pCfg.text}>{pCfg.icon}</span> {c.priority}
                      </span>
                      <span>📅 {new Date(c.createdAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <span className="text-gray-300 text-xl">›</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                page === i + 1
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Layout>
  );
}
