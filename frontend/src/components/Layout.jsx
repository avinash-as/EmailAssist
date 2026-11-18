import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Inbox as InboxIcon, MessageSquare, Sparkles, Settings, LogOut, Menu, Mail } from 'lucide-react';

const nav = [
  {to:'/dashboard', label:'Dashboard', icon:LayoutDashboard},
  {to:'/inbox', label:'Inbox', icon:InboxIcon},
  {to:'/chat', label:'AI Assistant', icon:MessageSquare},
  {to:'/ai-tools', label:'AI Tools', icon:Sparkles},
  {to:'/accounts', label:'Accounts', icon:Settings},
];

export default function Layout({children}){
  const {user,logout}=useAuth();
  const loc=useLocation();
  const nav2=useNavigate();
  const [open,setOpen]=useState(false);
  return (
    <div className="min-h-screen bg-[#08090a] flex text-[#f7f8f8]">
      <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-[#0f1011] border-r border-[#1f2023] transform transition-transform md:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
        <div className="h-14 flex items-center px-5 border-b border-[#1f2023]">
          <div className="w-7 h-7 rounded-md bg-[#5e6ad2] flex items-center justify-center mr-2.5">
            <Mail className="text-white" size={15}/>
          </div>
          <span className="font-semibold text-[#f7f8f8] tracking-tight">EmailAssist</span>
        </div>
        <nav className="p-3 space-y-0.5">
          {nav.map(n=>(
            <Link key={n.to} to={n.to} onClick={()=>setOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${loc.pathname===n.to?'bg-[#1e1f2e] text-[#a5adff]':'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#161719]'}`}>
              <n.icon size={17}/>{n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1f2023]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#1e1f2e] flex items-center justify-center text-xs font-medium text-[#a5adff]">{(user?.name||'U')[0].toUpperCase()}</div>
            <div className="text-xs text-[#8a8f98] truncate">{user?.name}</div>
          </div>
          <button onClick={()=>{logout();nav2('/');}} className="flex items-center gap-2 text-sm text-[#8a8f98] hover:text-[#f87171] transition-colors"><LogOut size={15}/>Sign out</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm" onClick={()=>setOpen(false)}/>}
      <div className="flex-1 md:ml-60 min-w-0">
        <header className="h-14 bg-[#0f1011]/80 backdrop-blur border-b border-[#1f2023] flex items-center px-4 md:px-8 sticky top-0 z-10">
          <button className="md:hidden mr-3 text-[#8a8f98]" onClick={()=>setOpen(true)}><Menu size={20}/></button>
          <div className="font-medium text-[#f7f8f8] text-sm">{nav.find(n=>n.to===loc.pathname)?.label || 'EmailAssist'}</div>
        </header>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}