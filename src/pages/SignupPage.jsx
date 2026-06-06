import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import matchmakers from '@/data/matchmakers';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSignup(e) {
    e.preventDefault();
    setError('');

    const existing = [
      ...matchmakers,
      ...(JSON.parse(localStorage.getItem('registeredUsers') || '[]')),
    ];
    if (existing.find((m) => m.username === username)) {
      setError('Username already taken');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const newUser = {
      id: 'mm-' + Date.now(),
      username,
      password,
      name,
    };
    const registered = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );
    registered.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registered));
    localStorage.setItem('matchmaker', JSON.stringify(newUser));
    navigate('/dashboard');
  }

  return (
    <div
      className="flex flex-1 items-center justify-center min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(140deg, #e8f2f0 0%, #f9efe1 100%)',
      }}
    >
      <div className="hearts-bg">
        <span style={{ top: '15%', left: '8%', animationDelay: '0.2s' }}>🤍</span>
        <span style={{ top: '30%', right: '12%', animationDelay: '0.7s' }}>🤍</span>
        <span style={{ top: '60%', left: '5%', animationDelay: '1.2s' }}>🤍</span>
        <span style={{ top: '75%', right: '8%', animationDelay: '1.8s' }}>🤍</span>
        <span style={{ top: '90%', left: '20%', animationDelay: '2.2s' }}>🤍</span>
      </div>

      <div className="w-full max-w-md mx-4 animate-fadeInUp relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-tdc-gold-200 overflow-hidden">
          <div className="tdc-gradient p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <span className="absolute top-2 right-4 animate-floatHeart" style={{ animationDelay: '0.3s' }}>🤍</span>
              <span className="absolute top-4 left-6 animate-heartbeat">🤍</span>
            </div>
            <div className="text-tdc-gold-400 text-4xl mb-2 animate-heartbeat">🤍</div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              TDC Matchmaker
            </h1>
            <p className="text-tdc-green-200 text-sm mt-1">
              Create your account
            </p>
          </div>

          <form onSubmit={handleSignup} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-tdc-green-200 rounded-lg focus:ring-2 focus:ring-tdc-gold-400 focus:border-tdc-gold-400 outline-none transition-all"
                placeholder="Enter your name"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-tdc-green-200 rounded-lg focus:ring-2 focus:ring-tdc-gold-400 focus:border-tdc-gold-400 outline-none transition-all"
                placeholder="Choose a username"
                required
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
                placeholder="Choose a password (min 4 characters)"
                required
                minLength={4}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fadeIn">
                {error}
              </div>
            )}

            <button type="submit" className="tdc-btn w-full justify-center">
              Create Account
            </button>

            <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-4">
              <span className="text-gray-500">
                Already have an account?{' '}
              </span>
              <Link
                to="/"
                className="text-tdc-gold-600 hover:text-tdc-gold-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
