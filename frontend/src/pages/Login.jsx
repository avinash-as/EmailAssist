import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Mail } from 'lucide-react';

export default function Login(){
  const {login}=useAuth();
  const nav=useNavigate();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const submit=async(e)=>{ e.preventDefault(); setLoading(true); setErr('');
    try { await login(email,password); nav('/dashboard'); }
    catch(e){ setErr(e.response?.data?.error||'Login failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-[#5e6ad2] flex items-center justify-center"><Mail className="text-white" size={16}/></div>
          <span className="font-semibold text-[var(--text)]">EmailAssist</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Log in to your account</p>
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          {err && <p className="text-sm text-[#f87171]">{err}</p>}
          <Button className="w-full" disabled={loading}>{loading?'Logging in...':'Log in'}</Button>
        </form>
        <p className="text-sm text-[var(--muted)] mt-6 text-center">No account? <Link to="/signup" className="text-[var(--accent-text)] hover:underline">Sign up</Link></p>
      </Card>
    </div>
  );
}



