import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Inbox as InboxIcon, MessageSquare, Sparkles, PenSquare, FileText, Bell, Settings, LogOut, Menu, Mail, Sun, Moon } from 'lucide-react';

const nav = [
  {to:'/dashboard', label:'Dashboard', icon:LayoutDashboard},
  {to:'/inbox', label:'Inbox', icon:InboxIcon},
  {to:'/compose', label:'Compose', icon:PenSquare},
  {to:'/templates', label:'Templates', icon:FileText},
  {to:'/reminders', label:'Reminders', icon:Bell},
  {to:'/chat', label:'AI Assistant', icon:MessageSquare},
  {to:'/ai-tools', label:'AI Tools', icon:Sparkles},
  {to:'/accounts', label:'Accounts', icon:Settings},
];

export default function Layout({children}){
  const {user,logout}=useAuth();
  const {theme,toggle}=useTheme();
  const loc=useLocation();
  const nav2=useNavigate();
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const handler=(e)=>{
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); nav2('/compose'); }
      if (e.key === 'i' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); nav2('/inbox'); }
      if (e.key === 'd' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); nav2('/dashboard'); }
    };
    window.addEventListener('keydown', handler);
    return ()=> window.removeEventListener('keydown', handler);
  },[nav2]);
  return (
    <div className="min-h-screen bg-[var(--bg)] flex text-[var(--text)]">
      <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-[var(--surface)] border-r border-[var(--border)] transform transition-transform md:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
        <div className="h-14 flex items-center px-5 border-b border-[var(--border)]">
          <div className="w-7 h-7 rounded-md bg-[#5e6ad2] flex items-center justify-center mr-2.5">
            <Mail className="text-white" size={15}/>
          </div>
          <span className="font-semibold text-[var(--text)] tracking-tight">EmailAssist</span>
        </div>
        <nav className="p-3 space-y-0.5">
          {nav.map(n=>(
            <Link key={n.to} to={n.to} onClick={()=>setOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${loc.pathname===n.to?'bg-[var(--accent-soft)] text-[var(--accent-text)]':'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'}`}>
              <n.icon size={17}/>{n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-xs font-medium text-[var(--accent-text)]">{(user?.name||'U')[0].toUpperCase()}</div>
            <div className="text-xs text-[var(--muted)] truncate">{user?.name}</div>
          </div>
          <button onClick={()=>{logout();nav2('/');}} className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[#f87171] transition-colors"><LogOut size={15}/>Sign out</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm" onClick={()=>setOpen(false)}/>}
      <div className="flex-1 md:ml-60 min-w-0">
        <header className="h-14 bg-[var(--surface)]/80 backdrop-blur border-b border-[var(--border)] flex items-center px-4 md:px-8 sticky top-0 z-10">
          <button className="md:hidden mr-3 text-[var(--muted)]" onClick={()=>setOpen(true)}><Menu size={20}/></button>
          <div className="font-medium text-[var(--text)] text-sm">{nav.find(n=>n.to===loc.pathname)?.label || 'EmailAssist'}</div>
          <button onClick={toggle} className="ml-auto p-2 rounded-md text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors">{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button>
        </header>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}



