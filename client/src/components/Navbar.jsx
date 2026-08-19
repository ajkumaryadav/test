import React from 'react';
import { Database, ShieldCheck, UserCheck } from 'lucide-react';

export default function Navbar({ user, dbStatus }) {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              SecureAuth <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">PG</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Node + React + PostgreSQL
            </span>
          </div>
        </div>

        {/* Database Status Badge */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 shadow-inner">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>PostgreSQL:</span>
            {dbStatus === 'connected' ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            ) : dbStatus === 'checking' ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Offline
              </span>
            )}
          </div>

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-200 font-medium">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
