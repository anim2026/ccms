import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintApi, Complaint } from '../api/complaints';
import { adminApi } from '../api/admin';
import Layout from '../components/Layout';

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  NEW: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  RESOLVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  CLOSED: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadComplaint();
    adminApi.getCategories().then((res) => setCategories(res.data));
  }, [id]);

  const loadComplaint = async () => {
    try {
      const res = await complaintApi.getById(id!);
      setComplaint(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setCategoryId(res.data.categoryId);
      setPriority(res.data.priority);
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await complaintApi.update(id!, { title, description, categoryId, priority });
      setComplaint(res.data);
      setEditing(false);
      setSuccess('Aduan berjaya dikemaskini!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ralat mengemaskini');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Anda pasti mahu padam aduan ini? Tindakan ini tidak boleh undo.')) return;
    try {
      await complaintApi.delete(id!);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ralat memadam');
    }
  };

  if (loading) return <Layout><div className="max-w-3xl mx-auto"><div className="skeleton rounded-2xl h-64" /></div></Layout>;
  if (!complaint) return <Layout><p className="text-gray-500">Aduan tidak dijumpai.</p></Layout>;

  const sCfg = statusConfig[complaint.status] || statusConfig.NEW;
  const canEdit = complaint.status !== 'CLOSED';
  const canDelete = complaint.status === 'NEW';

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-slide-up">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
          <span className="text-lg">←</span> Kembali ke senarai
        </button>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm mb-4">⚠️ {error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-sm mb-4">✅ {success}</div>}

        {editing ? (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">✏️ Kemaskini Aduan</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tajuk</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="input-field resize-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary text-sm">💾 Simpan</button>
                <button type="button" onClick={() => { setEditing(false); setError(''); }} className="btn-secondary text-sm">Batal</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between items-start gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">{complaint.title}</h1>
              <div className="flex gap-2 shrink-0">
                <span className={`status-badge ${sCfg.bg} ${sCfg.text} ${sCfg.border}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
                <span className={`status-badge ${complaint.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : complaint.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {complaint.priority}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{complaint.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Kategori</div>
                <div className="font-semibold text-gray-900">📂 {complaint.category.name}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Tarikh</div>
                <div className="font-semibold text-gray-900">📅 {new Date(complaint.createdAt).toLocaleDateString('ms-MY')}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Dikemaskini</div>
                <div className="font-semibold text-gray-900">🕐 {new Date(complaint.updatedAt).toLocaleDateString('ms-MY')}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Admin</div>
                <div className="font-semibold text-gray-900">{complaint.assignedAdmin ? `👤 ${complaint.assignedAdmin.name}` : 'Belum di-assign'}</div>
              </div>
            </div>

            {(canEdit || canDelete) && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                {canEdit && <button onClick={() => setEditing(true)} className="btn-primary text-sm">✏️ Kemaskini</button>}
                {canDelete && <button onClick={handleDelete} className="btn-danger text-sm">🗑️ Padam</button>}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
