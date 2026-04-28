import { useState, FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Password tidak sepadan.'); return; }
    setLoading(true);
    try { await authApi.resetPassword(token, password); setSuccess(true); }
    catch (err: any) { setError(err.response?.data?.error || 'Ralat reset password.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl shadow-xl shadow-blue-500/10 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-2xl">🔒</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Set Semula Password</h1>
          </div>

          {!token ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">Token tidak sah.</p>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">Minta pautan baru</Link>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Berjaya!</h3>
              <p className="text-gray-400 mb-6">Password anda telah diset semula.</p>
              <Link to="/login" className="btn-primary text-sm">Log Masuk</Link>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-4">⚠️ {error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10" placeholder="Minimum 6 aksara" required minLength={6} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sahkan Password</label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field pl-10" placeholder="Tulis semula password" required minLength={6} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full text-base">
                  {loading ? '⏳ Menyimpan...' : '💾 Set Semula Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
