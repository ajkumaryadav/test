import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const styles = {
    error: 'bg-rose-950/70 border-rose-500/40 text-rose-200',
    success: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200',
    info: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-200',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
  };

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md animate-fade-in ${styles[type] || styles.error}`}>
      {icons[type] || icons.error}
      <div className="flex-1 text-sm leading-relaxed font-medium">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
