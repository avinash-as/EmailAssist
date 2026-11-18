import { Link } from 'react-router-dom';
import { Mail, Zap, Shield, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';

export default function Landing(){
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-[var(--text)] text-lg tracking-tight"><div className="w-8 h-8 rounded-md bg-[#5e6ad2] flex items-center justify-center"><Mail className="text-white" size={16}/></div>EmailAssist</div>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost">Log in</Button></Link>
          <Link to="/signup"><Button>Get started</Button></Link>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[#3a3b4f] text-xs text-[var(--accent-text)] mb-6">AI-powered email management</div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">Email management<br/>for personal assistants</h1>
        <p className="mt-6 text-lg text-[var(--muted)] max-w-2xl mx-auto">Connect your clients' inboxes, let AI decide who needs to reply, and surface only what matters. Assistants get full control; clients get a clean, minimal view.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/signup"><Button className="px-5 py-2.5 text-base">Start free <ArrowRight size={16}/></Button></Link>
          <Link to="/login"><Button variant="secondary" className="px-5 py-2.5 text-base">Log in</Button></Link>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-5">
        {[
          {icon:Zap,title:'Auto-classification',desc:'AI reads every conversation and decides: assistant replies, client replies, or no reply needed.'},
          {icon:Shield,title:'Smart organization',desc:'Segments emails into action required, meetings, important and more — automatically.'},
          {icon:Users,title:'Client view',desc:'Clients see only emails needing their attention, with AI summaries and one-tap handoff.'},
        ].map((f,i)=>(
          <div key={i} className="bg-[var(--surface)] rounded-lg p-6 border border-[var(--border)] hover:border-[#3a3b4f] transition-colors">
            <div className="w-10 h-10 rounded-md bg-[var(--accent-soft)] flex items-center justify-center mb-4"><f.icon className="text-[var(--accent-text)]" size={20}/></div>
            <h3 className="font-semibold text-[var(--text)]">{f.title}</h3>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}



