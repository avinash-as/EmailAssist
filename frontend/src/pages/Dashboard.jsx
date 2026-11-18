import { useEffect, useState } from 'react';
import api from '../api';
import { Card, Spinner, Button } from '../components/ui';
import ClassBadge from '../components/ClassBadge';
import { Link } from 'react-router-dom';
import { Mail, MailOpen, Star, AlertCircle, Clock, Calendar, Users, ArrowRight } from 'lucide-react';

const statCards = (s)=>[
  {label:'Total emails', value:s.total, icon:Mail, color:'text-[var(--muted)]'},
  {label:'Unread', value:s.unread, icon:MailOpen, color:'text-[#60a5fa]'},
  {label:'Important', value:s.important, icon:Star, color:'text-[#fbbf24]'},
  {label:'Action required', value:s.actionRequired, icon:AlertCircle, color:'text-[#f87171]'},
  {label:'Waiting (assistant)', value:s.assistantReply, icon:Clock, color:'text-[var(--accent-text)]'},
  {label:'Client attention', value:s.clientReply, icon:Users, color:'text-[#fb923c]'},
  {label:'Meetings', value:s.meetings, icon:Calendar, color:'text-[#4ade80]'},
  {label:'No reply needed', value:s.noReply, icon:Mail, color:'text-[var(--muted)]'},
];

export default function Dashboard(){
  const [stats,setStats]=useState(null);
  const [threads,setThreads]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ (async()=>{
    try {
      const [s,t] = await Promise.all([api.get('/threads/stats'), api.get('/threads?limit=8')]);
      setStats(s.data.stats); setThreads(t.data.threads.slice(0,8));
    } finally { setLoading(false); }
  })(); },[]);
  if(loading) return <Spinner/>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard</h1>
        <p className="text-sm text-[var(--muted)]">Overview of your inbox at a glance</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards(stats).map((c,i)=>(
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-[var(--muted)]">{c.label}</div>
                <div className="text-2xl font-bold text-[var(--text)] mt-1">{c.value}</div>
              </div>
              <c.icon className={c.color} size={22}/>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text)]">Recent conversations</h2>
            <Link to="/inbox" className="text-sm text-[var(--accent-text)] flex items-center gap-1">View all <ArrowRight size={14}/></Link>
          </div>
          <div className="space-y-3">
            {threads.map(t=>(
              <Link key={t._id} to={`/thread/${t._id}`} className="block p-3 rounded-lg hover:bg-[var(--bg)] border border-[var(--border)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-[var(--text)] text-sm truncate">{t.subject}</div>
                  <ClassBadge classification={t.classification} needsReview={t.needsReview}/>
                </div>
                <div className="text-xs text-[var(--muted)] mt-1 truncate">{t.participants?.join(', ')}</div>
              </Link>
            ))}
            {threads.length===0 && <p className="text-sm text-[var(--muted)]">No conversations yet. Connect an email.</p>}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold text-[var(--text)] mb-4">Upcoming meetings</h2>
          <div className="space-y-3">
            {threads.filter(t=>t.segment==='meetings').map(t=>(
              <div key={t._id} className="p-3 rounded-lg bg-[#1b2a1f] border border-[#263329]">
                <div className="font-medium text-[var(--text)] text-sm">{t.subject}</div>
                <div className="text-xs text-[#4ade80] mt-1">{(t.importantDates||[]).join(', ') || 'Date TBD'}</div>
              </div>
            ))}
            {threads.filter(t=>t.segment==='meetings').length===0 && <p className="text-sm text-[var(--muted)]">No meetings identified.</p>}
          </div>
          <div className="mt-4">
            <Link to="/chat"><Button variant="secondary" className="w-full">Ask AI Assistant</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}





