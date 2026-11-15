import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Button, Card, Spinner } from '../components/ui';
import { Mail, CheckCircle2 } from 'lucide-react';

const providers = [
  {id:'gmail', name:'Gmail', color:'bg-red-500'},
  {id:'outlook', name:'Outlook / Microsoft', color:'bg-blue-600'},
];

export default function ConnectEmail(){
  const [step,setStep]=useState('choose'); // choose, connecting, done
  const [provider,setProvider]=useState(null);
  const [email,setEmail]=useState('');
  const [status,setStatus]=useState('');
  const nav=useNavigate();
  const connect=async(p)=>{
    setProvider(p); setStep('connecting');
    try {
      const accEmail = email || `demo${p.id}@example.com`;
      const r = await api.post('/accounts/connect',{provider:p.id,email:accEmail});
      // poll status
      await new Promise(res=>setTimeout(res,1800));
      setStatus('Syncing emails...');
      await api.post('/seed/demo');
      setStep('done');
    } catch(e){ setStatus(e.response?.data?.error||'Connection failed'); setStep('choose'); }
  };
  if(step==='done') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48}/>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Email connected</h1>
        <p className="text-sm text-slate-500 mb-6">Your inbox is synced and AI has classified your conversations.</p>
        <Button onClick={()=>nav('/dashboard')}>Go to Dashboard</Button>
      </Card>
    </div>
  );
  if(step==='connecting') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <Spinner/>
        <h1 className="text-xl font-bold text-slate-800 mt-4">Connecting to {provider?.name}...</h1>
        <p className="text-sm text-slate-500 mt-2">{status || 'Authorizing and syncing your inbox'}</p>
      </Card>
    </div>
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Connect your email</h1>
        <p className="text-sm text-slate-500 mb-6">Authorize PA Mail to access your inbox. We'll sync and let AI organize it.</p>
        <Input placeholder="Email address (optional)" value={email} onChange={e=>setEmail(e.target.value)} className="mb-6"/>
        <div className="space-y-3">
          {providers.map(p=>(
            <button key={p.id} onClick={()=>connect(p)} className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition">
              <span className={`w-10 h-10 rounded-lg ${p.color} text-white flex items-center justify-center font-bold`}>{p.name[0]}</span>
              <span className="font-medium text-slate-800">Connect {p.name}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-6">For this prototype, connection is simulated with sample data.</p>
      </Card>
    </div>
  );
}