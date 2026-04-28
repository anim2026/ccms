import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintApi } from '../api/complaints';
import Layout from '../components/Layout';

export default function CreateComplaintPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    complaintApi.getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setError('Gagal memuatkan senarai kategori'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await complaintApi.create({ title, description, categoryId, priority });
      setShowModal(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ralat mencipta aduan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all">←</button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aduan Baru</h1>
            <p className="text-gray-400 text-sm">Isi butiran aduan dengan lengkap</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm mb-6 flex items-center gap-2 animate-fade-in">
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="text-red-400 mr-1">*</span>Tajuk Aduan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Contoh: Sampah tidak dikutip di Jalan Dahlia 3"
                required
                minLength={3}
              />
              <p className="text-xs text-gray-400 mt-1">{title.length}/3 minimum aksara</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="text-red-400 mr-1">*</span>Deskripsi Terperinci
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="input-field resize-none"
                placeholder="Terangkan masalah anda dengan terperinci. Sertakan tarikh, lokasi, dan sebarang bukti berkaitan..."
                required
                minLength={10}
              />
              <p className="text-xs text-gray-400 mt-1">{description.length}/10 minimum aksara</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="text-red-400 mr-1">*</span>Kategori Aduan
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Pilih Kategori Aduan</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <div className="flex gap-2">
                  {[
                    { value: 'LOW', label: 'Low', color: 'border-gray-300 text-gray-600 bg-gray-50', active: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
                    { value: 'MEDIUM', label: 'Medium', color: 'border-gray-300 text-gray-600 bg-gray-50', active: 'border-orange-400 bg-orange-50 text-orange-700' },
                    { value: 'HIGH', label: 'High', color: 'border-gray-300 text-gray-600 bg-gray-50', active: 'border-red-400 bg-red-50 text-red-700' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        priority === opt.value ? opt.active : opt.color
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? '⏳ Menghantar...' : '📤 Hantar Aduan'}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-slide-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aduan Telah Direkod</h2>
            <p className="text-gray-500 text-sm mb-6">
              Aduan anda telah berjaya dihantar dan sedang diproses.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
