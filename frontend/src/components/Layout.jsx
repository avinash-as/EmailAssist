import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Inbox as InboxIcon, MessageSquare, Settings, LogOut, Menu, X, Mail } from 'lucide-react';

const nav = [
  {to:'/dashboard', label:'Dashboard', icon:LayoutDashboard},
  {to:'/inbox', label:'Inbox', icon:InboxIcon},
  {to:'/chat', label:'AI Assistant', icon:MessageSquare},
  {to:'/accounts', label:'Accounts', icon:Settings},
];

export default function Layout({children}){
  const {user,logout}=useAuth();
  const loc=useLocation();
  const nav2=useNavigate();
  const [open,setOpen]=useState(false);
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform md:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Mail className="text-indigo-600 mr-2" size={22}/>
          <span className="font-bold text-slate-800">PA Mail</span>
        </div>
        <nav className="p-4 space-y-1">
          {nav.map(n=>(
            <Link key={n.to} to={n.to} onClick={()=>setOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${loc.pathname===n.to?'bg-indigo-50 text-indigo-700':'text-slate-600 hover:bg-slate-100'}`}>
              <n.icon size={18}/>{n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 mb-2">{user?.name}</div>
          <button onClick={()=>{logout();nav2('/');}} className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600"><LogOut size={16}/>Sign out</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={()=>setOpen(false)}/>}
      <div className="flex-1 md:ml-64">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 sticky top-0 z-10">
          <button className="md:hidden mr-3" onClick={()=>setOpen(true)}><Menu size={22}/></button>
          <div className="font-semibold text-slate-800">{nav.find(n=>n.to===loc.pathname)?.label || 'PA Mail'}</div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}