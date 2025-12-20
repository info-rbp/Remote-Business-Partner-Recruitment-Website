
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const success = login(email, password);
    if (success) {
        navigate('/platform');
    } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-left">
           <div className="p-8">
              <Link to="/" className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors text-left">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
              </Link>
              <div className="mb-8 text-center text-left">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 mx-auto mb-4">R</div>
                  <h1 className="text-2xl font-bold text-slate-900 text-left mx-auto text-center">Admin Login</h1>
                  <p className="text-slate-500 mt-2 text-center">Sign in to access the dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center justify-center">{error}</div>}
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" value={email} onChange={e => setEmail(e.target.value)} /></div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" value={password} onChange={e => setPassword(e.target.value)} /></div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">{loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}</button>
              </form>
           </div>
           <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">Protected System &bull; Authorized Personnel Only</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
