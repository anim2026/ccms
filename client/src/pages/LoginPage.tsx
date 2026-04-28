import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ralat log masuk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-20 animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply opacity-20 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl shadow-xl shadow-blue-500/10 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-2xl">CC</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Log Masuk CCMS</h1>
            <p className="text-gray-400 text-sm mt-1">Customer Complaint Management System</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-4 flex items-center gap-2 animate-fade-in">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="nama@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-base">
              {loading ? 'Log Masuk...' : 'Log Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <p><Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Daftar Akaun Baru</Link></p>
            <p><Link to="/forgot-password" className="text-gray-400 hover:text-gray-600">Lupa Password?</Link></p>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Demo Akses Taman Villa Damai</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded-lg p-2.5 shadow-sm">
                <div className="font-semibold text-gray-900">Admin MPKj</div>
                <div className="text-gray-400">admin@ccms.local</div>
                <div className="text-gray-400">admin123</div>
              </div>
              <div className="bg-white rounded-lg p-2.5 shadow-sm">
                <div className="font-semibold text-gray-900">Penduduk</div>
                <div className="text-gray-400">rahim@villa.local</div>
                <div className="text-gray-400">admin123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
