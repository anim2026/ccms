import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAdmin
    ? [
        { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/admin/complaints', label: 'Semua Aduan', icon: '📋' },
      ]
    : [
        { to: '/dashboard', label: 'Aduan Saya', icon: '📝' },
      ];

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="text-lg font-bold text-gray-900 hidden sm:block">CCMS</span>
              </Link>
              <div className="flex gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.to
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div className="text-xs leading-tight">
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-gray-400">{isAdmin ? 'Admin' : 'Customer'}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                Log Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">{children}</main>
    </div>
  );
}
