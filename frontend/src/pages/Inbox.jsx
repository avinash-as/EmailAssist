import { useEffect, useState } from 'react';
import api from '../api';
import { Card, Input, Spinner, Empty, Button } from '../components/ui';
import ClassBadge from '../components/ClassBadge';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const segments = [
  {id:'all', label:'All'},
  {id:'assistant_reply', label:'Assistant to Reply', type:'classification'},
  {id:'client_reply', label:'Client to Reply', type:'classification'},
  {id:'no_reply', label:'No Reply Needed', type:'classification'},
  {id:'action_required', label:'Action Required'},
  {id:'meetings', label:'Meetings & Appointments'},
  {id:'important', label:'Important', type:'flag'},
];

export default function Inbox(){
  const [threads,setThreads]=useState([]);
  const [loading,setLoading]=useState(true);
  const [segment,setSegment]=useState('all');
  const [search,setSearch]=useState('');
  const [query,setQuery]=useState('');

  const load=async()=>{
    setLoading(true);
    try {
      let url='/threads?';
      const seg = segments.find(s=>s.id===segment);
      if(segment==='important') url+='important=true';
      else if(seg?.type==='classification') url+='classification='+segment;
      else if(segment!=='all') url+='segment='+segment;
      if(query) url+='&search='+encodeURIComponent(query);
      const r=await api.get(url);
      setThreads(r.data.threads);
    } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[segment,query]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="md:w-56 shrink-0">
        <Card className="p-3">
          <div className="text-xs font-semibold text-slate-400 uppercase mb-2 px-2">Segments</div>
          <div className="space-y-1">
            {segments.map(s=>(
              <button key={s.id} onClick={()=>setSegment(s.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${segment===s.id?'bg-indigo-50 text-indigo-700 font-medium':'text-slate-600 hover:bg-slate-50'}`}>{s.label}</button>
            ))}
          </div>
        </Card>
      </aside>
      <div className="flex-1 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
            <Input className="pl-9" placeholder="Search conversations..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') setQuery(search);}}/>
          </div>
          <Button onClick={()=>setQuery(search)}>Search</Button>
        </div>
        {loading ? <Spinner/> : threads.length===0 ? <Empty title="No conversations" desc="Try another segment or search."/> : (
          <div className="space-y-3">
            {threads.map(t=>(
              <Link key={t._id} to={`/thread/${t._id}`} className="block">
                <Card className="p-4 hover:border-indigo-300 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {t.unreadCount>0 && <span className="w-2 h-2 rounded-full bg-indigo-600"/>}
                        <h3 className="font-semibold text-slate-800 text-sm truncate">{t.subject}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">{t.participants?.join(', ')}</p>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{t.summary}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <ClassBadge classification={t.classification} needsReview={t.needsReview}/>
                      {t.isImportant && <span className="text-amber-500 text-xs">★ Important</span>}
                      <span className="text-xs text-slate-400">{new Date(t.lastMessageAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}