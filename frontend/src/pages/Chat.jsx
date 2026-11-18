import { useState } from 'react';
import api from '../api';
import { Card, Button, Input, Spinner } from '../components/ui';
import { Send } from 'lucide-react';

export default function Chat(){
  const [q,setQ]=useState('');
  const [msgs,setMsgs]=useState([{role:'assistant',text:'Hi! Ask me anything about your inbox.'}]);
  const [loading,setLoading]=useState(false);
  const send=async(e)=>{ e?.preventDefault(); if(!q.trim()) return; const text=q; setQ(''); setMsgs(m=>[...m,{role:'user',text}]); setLoading(true);
    try { const r=await api.post('/chat',{question:text}); setMsgs(m=>[...m,{role:'assistant',text:r.data.answer}]); }
    catch(e){ setMsgs(m=>[...m,{role:'assistant',text:'Sorry, something went wrong.'}]); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-[var(--text)]">AI Assistant</h1>
      <Card className="p-4 h-[60vh] overflow-y-auto space-y-3">
        {msgs.map((m,i)=>(
          <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role==='user'?'bg-[#5e6ad2] text-white':'bg-[var(--surface-2)] text-[var(--text)]'}`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="text-sm text-[var(--muted)]">Thinking...</div>}
      </Card>
      <form onSubmit={send} className="flex gap-2">
        <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about your emails..."/>
        <Button type="submit" disabled={loading}><Send size={16}/></Button>
      </form>
      <div className="text-xs text-[var(--muted)]">Try: "Show me emails that need my attention", "What am I waiting for a response on?", "Which emails require the client's attention?", "Summarize this conversation", "Any meetings?"</div>
    </div>
  );
}





