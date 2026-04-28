import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, Dashboard } from '../api/admin';
import { Complaint } from '../api/complaints';
import Layout from '../components/Layout';

const statusBarColor: Record<string, string> = {
  NEW: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  RESOLVED: '#10b981',
  CLOSED: '#6b7280',
};

const statusLabel: Record<string, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    Promise.all([
      adminApi.getDashboard(),
      adminApi.getAllComplaints({ limit: 200 }),
    ])
      .then(([dRes, aRes]) => {
        setDashboard(dRes.data);
        setAllComplaints(aRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="skeleton rounded-2xl h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton rounded-2xl h-28" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="skeleton rounded-2xl h-80 lg:col-span-2" />
            <div className="skeleton rounded-2xl h-80" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!dashboard) return <Layout><p className="text-gray-500">Dashboard tidak tersedia.</p></Layout>;

  const statusMax = Math.max(...Object.values(dashboard.byStatus), 1);
  const priorityMax = Math.max(...Object.values(dashboard.byPriority), 1);
  const resolveRate = dashboard.total > 0 ? Math.round(((dashboard.byStatus.RESOLVED + dashboard.byStatus.CLOSED) / dashboard.total) * 100) : 0;

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-400 mt-1">Ringkasan sistem aduan pelanggan</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Data langsung
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Jumlah Aduan', value: dashboard.total, color: 'from-slate-600 to-slate-700', icon: '📋', sub: `${resolveRate}% selesai` },
            { label: 'New', value: dashboard.byStatus.NEW, color: 'from-amber-400 to-amber-500', icon: '🟡', sub: 'Perlu tindakan' },
            { label: 'In Progress', value: dashboard.byStatus.IN_PROGRESS, color: 'from-blue-500 to-blue-600', icon: '🔵', sub: 'Sedang diproses' },
            { label: 'Resolved', value: dashboard.byStatus.RESOLVED, color: 'from-emerald-500 to-emerald-600', icon: '✅', sub: 'Selesai' },
            { label: 'Closed', value: dashboard.byStatus.CLOSED, color: 'from-gray-400 to-gray-500', icon: '🔒', sub: 'Ditutup' },
          ].map((card) => (
            <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white shadow-lg card-hover`}>
              <div className="text-2xl mb-1">{card.icon}</div>
              <div className="text-3xl font-bold">{card.value}</div>
              <div className="text-sm font-medium opacity-90">{card.label}</div>
              <div className="text-xs opacity-60 mt-1">{card.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Taburan Status Aduan</h2>
              <span className="text-xs text-gray-400">Jumlah: {dashboard.total}</span>
            </div>
            <div className="space-y-4">
              {Object.entries(statusLabel).map(([key, label]) => {
                const val = dashboard.byStatus[key] || 0;
                const pct = (val / dashboard.total) * 100 || 0;
                return (
                  <div key={key} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusBarColor[key] }} />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{val} <span className="text-xs text-gray-400 font-normal">({pct.toFixed(1)}%)</span></span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                        style={{ width: `${(val / statusMax) * 100}%`, backgroundColor: statusBarColor[key] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Mengikut Priority</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                  {(() => {
                    const highPct = (dashboard.byPriority.HIGH / priorityMax) * 100;
                    const medPct = (dashboard.byPriority.MEDIUM / priorityMax) * 100;
                    const lowPct = (dashboard.byPriority.LOW / priorityMax) * 100;
                    const totalPct = highPct + medPct + lowPct;
                    const circum = 2 * Math.PI * 15.5;
                    const offset = (100 - totalPct) / 100 * circum;
                    return (
                      <>
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#ef4444" strokeWidth="4"
                          strokeDasharray={`${(highPct / 100) * circum} ${circum}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-700" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f97316" strokeWidth="4"
                          strokeDasharray={`${(medPct / 100) * circum} ${circum}`}
                          strokeDashoffset={-(offset + (highPct / 100) * circum)}
                          className="transition-all duration-700" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#9ca3af" strokeWidth="4"
                          strokeDasharray={`${(lowPct / 100) * circum} ${circum}`}
                          strokeDashoffset={-(offset + ((highPct + medPct) / 100) * circum)}
                          className="transition-all duration-700" />
                      </>
                    );
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{dashboard.total}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'High', value: dashboard.byPriority.HIGH, color: 'bg-red-500' },
                { label: 'Medium', value: dashboard.byPriority.MEDIUM, color: 'bg-orange-500' },
                { label: 'Low', value: dashboard.byPriority.LOW, color: 'bg-gray-400' },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                    <span className="text-sm text-gray-600">{p.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Aduan Terkini</h2>
            <Link to="/admin/complaints" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua →
            </Link>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 font-medium">Aduan</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Customer</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Kategori</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dashboard.recent.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pr-4">
                      <Link to={`/admin/complaints/${c.id}`} className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
                        {c.title.length > 45 ? c.title.slice(0, 45) + '...' : c.title}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-500 hidden md:table-cell">{c.customer?.name}</td>
                    <td className="py-3 text-gray-400 hidden sm:table-cell">{c.category.name}</td>
                    <td className="py-3">
                      <span className="status-badge bg-blue-50 text-blue-700 border-blue-200 text-[11px]">
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold ${c.priority === 'HIGH' ? 'text-red-600' : c.priority === 'MEDIUM' ? 'text-orange-600' : 'text-gray-500'}`}>
                        {c.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
