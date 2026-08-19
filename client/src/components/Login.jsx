import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, Sparkles, ArrowRight, Loader2, Database } from 'lucide-react';
import { api, setAuthToken } from '../api';
import Alert from './Alert';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        const data = await api.register(name, email, password);
        setAuthToken(data.token);
        onLoginSuccess(data.user);
      } else {
        const data = await api.login(email, password);
        setAuthToken(data.token);
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setIsRegister(false);
    setEmail('admin@example.com');
    setPassword('admin123');
    setAlert({
      type: 'info',
      message: 'Demo credentials loaded! Click "Sign In to Dashboard" to log in.',
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-0 animate-slide-up">
      {/* Decorative Glow Circle */}
      <div className="relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Container */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-slate-700/60">
          
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] mb-4 shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                {isRegister ? (
                  <UserPlus className="w-7 h-7 text-emerald-400" />
                ) : (
                  <LogIn className="w-7 h-7 text-emerald-400" />
                )}
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isRegister ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              {isRegister
                ? 'Sign up to connect to your PostgreSQL database'
                : 'Enter your credentials to access your dashboard'}
            </p>
          </div>

          {/* Alert Message */}
          {alert && (
            <div className="mb-5">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input (Register mode) */}
            {isRegister && (
              <div className="animate-fade-in">
                <label
                  htmlFor="fullname"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="fullname"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  enterKeyHint="done"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit-auth-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill & Toggle Mode */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col gap-3">
            <button
              id="demo-fill-btn"
              type="button"
              onClick={fillDemoAccount}
              className="w-full py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 text-xs font-medium text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Auto-Fill Demo Credentials (admin@example.com / admin123)</span>
            </button>

            <div className="text-center">
              <button
                id="toggle-auth-mode-btn"
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setAlert(null);
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 font-medium transition-colors"
              >
                {isRegister
                  ? 'Already have an account? Sign In instead'
                  : "Don't have an account? Sign Up now"}
              </button>
            </div>
          </div>
        </div>

        {/* PostgreSQL Database URL Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
            <Database className="w-3 h-3 text-slate-400" />
            <span>DB: postgresql://postgres:***@localhost:5432/test</span>
          </p>
        </div>
      </div>
    </div>
  );
}
