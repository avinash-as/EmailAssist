import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';

export default function Signup(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [role,setRole]=useState('assistant'); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false);
  const {signup}=useAuth(); const nav=useNavigate();
  const submit=async(e)=>{e.preventDefault();setLoading(true);setErr('');
    try{const u=await signup(name,email,password,role); nav(role==='client'?'/client':'/connect');}
    catch(e){setErr(e.response?.data?.error||'Signup failed');}
    finally{setLoading(false);}
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Join PA Mail</p>
        {err && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>
          <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <div className="flex gap-3">
            <label className={`flex-1 border rounded-lg p-3 cursor-pointer text-sm ${role==='assistant'?'border-indigo-500 bg-indigo-50':'border-slate-300'}`}><input type="radio" className="mr-2" checked={role==='assistant'} onChange={()=>setRole('assistant')}/>Assistant</label>
            <label className={`flex-1 border rounded-lg p-3 cursor-pointer text-sm ${role==='client'?'border-indigo-500 bg-indigo-50':'border-slate-300'}`}><input type="radio" className="mr-2" checked={role==='client'} onChange={()=>setRole('client')}/>Client</label>
          </div>
          <Button className="w-full" disabled={loading}>{loading?'Creating...':'Sign up'}</Button>
        </form>
        <p className="text-sm text-slate-500 mt-4">Have account? <Link to="/login" className="text-indigo-600">Log in</Link></p>
      </Card>
    </div>
  );
}