import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('Token tidak disertakan.'); return; }
    authApi.verifyEmail(token)
      .then(() => { setStatus('success'); setMessage('Email berjaya disahkan!'); })
      .catch((err) => { setStatus('error'); setMessage(err.response?.data?.error || 'Ralat pengesahan.'); });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl shadow-xl shadow-blue-500/10 p-8 text-center">
          {status === 'loading' && (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mengesahkan...</h2>
              <p className="text-gray-400">Sila tunggu sebentar</p>
            </div>
          )}
          {status === 'success' && (
            <div>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Berjaya!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link to="/login" className="btn-primary text-sm">Log Masuk</Link>
            </div>
          )}
          {status === 'error' && (
            <div>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-4xl">❌</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Kembali ke Log Masuk</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
