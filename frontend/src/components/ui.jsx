import { clsx } from 'clsx';
export function Badge({children, color='slate'}){
  const colors = { slate:'bg-[#1a1b1e] text-[#e6e6e6]', indigo:'bg-[#2a2b3d] text-[#a5adff]', amber:'bg-[#2a2418] text-[#fbbf24]', green:'bg-[#1b2a1f] text-[#4ade80]', red:'bg-[#2a1b1b] text-[#f87171]', blue:'bg-[#1b2433] text-[#60a5fa]' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
}
export function Card({children,className=''}){ return <div className={`bg-[#111214] rounded-xl border border-[#26272b] shadow-sm ${className}`}>{children}</div>; }
export function Button({children,variant='primary',className='',...props}){
  const v = variant==='primary'?'bg-[#5e6ad2] text-white hover:bg-[#4c57b0]': variant==='secondary'?'bg-[#1a1b1e] text-[#e6e6e6] hover:bg-[#26272b]': variant==='danger'?'bg-[#dc2626] text-white hover:bg-[#b91c1c]':'border border-[#2a2b2f] text-[#e6e6e6] hover:bg-[#08090a]';
  return <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${v} ${className}`} {...props}>{children}</button>;
}
export function Input(props){ return <input className="w-full px-3 py-2 border border-[#2a2b2f] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" {...props}/>; }
export function Textarea(props){ return <textarea className="w-full px-3 py-2 border border-[#2a2b2f] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" {...props}/>; }
export function Empty({title,desc}){ return <div className="text-center py-16"><div className="text-[#6b6f76] text-4xl mb-3">📭</div><h3 className="font-semibold text-[#e6e6e6]">{title}</h3><p className="text-sm text-[#8a8f98] mt-1">{desc}</p></div>; }
export function Spinner(){ return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-[#3a3b4f] border-t-indigo-600 rounded-full"/></div>; }

