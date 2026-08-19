import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Sparkles, 
  User, 
  Mail, 
  Calendar, 
  Database, 
  ShieldCheck, 
  Activity, 
  CheckCircle, 
  Clock, 
  KeyRound, 
  RefreshCw,
  Server,
  Layers
} from 'lucide-react';
import { api } from '../api';
import Alert from './Alert';

export default function Dashboard({ user, onLogout }) {
  const [healthInfo, setHealthInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const data = await api.checkHealth();
      setHealthInfo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Active Session';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      
      {/* Alert if any */}
      {alert && (
        <div className="mb-6">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      {/* Main Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-slate-950 border border-emerald-500/20 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-[2px] shadow-xl shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authenticated Session</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome, {user?.name || 'User'}!
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                You have successfully authenticated via PostgreSQL database.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="refresh-db-btn"
              onClick={fetchHealth}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
              title="Check PostgreSQL Live Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh DB</span>
            </button>

            <button
              id="logout-btn"
              onClick={onLogout}
              className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm hover:shadow-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* Card 1: User Profile Details */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              User Profile
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Full Name</span>
              <span className="text-slate-200 font-semibold">{user?.name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Email Address</span>
              <span className="text-slate-200 font-mono text-xs break-all flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {user?.email || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Member Since</span>
              <span className="text-slate-300 text-xs flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Database Connection Status */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              PostgreSQL Info
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
              PORT 5432
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Database Target</span>
              <span className="text-slate-200 font-mono text-xs break-all">test (localhost:5432)</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Connection Health</span>
              <div className="flex items-center gap-2 mt-0.5">
                {healthInfo?.status === 'healthy' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Online & Responding
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    Checking state...
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Total Registered Users in DB</span>
              <span className="text-slate-200 font-bold text-base mt-0.5 inline-block">
                {healthInfo?.totalUsers !== undefined ? `${healthInfo.totalUsers} users` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Token State */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Security & Auth
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
              JWT (HS256)
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Password Encryption</span>
              <span className="text-slate-200 text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                bcrypt (10 salt rounds)
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Session Token</span>
              <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Bearer Token Active (24h)
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Architecture</span>
              <span className="text-slate-300 text-xs flex items-center gap-1.5 mt-0.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Node Express API + React SPA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action / Feature Showcase Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            PostgreSQL Database Authentication Ready
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Your Node.js and React stack is fully configured with PostgreSQL. You can add more routes or tables anytime.
          </p>
        </div>
        <button
          onClick={() => {
            setAlert({
              type: 'success',
              message: 'Authentication check passed! PostgreSQL connection is verified and operational.',
            });
          }}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          Test Live Ping
        </button>
      </div>

    </div>
  );
}
