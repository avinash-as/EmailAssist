import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, Button, Textarea, Spinner, Badge } from '../components/ui';
import ClassBadge from '../components/ClassBadge';
import { ArrowLeft, Star, Archive, CheckCircle, RefreshCw, Edit3 } from 'lucide-react';

export default function ThreadDetail(){
  const {id}=useParams();
  const nav=useNavigate();
  const [thread,setThread]=useState(null);
  const [loading,setLoading]=useState(true);
  const [draft,setDraft]=useState('');
  const [showDraft,setShowDraft]=useState(false);
  const [sending,setSending]=useState(false);
  const [newMsg,setNewMsg]=useState('');

  const load=async()=>{ setLoading(true); try { const r=await api.get(`/threads/${id}`); setThread(r.data.thread); } finally { setLoading(false); } };
  useEffect(()=>{ load(); },[id]);

  const patch=async(body)=>{ const r=await api.patch(`/threads/${id}`,body); setThread(r.data.thread); };
  const reclassify=async()=>{ const r=await api.post(`/threads/${id}/reclassify`); setThread(r.data.thread); };
  const genDraft=async()=>{ const r=await api.post(`/threads/${id}/draft`); setDraft(r.data.draft); setShowDraft(true); };
  const sendReply=async()=>{ if(!newMsg.trim() && !draft.trim()) return; setSending(true);
    try { const body = draft.trim() || newMsg.trim(); const r=await api.post(`/threads/${id}/reply`,{body}); setThread(r.data.thread); setShowDraft(false); setDraft(''); setNewMsg(''); }
    finally { setSending(false); }
  };
  const complete=async()=>{ await api.post(`/threads/${id}/complete`); nav('/inbox'); };

  if(loading) return <Spinner/>;
  if(!thread) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <button onClick={()=>nav(-1)} className="flex items-center gap-2 text-sm text-[#b4b4b4] hover:text-[#a5adff]"><ArrowLeft size={16}/>Back</button>
      <div className="flex flex-col md:flex-row gap-6">
        {/* conversation */}
        <div className="flex-1 space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl font-bold text-[#f7f8f8]">{thread.subject}</h1>
                <p className="text-sm text-[#8a8f98] mt-1">{thread.participants?.join(', ')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>patch({isImportant:!thread.isImportant})} className={`p-2 rounded-lg ${thread.isImportant?'text-[#fbbf24]':'text-[#6b6f76] hover:text-[#fbbf24]'}`}><Star size={18}/></button>
                <button onClick={()=>patch({archived:true})} className="p-2 rounded-lg text-[#6b6f76] hover:text-[#e6e6e6]"><Archive size={18}/></button>
              </div>
            </div>
            <div className="space-y-4">
              {thread.messages?.map((m,i)=>(
                <div key={i} className={`p-4 rounded-xl ${m.from?.includes('assistant')||m.from?.includes('pa.com')?'bg-[#1e1f2e]':'bg-[#08090a]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#e6e6e6]">{m.from}</span>
                    <span className="text-xs text-[#6b6f76]">{m.date?new Date(m.date).toLocaleString():''}</span>
                  </div>
                  <p className="text-sm text-[#e6e6e6] whitespace-pre-wrap">{m.body}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* reply composer */}
          <Card className="p-5">
            <h2 className="font-semibold text-[#f7f8f8] mb-3">Reply</h2>
            {showDraft && (
              <div className="mb-3">
                <Textarea rows={6} value={draft} onChange={e=>setDraft(e.target.value)}/>
              </div>
            )}
            {!showDraft && (
              <Textarea rows={4} placeholder="Type your reply..." value={newMsg} onChange={e=>setNewMsg(e.target.value)}/>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button onClick={genDraft} variant="secondary"><Edit3 size={16} className="mr-1"/>Draft with AI</Button>
              <Button onClick={sendReply} disabled={sending}>{sending?'Sending...':'Send Reply'}</Button>
              <Button onClick={complete} variant="ghost"><CheckCircle size={16} className="mr-1"/>Mark complete</Button>
            </div>
          </Card>
        </div>

        {/* AI panel */}
        <aside className="md:w-80 shrink-0 space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold text-[#f7f8f8] mb-3">AI Classification</h2>
            <div className="mb-3"><ClassBadge classification={thread.classification} needsReview={thread.needsReview}/></div>
            <p className="text-sm text-[#b4b4b4] mb-3">{thread.reason}</p>
            <div className="text-xs text-[#8a8f98] mb-2">Confidence: {Math.round((thread.confidence||0)*100)}%</div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Button size="sm" variant="secondary" onClick={()=>patch({classification:'assistant_reply'})}>Assistant</Button>
              <Button size="sm" variant="secondary" onClick={()=>patch({classification:'client_reply'})}>Client</Button>
              <Button size="sm" variant="secondary" onClick={()=>patch({classification:'no_reply'})}>No reply</Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={reclassify}><RefreshCw size={14} className="mr-1"/>Re-run AI</Button>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-[#f7f8f8] mb-2">AI Summary</h2>
            <p className="text-sm text-[#b4b4b4]">{thread.summary}</p>
          </Card>
          {thread.actionItems?.length>0 && (
            <Card className="p-5">
              <h2 className="font-semibold text-[#f7f8f8] mb-2">Action items</h2>
              <ul className="list-disc pl-5 text-sm text-[#b4b4b4] space-y-1">
                {thread.actionItems.map((a,i)=><li key={i}>{a}</li>)}
              </ul>
            </Card>
          )}
          {thread.importantDates?.length>0 && (
            <Card className="p-5">
              <h2 className="font-semibold text-[#f7f8f8] mb-2">Important dates</h2>
              <div className="flex flex-wrap gap-2">
                {thread.importantDates.map((d,i)=><Badge key={i} color="amber">{d}</Badge>)}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

