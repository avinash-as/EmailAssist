import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Mail } from 'lucide-react';

export default function Signup(){
  const {signup}=useAuth();
  const nav=useNavigate();
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('assistant');
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const submit=async(e)=>{ e.preventDefault(); setLoading(true); setErr('');
    try { await signup(name,email,password,role); nav(role==='client'?'/client':'/connect'); }
    catch(e){ setErr(e.response?.data?.error||'Signup failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090a] px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-[#5e6ad2] flex items-center justify-center"><Mail className="text-white" size={16}/></div>
          <span className="font-semibold text-[#f7f8f8]">EmailAssist</span>
        </div>
        <h1 className="text-2xl font-bold text-[#f7f8f8] mb-1">Create account</h1>
        <p className="text-sm text-[#8a8f98] mb-6">Join EmailAssist</p>
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>
          <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <div className="flex gap-3">
            <label className={`flex-1 border rounded-md p-3 cursor-pointer text-sm transition ${role==='assistant'?'border-[#5e6ad2] bg-[#1e1f2e] text-[#a5adff]':'border-[#26272b] text-[#b4b4b4] hover:border-[#3a3b4f]'}`}><input type="radio" className="mr-2 accent-[#5e6ad2]" checked={role==='assistant'} onChange={()=>setRole('assistant')}/>Assistant</label>
            <label className={`flex-1 border rounded-md p-3 cursor-pointer text-sm transition ${role==='client'?'border-[#5e6ad2] bg-[#1e1f2e] text-[#a5adff]':'border-[#26272b] text-[#b4b4b4] hover:border-[#3a3b4f]'}`}><input type="radio" className="mr-2 accent-[#5e6ad2]" checked={role==='client'} onChange={()=>setRole('client')}/>Client</label>
          </div>
          {err && <p className="text-sm text-[#f87171]">{err}</p>}
          <Button className="w-full" disabled={loading}>{loading?'Creating...':'Sign up'}</Button>
        </form>
        <p className="text-sm text-[#8a8f98] mt-6 text-center">Have account? <Link to="/login" className="text-[#a5adff] hover:underline">Log in</Link></p>
      </Card>
    </div>
  );
}