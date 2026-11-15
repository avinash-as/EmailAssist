import { clsx } from 'clsx';
export function Badge({children, color='slate'}){
  const colors = { slate:'bg-slate-100 text-slate-700', indigo:'bg-indigo-100 text-indigo-700', amber:'bg-amber-100 text-amber-700', green:'bg-green-100 text-green-700', red:'bg-red-100 text-red-700', blue:'bg-blue-100 text-blue-700' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
}
export function Card({children,className=''}){ return <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>; }
export function Button({children,variant='primary',className='',...props}){
  const v = variant==='primary'?'bg-indigo-600 text-white hover:bg-indigo-700': variant==='secondary'?'bg-slate-100 text-slate-700 hover:bg-slate-200': variant==='danger'?'bg-red-600 text-white hover:bg-red-700':'border border-slate-300 text-slate-700 hover:bg-slate-50';
  return <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${v} ${className}`} {...props}>{children}</button>;
}
export function Input(props){ return <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" {...props}/>; }
export function Textarea(props){ return <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" {...props}/>; }
export function Empty({title,desc}){ return <div className="text-center py-16"><div className="text-slate-400 text-4xl mb-3">📭</div><h3 className="font-semibold text-slate-700">{title}</h3><p className="text-sm text-slate-500 mt-1">{desc}</p></div>; }
export function Spinner(){ return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"/></div>; }