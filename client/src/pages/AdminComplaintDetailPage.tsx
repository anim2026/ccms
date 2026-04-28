import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi, Admin } from '../api/admin';
import { Complaint } from '../api/complaints';
import Layout from '../components/Layout';

const statusColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  NEW: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', icon: '🟡' },
  IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: '🔵' },
  RESOLVED: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', icon: '✅' },
  CLOSED: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', icon: '🔒' },
};

const statusOptions = [
  { value: 'NEW', label: 'New', icon: '🟡' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: '🔵' },
  { value: 'RESOLVED', label: 'Resolved', icon: '✅' },
  { value: 'CLOSED', label: 'Closed', icon: '🔒' },
];

export default function AdminComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pendingStatus, setPendingStatus] = useState<string>('');
  const [pendingAdminId, setPendingAdminId] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    try {
      const [compRes, adminsRes] = await Promise.all([
        adminApi.getAllComplaints({ limit: 200 }),
        adminApi.getAdmins(),
      ]);
      const found = compRes.data.data.find((c) => c.id === id);
      if (!found) { navigate('/admin/complaints'); return; }
      setComplaint(found);
      setAdmins(adminsRes.data);
      setPendingStatus(found.status);
      setPendingAdminId(found.assignedAdminId || '');
    } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setError('');
    try {
      await adminApi.complainUpdate(id!, {
        status: pendingStatus !== complaint?.status ? pendingStatus : undefined,
        assignedAdminId: pendingAdminId || undefined,
      });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ralat mengemaskini');
    } finally { setSaving(false); }
  };

  if (loading) return <Layout><div className="max-w-4xl mx-auto"><div className="skeleton rounded-2xl h-80" /></div></Layout>;
  if (!complaint) return <Layout><p className="text-gray-500">Aduan tidak dijumpai.</p></Layout>;

  const sCfg = statusColors[complaint.status] || statusColors.NEW;
  const hasChanges = pendingStatus !== complaint.status || pendingAdminId !== (complaint.assignedAdminId || '');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-slide-up">
        <button onClick={() => navigate('/admin/complaints')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
          <span className="text-lg">←</span> Kembali ke senarai
        </button>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm mb-4 animate-fade-in">⚠️ {error}</div>}

        <div className="glass rounded-2xl p-6">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>👤 {complaint.customer?.name}</span>
                <span>📧 {complaint.customer?.email}</span>
              </div>
            </div>
            <span className={`status-badge text-sm ${sCfg.bg} ${sCfg.text} ${sCfg.border}`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">Kategori</div>
              <div className="font-semibold text-gray-900 text-sm">📂 {complaint.category.name}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">Priority</div>
              <div className={`font-semibold text-sm ${complaint.priority === 'HIGH' ? 'text-red-600' : complaint.priority === 'MEDIUM' ? 'text-orange-600' : 'text-gray-600'}`}>
                {complaint.priority === 'HIGH' ? '🔴' : complaint.priority === 'MEDIUM' ? '🟠' : '🟢'} {complaint.priority}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">Tarikh</div>
              <div className="font-semibold text-gray-900 text-sm">
                📅 {new Date(complaint.createdAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">Admin</div>
              <div className="font-semibold text-gray-900 text-sm">
                {complaint.assignedAdmin ? `👤 ${complaint.assignedAdmin.name}` : 'Belum di-assign'}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🔄</span> Tukar Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((opt) => {
                    const isSelected = pendingStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPendingStatus(opt.value)}
                        className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-medium border transition-all duration-200 ${
                          isSelected
                            ? `${statusColors[opt.value].bg} ${statusColors[opt.value].text} ${statusColors[opt.value].border} ring-2 ring-offset-1`
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <span>{opt.icon}</span> {opt.label}
                      </button>
                    );
                  })}
                </div>
                {pendingStatus !== complaint.status && (
                  <p className="text-xs text-gray-400 mt-2">
                    Status akan ditukar dari <span className="font-semibold">{complaint.status.replace('_', ' ')}</span> ke <span className="font-semibold">{pendingStatus.replace('_', ' ')}</span>
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>👤</span> Assign Admin
                </h3>
                <select
                  value={pendingAdminId}
                  onChange={(e) => setPendingAdminId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Pilih Admin...</option>
                  {admins.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                  ))}
                </select>
                {!pendingAdminId && complaint.assignedAdminId && (
                  <p className="text-xs text-amber-500 mt-2">Admin akan dinyah-assign.</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleUpdate}
                disabled={saving || !hasChanges}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '⏳ Mengemaskini...' : '💾 Kemaskini'}
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="btn-secondary"
              >
                Batal
              </button>
              {!hasChanges && (
                <span className="text-xs text-gray-400">Tiada perubahan</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
