import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/common/Button.js';
import { Mail, Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(redirectPath);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-violet-600/30">
            CP
          </div>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">Welcome to CinePulse</h1>
        <p className="text-xs text-slate-400">Sign in to book tickets, manage reservations, and unlock offers.</p>
      </div>

      {/* Demo Account Pills */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span>Quick Demo Credentials</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => autofillDemo('admin@example.com', 'Admin@123')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
          >
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>Admin Demo</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">admin@example.com</div>
          </button>

          <button
            type="button"
            onClick={() => autofillDemo('rahul.sharma@example.com', 'User@123')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
          >
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>User Demo</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">rahul.sharma@...</div>
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-violet-400 font-bold hover:underline"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};
