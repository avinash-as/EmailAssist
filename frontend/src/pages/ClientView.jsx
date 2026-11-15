import { useEffect, useState } from 'react';
import api from '../api';
import { Card, Button, Spinner, Empty } from '../components/ui';
import ClassBadge from '../components/ClassBadge';
import { Mail, CheckCircle, UserX } from 'lucide-react';

export default function ClientView(){
  const [threads,setThreads]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);
  const [detail,setDetail]=useState(null);

  const load=async()=>{ setLoading(true); try { const r=await api.get('/threads/client/list'); setThreads(r.data.threads); } finally { setLoading(false); } };
  useEffect(()=>{ load(); },[]);

  const open=async(t)=>{ setSelected(t); const r=await api.get(`/threads/client/${t._id}`); setDetail(r.data.thread); };
  const handle=async(action)=>{ if(!selected) return; await api.post(`/threads/client/${selected._id}/handle`,{action}); setSelected(null); setDetail(null); load(); };

  if(loading) return <div className="min-h-screen flex items-center justify-center"><Spinner/></div>;
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800">Your attention needed</h1>
        <p className="text-sm text-slate-500">Emails that require your personal response</p>
      </header>
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        {threads.length===0 && <Empty title="All clear" desc="No emails require your attention right now."/>}
        {threads.map(t=>(
          <Card key={t._id} className="p-5 cursor-pointer hover:border-indigo-300" onClick={()=>open(t)}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-800 text-sm">{t.subject}</div>
                <div className="text-xs text-slate-500 mt-1">{t.participants?.join(', ')}</div>
                <p className="text-xs text-slate-400 mt-2">{new Date(t.lastMessageAt).toLocaleDateString()}</p>
              </div>
              <ClassBadge classification={t.classification}/>
            </div>
            <p className="text-sm text-slate-600 mt-3 line-clamp-2">{t.summary}</p>
          </Card>
        ))}
      </main>

      {selected && detail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={()=>{setSelected(null);setDetail(null);}}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e=>e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-1">{detail.subject}</h2>
            <p className="text-xs text-slate-500 mb-4">{detail.participants?.join(', ')}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="text-xs font-semibold text-amber-800 mb-1">Why your response is needed</div>
              <p className="text-sm text-amber-900">{detail.reason}</p>
            </div>
            <div className="space-y-3 mb-4">
              {detail.messages?.map((m,i)=>(
                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs font-semibold text-slate-600 mb-1">{m.from} · {m.date?new Date(m.date).toLocaleString():''}</div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{m.body}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <div className="text-xs font-semibold text-slate-500 mb-1">AI Summary</div>
              <p className="text-sm text-slate-700">{detail.summary}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={()=>handle('assistant_takeover')}><UserX size={16} className="mr-1"/>Let assistant handle</Button>
              <Button onClick={()=>handle('handled')}><CheckCircle size={16} className="mr-1"/>Mark handled</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}