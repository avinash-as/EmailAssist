import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Plus, Trash2, Bell } from 'lucide-react';

export default function Reminders(){
  const [items,setItems]=useState(()=> JSON.parse(localStorage.getItem('reminders')||'[]'));
  const [title,setTitle]=useState('');
  const [due,setDue]=useState('');
  useEffect(()=>{ localStorage.setItem('reminders', JSON.stringify(items)); },[items]);
  const add=()=>{ if(!title.trim()) return; setItems(x=>[...x,{id:Date.now(),title,due,done:false}]); setTitle(''); setDue(''); };
  const toggle=(id)=> setItems(x=>x.map(i=>i.id===id?{...i,done:!i.done}:i));
  const remove=(id)=> setItems(x=>x.filter(i=>i.id!==id));
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--text)]">Follow-up Reminders</h1>
      <Card className="p-5 flex gap-2">
        <Input placeholder="Reminder title" value={title} onChange={e=>setTitle(e.target.value)}/>
        <Input type="date" value={due} onChange={e=>setDue(e.target.value)}/>
        <Button onClick={add}><Plus size={16}/></Button>
      </Card>
      <div className="space-y-2">
        {items.map(i=>(
          <Card key={i.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={16} className={i.done?'text-[var(--muted)]':'text-[#fbbf24]'}/>
              <div>
                <div className={`text-sm ${i.done?'line-through text-[var(--muted)]':'text-[var(--text)]'}`}>{i.title}</div>
                {i.due && <div className="text-xs text-[var(--muted)]">Due {i.due}</div>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={()=>toggle(i.id)}>{i.done?'Undo':'Done'}</Button>
              <Button variant="danger" onClick={()=>remove(i.id)}><Trash2 size={14}/></Button>
            </div>
          </Card>
        ))}
        {items.length===0 && <Card className="p-6 text-center text-[var(--muted)]">No reminders.</Card>}
      </div>
    </div>
  );
}


