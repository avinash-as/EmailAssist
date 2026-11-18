import { clsx } from 'clsx';
export function Badge({children, color='slate'}){
  const colors = {
    slate:'bg-[#1a1b1e] text-[#b4b4b4] border border-[#26272b]',
    indigo:'bg-[#1e1f2e] text-[#a5adff] border border-[#3a3b4f]',
    amber:'bg-[#2a2418] text-[#fbbf24] border border-[#3a3426]',
    green:'bg-[#1b2a1f] text-[#4ade80] border border-[#263329]',
    red:'bg-[#2a1b1b] text-[#f87171] border border-[#3a2626]',
    blue:'bg-[#1b2433] text-[#60a5fa] border border-[#2a3550]',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[color]||colors.slate}`}>{children}</span>;
}
export function Card({children,className=''}){ return <div className={`bg-[#111214] rounded-lg border border-[#26272b] shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${className}`}>{children}</div>; }
export function Button({children,variant='primary',className='',...props}){
  const v = variant==='primary'?'bg-[#5e6ad2] text-white hover:bg-[#4c57b0] active:bg-[#434d9e]':
    variant==='secondary'?'bg-[#1a1b1e] text-[#e6e6e6] hover:bg-[#26272b] border border-[#26272b]':
    variant==='danger'?'bg-[#dc2626] text-white hover:bg-[#b91c1c]':
    variant==='ghost'?'text-[#b4b4b4] hover:text-[#f7f8f8] hover:bg-[#1a1b1e]':
    'border border-[#26272b] text-[#b4b4b4] hover:bg-[#1a1b1e]';
  return <button className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${v} ${className}`} {...props}>{children}</button>;
}
export function Input(props){ return <input className="w-full px-3 py-2 bg-[#0f1011] border border-[#26272b] rounded-md text-sm text-[#f7f8f8] placeholder-[#6b6f76] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]/40 focus:border-[#5e6ad2] transition" {...props}/>; }
export function Textarea(props){ return <textarea className="w-full px-3 py-2 bg-[#0f1011] border border-[#26272b] rounded-md text-sm text-[#f7f8f8] placeholder-[#6b6f76] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]/40 focus:border-[#5e6ad2] transition resize-y" {...props}/>; }
export function Empty({title,desc}){ return <div className="text-center py-16"><div className="text-[#6b6f76] text-4xl mb-3">📭</div><h3 className="font-semibold text-[#f7f8f8]">{title}</h3><p className="text-sm text-[#8a8f98] mt-1 max-w-sm mx-auto">{desc}</p></div>; }
export function Spinner(){ return <div className="flex justify-center py-12"><div className="animate-spin h-7 w-7 border-[3px] border-[#26272b] border-t-[#5e6ad2] rounded-full"/></div>; }