import { useState } from 'react';
import api from '../api';
import { Card, Button, Textarea, Input, Spinner } from '../components/ui';
import { Sparkles } from 'lucide-react';

export default function AITools(){
  const [text,setText]=useState('');
  const [subject,setSubject]=useState('');
  const [tone,setTone]=useState('Professional');
  const [out,setOut]=useState('');
  const [loading,setLoading]=useState(false);

  const run = async (fn)=>{
    setLoading(true); setOut('');
    try { const r = await fn(); setOut(r); }
    catch(e){ setOut(e.response?.data?.error||'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">AI Tools</h1>
        <p className="text-sm text-[var(--muted)]">Generate, rewrite, summarize, and analyze emails</p>
      </div>
      <Card className="p-5 space-y-4">
        <Input placeholder="Subject (optional)" value={subject} onChange={e=>setSubject(e.target.value)}/>
        <Textarea rows={6} placeholder="Paste email text or instructions..." value={text} onChange={e=>setText(e.target.value)}/>
        <div className="flex flex-wrap gap-2">
          <select value={tone} onChange={e=>setTone(e.target.value)} className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)]">
            {['Professional','Friendly','Short','Formal'].map(t=><option key={t}>{t}</option>)}
          </select>
          <Button onClick={()=>run(async()=> (await api.post('/ai/reply',{subject,body:text,tone})).data.reply)}>Generate Reply</Button>
          <Button variant="secondary" onClick={()=>run(async()=> (await api.post('/ai/rewrite',{text,tone})).data.text)}>Rewrite</Button>
          <Button variant="secondary" onClick={()=>run(async()=> (await api.post('/ai/summarize',{subject,body:text,detailed:false})).data.summary)}>Summarize</Button>
          <Button variant="secondary" onClick={()=>run(async()=> (await api.post('/ai/subject',{text})).data.subject)}>Subject Line</Button>
          <Button variant="secondary" onClick={()=>run(async()=> (await api.post('/ai/priority',{subject,body:text})).data.priority)}>Priority</Button>
          <Button variant="secondary" onClick={()=>run(async()=> (await api.post('/ai/categorize',{subject,body:text})).data.category)}>Categorize</Button>
        </div>
        {loading && <Spinner/>}
        {out && <Card className="p-4 bg-[var(--bg)]"><pre className="text-sm text-[var(--text)] whitespace-pre-wrap">{out}</pre></Card>}
      </Card>
    </div>
  );
}



