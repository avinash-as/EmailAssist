import { useEffect, useState } from 'react';
import api from '../api';
import { Card, Button, Spinner } from '../components/ui';
import { RefreshCw, Trash2, Plus } from 'lucide-react';

export default function Accounts(){
  const [accounts,setAccounts]=useState([]);
  const [loading,setLoading]=useState(true);
  const load=async()=>{ setLoading(true); try { const r=await api.get('/accounts'); setAccounts(r.data.accounts); } finally { setLoading(false); } };
  useEffect(()=>{ load(); },[]);
  const sync=async(id)=>{ await api.post(`/accounts/${id}/sync`); load(); };
  const remove=async(id)=>{ await api.delete(`/accounts/${id}`); load(); };
  if(loading) return <Spinner/>;
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#f7f8f8]">Connected accounts</h1>
      {accounts.length===0 && <Card className="p-6 text-center text-[#8a8f98]">No accounts connected. <a href="/connect" className="text-[#a5adff]">Connect one</a></Card>}
      {accounts.map(a=>(
        <Card key={a._id} className="p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-[#f7f8f8]">{a.email}</div>
            <div className="text-xs text-[#8a8f98] mt-1">{a.provider} · {a.status} · last sync {a.lastSync?new Date(a.lastSync).toLocaleString():'never'}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={()=>sync(a._id)}><RefreshCw size={14}/></Button>
            <Button variant="danger" onClick={()=>remove(a._id)}><Trash2 size={14}/></Button>
          </div>
        </Card>
      ))}
      <a href="/connect"><Button><Plus size={16} className="mr-1"/>Connect another account</Button></a>
    </div>
  );
}

