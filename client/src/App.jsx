import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { api, setAuthToken } from './api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('checking');

  // Initial user & DB health check
  useEffect(() => {
    async function initAuth() {
      try {
        // Check DB health
        const health = await api.checkHealth();
        if (health && health.status === 'healthy') {
          setDbStatus('connected');
        } else {
          setDbStatus('error');
        }

        // Check if there is an existing session
        const currentUser = await api.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setDbStatus('error');
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-slate-400">Loading SecureAuth...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-radial-glow text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Header Navigation */}
      <Navbar user={user} dbStatus={dbStatus} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {user ? (
          // Authenticated Dashboard / Welcome Screen
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          // Unauthenticated Login / Register Screen
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </main>

      {/* Modern Sleek Footer */}
      <footer className="w-full py-4 border-t border-slate-900/80 bg-slate-950/60 backdrop-blur-md text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Node.js Express + React + PostgreSQL + Tailwind CSS</span>
          <span className="text-slate-600">Database: postgresql://postgres:***@localhost:5432/test</span>
        </div>
      </footer>
    </div>
  );
}
