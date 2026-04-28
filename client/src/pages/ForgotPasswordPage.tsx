import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await authApi.forgotPassword(email); setSent(true); }
    catch (err: any) { setError(err.response?.data?.error || 'Ralat'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl shadow-xl shadow-blue-500/10 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-2xl">🔑</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Lupa Password</h1>
            <p className="text-gray-400 text-sm mt-1">Masukkan email untuk pautan reset</p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pautan Dihantar</h3>
              <p className="text-gray-400 mb-6">Jika email wujud, pautan reset telah dihantar.</p>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Kembali ke Log Masuk</Link>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-4">⚠️ {error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="nama@email.com" required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full text-base">
                  {loading ? '⏳ Menghantar...' : '📤 Hantar Pautan Reset'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm">
                <Link to="/login" className="text-gray-400 hover:text-gray-600">Kembali ke Log Masuk</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
