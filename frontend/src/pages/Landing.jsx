import { Link } from 'react-router-dom';
import { Mail, Zap, Shield, Users } from 'lucide-react';
import { Button } from '../components/ui';

export default function Landing(){
  return (
    <div className="min-h-screen bg-[#08090a]">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-[#f7f8f8] text-lg"><Mail className="text-[#a5adff]"/>EmailAssist</div>
        <div className="flex gap-3">
          <Link to="/login"><Button variant="ghost">Log in</Button></Link>
          <Link to="/signup"><Button>Get started</Button></Link>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#f7f8f8] leading-tight">AI-powered email management<br/>for personal assistants</h1>
        <p className="mt-6 text-lg text-[#b4b4b4] max-w-2xl mx-auto">Connect your clients' inboxes, let AI decide who needs to reply, and surface only what matters. Assistants get full control; clients get a clean, minimal view.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/signup"><Button className="px-6 py-3 text-base">Start free</Button></Link>
          <Link to="/login"><Button variant="secondary" className="px-6 py-3 text-base">Log in</Button></Link>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        {[
          {icon:Zap,title:'Auto-classification',desc:'AI reads every conversation and decides: assistant replies, client replies, or no reply needed.'},
          {icon:Shield,title:'Smart organization',desc:'Segments emails into action required, meetings, important and more — automatically.'},
          {icon:Users,title:'Client view',desc:'Clients see only emails needing their attention, with AI summaries and one-tap handoff.'},
        ].map((f,i)=>(
          <div key={i} className="bg-[#111214] rounded-xl p-6 border border-[#26272b] shadow-sm">
            <f.icon className="text-[#a5adff] mb-3" size={28}/>
            <h3 className="font-semibold text-[#f7f8f8]">{f.title}</h3>
            <p className="text-sm text-[#8a8f98] mt-2">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}


