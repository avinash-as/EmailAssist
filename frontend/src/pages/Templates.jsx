import { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea } from '../components/ui';
import { Plus, Trash2 } from 'lucide-react';

export default function Templates(){
  const [templates,setTemplates]=useState(()=> JSON.parse(localStorage.getItem('templates')||'[]'));
  const [name,setName]=useState('');
  const [body,setBody]=useState('');
  useEffect(()=>{ localStorage.setItem('templates', JSON.stringify(templates)); },[templates]);
  const add=()=>{ if(!name.trim()||!body.trim()) return; setTemplates(t=>[...t,{id:Date.now(),name,body}]); setName(''); setBody(''); };
  const remove=(id)=> setTemplates(t=>t.filter(x=>x.id!==id));
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--text)]">Email Templates</h1>
      <Card className="p-5 space-y-3">
        <Input placeholder="Template name" value={name} onChange={e=>setName(e.target.value)}/>
        <Textarea rows={6} placeholder="Template body..." value={body} onChange={e=>setBody(e.target.value)}/>
        <Button onClick={add}><Plus size={16} className="mr-1"/>Save template</Button>
      </Card>
      <div className="space-y-3">
        {templates.map(t=>(
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-[var(--text)]">{t.name}</div>
              <Button variant="danger" onClick={()=>remove(t.id)}><Trash2 size={14}/></Button>
            </div>
            <pre className="text-sm text-[var(--muted)] mt-2 whitespace-pre-wrap">{t.body}</pre>
          </Card>
        ))}
        {templates.length===0 && <Card className="p-6 text-center text-[var(--muted)]">No templates yet.</Card>}
      </div>
    </div>
  );
}


