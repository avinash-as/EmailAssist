const clientKw = ['approve','approval','decision','your input','your thoughts','your call','sign','contract','personal','sensitive','confidential','please confirm','budget','legal','need your','requires your','your decision','your approval','review and approve','action needed from you','your feedback','your preference','choose','select option'];
const assistantKw = ['schedule','reschedule','appointment','meeting time','availability','inquiry','routine','administrative','follow up','follow-up','can you','please schedule','book','calendar','coordinate','arrange','respond to','reply to','handle','set up','reminder to','confirm time','reschedule'];
const noReplyKw = ['newsletter','unsubscribe','notification','automated','receipt','order confirmation','no reply','do not reply','thank you for','update:','fyi','for your information','weekly digest','news','announcement','shipped','delivered','invoice paid','already resolved','closed','completed','system generated','verification code','password reset'];

function score(text, kws){ const t=text.toLowerCase(); let s=0; for(const k of kws){ if(t.includes(k)) s+=1;} return s; }

function classifyThread(thread){
  const msgs = thread.messages || [];
  const combined = [thread.subject||'', ...msgs.map(m=>m.body||'')].join(' \n ');
  const last = msgs[msgs.length-1];
  const lastFromClient = last && /client|you/i.test(last.from||'') ? true : false;
  const sc = score(combined, clientKw);
  const sa = score(combined, assistantKw);
  const sn = score(combined, noReplyKw);
  // base
  let cls='no_reply', conf=0.6, reason='';
  const max = Math.max(sc,sa,sn);
  if (max === 0) { cls='assistant_reply'; conf=0.45; reason='No clear signals; flagged for assistant review.'; }
  else if (sn >= sc && sn >= sa && sn>0) { cls='no_reply'; conf = Math.min(0.95, 0.6+sn*0.1); reason='Informational/automated content with no response required.'; }
  else if (sc > sa) { cls='client_reply'; conf = Math.min(0.95, 0.6+sc*0.1); reason='Contains personal decision/approval/input requests for the client.'; }
  else if (sa >= sc) { cls='assistant_reply'; conf = Math.min(0.95, 0.6+sa*0.1); reason='Administrative/scheduling/routine communication for the assistant.'; }
  // reconsider: if last message resolves, no reply
  if (/resolved|done|completed|thank you|no further/i.test(combined) && sn>0) { /* keep */ }
  const needsReview = conf < 0.6;
  // summary
  const summary = summarize(combined, thread.subject);
  const actionItems = extractActions(combined);
  const importantDates = extractDates(combined);
  const segment = deriveSegment(cls, combined);
  return { classification: cls, confidence: conf, reason, needsReview, summary, actionItems, importantDates, segment };
}

function summarize(text, subject){
  // first two sentences
  const sentences = text.replace(/\s+/g,' ').split(/(?<=[.!?])\s+/).filter(s=>s.length>20);
  const pick = sentences.slice(0,2).join(' ');
  const base = subject ? `Re: ${subject}. ` : '';
  return (base + (pick||'Conversation captured.')).slice(0,400);
}

function extractActions(text){
  const lines = text.split(/\n|\. /);
  const res=[];
  for(const l of lines){
    const t=l.trim();
    if(/please|need to|action|follow up|confirm|schedule|reply/i.test(t) && t.length>15 && t.length<200){
      res.push(t);
      if(res.length>=5) break;
    }
  }
  return [...new Set(res)];
}

function extractDates(text){
  const res=new Set();
  const patterns = [
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:,?\s*\d{4})?/gi,
    /\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b/g,
    /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi,
    /\b\d{4}-\d{2}-\d{2}\b/g
  ];
  for(const p of patterns){
    const m = text.match(p);
    if(m) m.forEach(x=>res.add(x));
  }
  return [...res].slice(0,8);
}

function deriveSegment(cls, text){
  const t=text.toLowerCase();
  if(/meeting|appointment|schedule|calendar|book/i.test(t)) return 'meetings';
  if(/urgent|asap|deadline/i.test(t)) return 'action_required';
  if(/action required/i.test(t) && !/no action required/i.test(t)) return 'action_required';
  if(cls==='client_reply') return 'client_reply';
  if(cls==='assistant_reply') return 'assistant_reply';
  if(cls==='no_reply') return 'general';
  return 'general';
}

module.exports = { classifyThread };