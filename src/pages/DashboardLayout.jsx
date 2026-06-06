import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';

export default function DashboardLayout() {
  const [matchmaker, setMatchmaker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('matchmaker');
    if (!stored) {
      navigate('/');
      return;
    }
    setMatchmaker(JSON.parse(stored));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('matchmaker');
    navigate('/');
  }

  if (!matchmaker) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="tdc-gradient shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <span className="absolute top-2 left-1/4 animate-floatHeart">🤍</span>
          <span className="absolute bottom-2 right-1/4 animate-heartbeat" style={{ animationDelay: '0.7s' }}>🤍</span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ letterSpacing: '-0.02em' }}
            >
              <span className="text-tdc-gold-400">🤍</span>
              <span>
                TDC <span className="gold-text">Matchmaker</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-tdc-green-200">
                Welcome,{' '}
                <span className="font-medium text-white">
                  {matchmaker.name}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg transition-all text-tdc-green-200 hover:text-white hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
