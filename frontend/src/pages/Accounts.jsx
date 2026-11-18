import { useEffect, useState } from 'react';
import api from '../api';
import { Card, Button, Spinner } from '../components/ui';
import { RefreshCw, Trash2, Plus, Mail } from 'lucide-react';

export default function Accounts(){
  const [accounts,setAccounts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [gmail,setGmail]=useState(null);
  const load=async()=>{ setLoading(true); try { const r=await api.get('/accounts'); setAccounts(r.data.accounts); const g=await api.get('/integrations/gmail/status'); setGmail(g.data); } finally { setLoading(false); } };
  useEffect(()=>{ load(); },[]);
  const sync=async(id)=>{ await api.post(`/accounts/${id}/sync`); load(); };
  const remove=async(id)=>{ await api.delete(`/accounts/${id}`); load(); };
  const connectGmail=async()=>{ const r=await api.get('/integrations/gmail/connect'); if(r.data.url) window.location.href=r.data.url; else alert(r.data.error); };
  const disconnectGmail=async()=>{ await api.post('/integrations/gmail/disconnect'); load(); };
  const syncGmail=async()=>{ await api.post('/integrations/gmail/sync'); load(); };
  if(loading) return <Spinner/>;
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--text)]">Connected accounts</h1>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#1b2433] flex items-center justify-center"><Mail className="text-[#60a5fa]" size={20}/></div>
            <div>
              <div className="font-semibold text-[var(--text)]">Gmail</div>
              <div className="text-xs text-[var(--muted)]">{gmail?.connected ? `${gmail.account.email} · ${gmail.account.status}` : 'Not connected'}</div>
            </div>
          </div>
          <div className="flex gap-2">
            {gmail?.connected ? (
              <>
                <Button variant="secondary" onClick={syncGmail}><RefreshCw size={14}/></Button>
                <Button variant="danger" onClick={disconnectGmail}>Disconnect</Button>
              </>
            ) : (
              <Button onClick={connectGmail}>Connect Gmail</Button>
            )}
          </div>
        </div>
      </Card>

      {accounts.length===0 && <Card className="p-6 text-center text-[var(--muted)]">No simulated accounts connected. <a href="/connect" className="text-[var(--accent-text)]">Connect one</a></Card>}
      {accounts.map(a=>(
        <Card key={a._id} className="p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-[var(--text)]">{a.email}</div>
            <div className="text-xs text-[var(--muted)] mt-1">{a.provider} · {a.status} · last sync {a.lastSync?new Date(a.lastSync).toLocaleString():'never'}</div>
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



