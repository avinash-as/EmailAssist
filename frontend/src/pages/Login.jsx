import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false);
  const {login}=useAuth(); const nav=useNavigate();
  const submit=async(e)=>{e.preventDefault();setLoading(true);setErr('');
    try{const u=await login(email,password); nav(u.role==='client'?'/client':'/dashboard');}
    catch(e){setErr(e.response?.data?.error||'Login failed');}
    finally{setLoading(false);}
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">Log in to your account</p>
        {err && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <Button className="w-full" disabled={loading}>{loading?'Logging in...':'Log in'}</Button>
        </form>
        <p className="text-sm text-slate-500 mt-4">No account? <Link to="/signup" className="text-indigo-600">Sign up</Link></p>
      </Card>
    </div>
  );
}