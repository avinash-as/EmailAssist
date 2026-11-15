const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Thread = require('../models/Thread');

router.post('/', auth, async (req,res)=>{
  const { question } = req.body;
  const q = (question||'').toLowerCase();
  const threads = await Thread.find({userId:req.user.id, archived:{$ne:true}});
  let answer = '';
  if(q.includes('need my attention') || q.includes('need attention')){
    const t = threads.filter(x=>x.classification!=='no_reply' && x.unreadCount>0).slice(0,5);
    answer = t.length? `You have ${t.length} conversations needing attention: ` + t.map(x=>`"${x.subject}" (${x.classification.replace('_',' ')})`).join('; ') : 'No conversations need your attention right now.';
  } else if(q.includes('waiting for a response') || q.includes('waiting for response')){
    const t = threads.filter(x=>x.classification==='assistant_reply').slice(0,5);
    answer = t.length? `You are responsible for replying to ${t.length} conversations: ` + t.map(x=>`"${x.subject}"`).join(', ') : 'Nothing waiting on you.';
  } else if(q.includes('client') && q.includes('attention')){
    const t = threads.filter(x=>x.classification==='client_reply').slice(0,5);
    answer = t.length? `${t.length} emails require the client's attention: ` + t.map(x=>`"${x.subject}"`).join(', ') : 'No client attention items.';
  } else if(q.includes('summarize')){
    // find thread by subject mention
    const match = threads.find(t=> q.includes((t.subject||'').toLowerCase().slice(0,20)));
    if(match) answer = match.summary || 'No summary available.';
    else answer = threads[0]? `Latest: ${threads[0].subject} — ${threads[0].summary}` : 'No emails.';
  } else if(q.includes('why') && q.includes('client')){
    const match = threads.find(t=> t.classification==='client_reply' && q.includes((t.subject||'').toLowerCase().slice(0,15)));
    answer = match ? `Assigned to client because: ${match.reason}` : 'Please open a conversation and ask about its classification.';
  } else if(q.includes('draft a reply') || q.includes('draft reply')){
    answer = 'Open a conversation and use the "Draft Reply" button to generate and review an AI reply before sending.';
  } else if(q.includes('meeting') || q.includes('appointment')){
    const t = threads.filter(x=>x.segment==='meetings').slice(0,5);
    answer = t.length? `Upcoming meetings mentioned: ` + t.map(x=>`"${x.subject}" (${(x.importantDates||[]).join(', ')})`).join('; ') : 'No meetings found.';
  } else {
    answer = `I can help with: emails needing attention, what you're waiting on, client attention items, summaries, meetings, and reply drafting. You currently have ${threads.length} active conversations.`;
  }
  res.json({answer});
});

module.exports = router;