import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import matchmakers from '@/data/matchmakers';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    setError('');

    const registered = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );
    const allUsers = [...matchmakers, ...registered];
    const matchmaker = allUsers.find(
      (m) => m.username === username && m.password === password
    );

    if (matchmaker) {
      localStorage.setItem('matchmaker', JSON.stringify(matchmaker));
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  }

  return (
    <div
      className="flex flex-1 items-center justify-center min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(140deg, #e8f2f0 0%, #f9efe1 100%)',
      }}
    >
      <div className="hearts-bg">
        <span style={{ top: '10%', left: '5%', animationDelay: '0s' }}>🤍</span>
        <span style={{ top: '20%', right: '10%', animationDelay: '0.5s' }}>🤍</span>
        <span style={{ top: '50%', left: '8%', animationDelay: '1s' }}>🤍</span>
        <span style={{ top: '70%', right: '5%', animationDelay: '1.5s' }}>🤍</span>
        <span style={{ top: '85%', left: '15%', animationDelay: '2s' }}>🤍</span>
        <span style={{ top: '30%', right: '3%', animationDelay: '0.8s' }}>🤍</span>
      </div>

      <div className="w-full max-w-md mx-4 animate-fadeInUp relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-tdc-gold-200 overflow-hidden">
          <div className="tdc-gradient p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <span className="absolute top-2 left-4 animate-floatHeart">🤍</span>
              <span className="absolute top-4 right-6 animate-heartbeat" style={{ animationDelay: '0.5s' }}>🤍</span>
            </div>
            <div className="text-tdc-gold-400 text-4xl mb-2 animate-heartbeat">🤍</div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              TDC Matchmaker
            </h1>
            <p className="text-tdc-green-200 text-sm mt-1">
              Sign in to your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-tdc-green-200 rounded-lg focus:ring-2 focus:ring-tdc-gold-400 focus:border-tdc-gold-400 outline-none transition-all"
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-tdc-green-200 rounded-lg focus:ring-2 focus:ring-tdc-gold-400 focus:border-tdc-gold-400 outline-none transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fadeIn">
                {error}
              </div>
            )}

            <button type="submit" className="tdc-btn w-full justify-center">
              Sign In
            </button>

            <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-4">
              <span className="text-gray-500">
                Don't have an account?{' '}
              </span>
              <Link
                to="/signup"
                className="text-tdc-gold-600 hover:text-tdc-gold-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
