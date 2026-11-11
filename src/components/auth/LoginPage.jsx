import React, { useState } from 'react';
import { ShieldCheck, LockKeyhole, Mail } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try { await onLogin(email, password); }
    catch (err) { setError(err.message || 'Unable to sign in.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center"><ShieldCheck className="w-7 h-7" /></div>
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">NexusAdmin</h1>
        <p className="text-sm text-center text-slate-500 mt-2 mb-7">Sign in with your Shop.Co administrator account</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email
            <span className="relative block mt-1"><Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@example.com" /></span>
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password
            <span className="relative block mt-1"><LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your admin password" /></span>
          </label>
          {error && <p className="text-sm text-rose-600 bg-rose-50 rounded-lg p-3">{error}</p>}
          <button disabled={busy} className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold">{busy ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}
