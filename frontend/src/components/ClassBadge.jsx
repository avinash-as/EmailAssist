export default function ClassBadge({classification, needsReview}){
  const map = {
    assistant_reply: {label:'Assistant to Reply', color:'blue'},
    client_reply: {label:'Client to Reply', color:'amber'},
    no_reply: {label:'No Reply Needed', color:'slate'}
  };
  const m = map[classification] || map.no_reply;
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.color==='blue'?'bg-[#1b2433] text-[#60a5fa]':m.color==='amber'?'bg-[#2a2418] text-[#fbbf24]':'bg-[#1a1b1e] text-[var(--muted)]'}`}>{m.label}</span>
      {needsReview && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#2a1b1b] text-[#f87171]">Needs review</span>}
    </span>
  );
}


