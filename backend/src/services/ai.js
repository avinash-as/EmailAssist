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

const { loadEnv } = require('../config/env');
const env = loadEnv();
let openai = null;
try {
  if (env.OPENAI_API_KEY) {
    const OpenAI = require('openai');
    openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
} catch(e){ openai = null; }

async function aiComplete(prompt, maxTokens=400){
  if(!openai) return null;
  try {
    const r = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [{ role:'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.4,
    });
    return r.choices?.[0]?.message?.content?.trim() || null;
  } catch(e){ console.error('OpenAI error', e.message); return null; }
}

const CATEGORIES = ['Work','Personal','Important','Promotions','Finance','Social'];

async function categorizeEmail(subject, body){
  const text = `${subject}\n${body}`.slice(0,4000);
  const prompt = `Categorize this email into one of: ${CATEGORIES.join(', ')}. Return only the category name.\n\n${text}`;
  const r = await aiComplete(prompt, 20);
  const cat = CATEGORIES.find(c=> (r||'').toLowerCase().includes(c.toLowerCase()));
  if(cat) return cat;
  // heuristic
  const t = text.toLowerCase();
  if(/invoice|payment|bank|receipt|billing/.test(t)) return 'Finance';
  if(/unsubscribe|sale|offer|deal|promo/.test(t)) return 'Promotions';
  if(/friend|family|personal/.test(t)) return 'Personal';
  if(/meeting|project|work|client|deadline/.test(t)) return 'Work';
  if(/social|party|event/.test(t)) return 'Social';
  return 'Important';
}

async function summarizeEmail(subject, body, detailed=false){
  const text = `${subject}\n${body}`.slice(0,6000);
  const prompt = detailed
    ? `Provide a detailed summary of this email, extracting key points, deadlines, tasks, and meeting requests.\n\n${text}`
    : `Summarize this email in 2-3 sentences. Highlight deadlines/dates if any.\n\n${text}`;
  const r = await aiComplete(prompt, detailed?600:200);
  if(r) return r;
  // heuristic fallback
  const sentences = text.replace(/\s+/g,' ').split(/(?<=[.!?])\s+/).filter(s=>s.length>20);
  return (sentences.slice(0, detailed?4:2).join(' ') || 'No summary available.').slice(0,600);
}

async function generateReply(subject, body, tone='Professional'){
  const text = `${subject}\n${body}`.slice(0,6000);
  const prompt = `Write a ${tone} email reply to the following email. Return only the reply body (no subject).\n\n${text}`;
  const r = await aiComplete(prompt, 400);
  if(r) return r;
  return `Thank you for your email regarding "${subject}". I have reviewed your message and will follow up shortly.\n\nBest regards,\nEmailAssist`;
}

async function rewriteEmail(text, tone){
  const prompt = `Rewrite the following email in a ${tone} tone. Return only the rewritten email.\n\n${text}`;
  const r = await aiComplete(prompt, 500);
  return r || text;
}

async function generateSubject(text){
  const prompt = `Generate a concise professional subject line for this email. Return only the subject line.\n\n${text}`;
  const r = await aiComplete(prompt, 60);
  return r || 'Update';
}

async function detectPriority(subject, body){
  const text = `${subject}\n${body}`.toLowerCase();
  let priority='normal';
  if(/urgent|asap|immediately|critical|deadline today|emergency/.test(text)) priority='urgent';
  else if(/important|deadline|action required|please review/.test(text)) priority='high';
  else if(/fyi|newsletter|no reply/.test(text)) priority='low';
  // AI refine
  if(openai){
    const r = await aiComplete(`Classify priority of this email as one of: low, normal, high, urgent. Return only the word.\n\n${subject}\n${body}`, 10);
    if(r && /low|normal|high|urgent/.test(r.toLowerCase())) priority = r.toLowerCase().match(/low|normal|high|urgent/)[0];
  }
  return priority;
}

async function chatAssistant(question, context){
  const prompt = `You are an AI email assistant. Answer the user's question about their emails.\n\nContext:\n${context}\n\nQuestion: ${question}`;
  const r = await aiComplete(prompt, 500);
  return r || 'I could not generate a response.';
}

module.exports = { classifyThread, categorizeEmail, summarizeEmail, generateReply, rewriteEmail, generateSubject, detectPriority, chatAssistant, CATEGORIES };