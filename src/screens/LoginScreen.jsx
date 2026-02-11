import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function LoginScreen() {
  const [email, setEmail] = useState('admin@structra.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8f9fb' }}>

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Top: wordmark */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#6366f1' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M4 7h16M4 12h10M4 17h13" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Structra Studio</span>
        </div>

        {/* Middle: value prop */}
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ backgroundColor: '#1e293b', color: '#94a3b8' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#22c55e' }}
            />
            Design-first data transformation
          </div>
          <h2
            className="text-4xl font-bold leading-tight mb-4"
            style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}
          >
            Model your data<br />
            before you build it.
          </h2>
          <p style={{ color: '#64748b', lineHeight: '1.7' }} className="text-sm max-w-sm">
            A structured workspace where analysts, engineers, and architects
            align on transformation logic before any pipeline is written.
          </p>

          {/* Stat strip */}
          <div className="flex items-center gap-8 mt-10">
            {[
              { value: '3×', label: 'Faster pipeline delivery' },
              { value: '90%', label: 'Fewer rework cycles' },
              { value: '100%', label: 'Team alignment' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: testimonial */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#1e293b', borderLeft: '3px solid #6366f1' }}
        >
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#cbd5e1' }}>
            "Structra cut our ETL design phase from weeks to days. Everyone
            finally speaks the same language."
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: '#6366f1' }}
            >
              SK
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>Thrilok Madduru</p>
              <p className="text-xs" style={{ color: '#475569' }}>Sr. Data Analyst & Product Designer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#6366f1' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7h16M4 12h10M4 17h13" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">Structra Studio</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5" style={{ letterSpacing: '-0.02em' }}>
              Sign in to your account
            </h1>
            <p className="text-sm text-gray-500">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-600 text-xs">Remember me</span>
              </label>
              <a href="#" className="text-xs font-medium" style={{ color: '#6366f1' }}>
                Forgot password?
              </a>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">test accounts</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo credentials */}
          <div
            className="rounded-lg p-4 space-y-2"
            style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            {[
              { email: 'admin@structra.com',    pass: 'password123' },
              { email: 'designer@structra.com', pass: 'design123'   },
              { email: 'analyst@structra.com',  pass: 'analyst123'  },
            ].map(cred => (
              <button
                key={cred.email}
                type="button"
                onClick={() => { setEmail(cred.email); setPassword(cred.pass); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs hover:bg-white transition-colors text-left group"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <span className="font-medium text-gray-700">{cred.email}</span>
                <span className="text-gray-400 group-hover:text-gray-600">{cred.pass}</span>
              </button>
            ))}
          </div>

          {/* Sign up */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Don't have an account?{' '}
            <a href="#" className="font-semibold" style={{ color: '#6366f1' }}>
              Request access
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-12">
          © 2026 Structra Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;