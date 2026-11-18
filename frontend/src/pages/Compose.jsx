import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, Button, Input, Textarea, Spinner } from '../components/ui';
import { Send, Mail } from 'lucide-react';

export default function Compose(){
  const nav = useNavigate();
  const [to,setTo]=useState('');
  const [subject,setSubject]=useState('');
  const [body,setBody]=useState('');
  const [gmail,setGmail]=useState(false);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState('');

  useEffect(()=>{ api.get('/integrations/gmail/status').then(r=>setGmail(!!r.data.connected)).catch(()=>{}); },[]);

  const send=async(e)=>{
    e.preventDefault(); setLoading(true); setMsg('');
    try {
      if(gmail){
        await api.post('/integrations/gmail/send',{to,subject,body});
      } else {
        await api.post('/threads/compose',{to,subject,body});
      }
      setMsg('Sent!');
      setTimeout(()=>nav('/inbox'),800);
    } catch(e){ setMsg(e.response?.data?.error||'Send failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Compose</h1>
      <Card className="p-6">
        <form onSubmit={send} className="space-y-4">
          <Input placeholder="To" value={to} onChange={e=>setTo(e.target.value)} required/>
          <Input placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} required/>
          <Textarea rows={10} placeholder="Write your email..." value={body} onChange={e=>setBody(e.target.value)} required/>
          {msg && <p className="text-sm text-[var(--muted)]">{msg}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading?'Sending...':'Send'} <Send size={16}/></Button>
            <Button variant="secondary" type="button" onClick={()=>nav(-1)}>Cancel</Button>
          </div>
        </form>
        <p className="text-xs text-[var(--muted)] mt-3">{gmail?'Sending via Gmail':'Sending as simulated (no Gmail connected)'}</p>
      </Card>
    </div>
  );
}