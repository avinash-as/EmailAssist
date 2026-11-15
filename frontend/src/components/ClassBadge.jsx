export default function ClassBadge({classification, needsReview}){
  const map = {
    assistant_reply: {label:'Assistant to Reply', color:'blue'},
    client_reply: {label:'Client to Reply', color:'amber'},
    no_reply: {label:'No Reply Needed', color:'slate'}
  };
  const m = map[classification] || map.no_reply;
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.color==='blue'?'bg-blue-100 text-blue-700':m.color==='amber'?'bg-amber-100 text-amber-700':'bg-slate-100 text-slate-600'}`}>{m.label}</span>
      {needsReview && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Needs review</span>}
    </span>
  );
}