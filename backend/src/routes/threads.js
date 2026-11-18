const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Thread = require('../models/Thread');
const { classifyThread } = require('../services/ai');

// list with filters
router.get('/', auth, async (req,res)=>{
  try {
    const { segment, classification, search, important, unread, archived } = req.query;
    const q = { userId: req.user.id };
    if (archived === 'true') q.archived = true; else q.archived = { $ne: true };
    if (segment && segment !== 'all') q.segment = segment;
    if (classification) q.classification = classification;
    if (important === 'true') q.isImportant = true;
    if (unread === 'true') q.unreadCount = { $gt: 0 };
    let threads = await Thread.find(q).sort({lastMessageAt:-1});
    if (search) {
      const s = search.toLowerCase();
      threads = threads.filter(t => (t.subject||'').toLowerCase().includes(s) || (t.participants||[]).join(' ').toLowerCase().includes(s) || (t.messages||[]).some(m=>(m.body||'').toLowerCase().includes(s)));
    }
    res.json({ threads });
  } catch(e){ res.status(500).json({error:e.message}); }
});

router.get('/stats', auth, async (req,res)=>{
  const all = await Thread.find({userId:req.user.id, archived:{$ne:true}});
  const stats = {
    total: all.length,
    unread: all.reduce((a,t)=>a+(t.unreadCount||0),0),
    important: all.filter(t=>t.isImportant).length,
    actionRequired: all.filter(t=>t.segment==='action_required').length,
    waiting: all.filter(t=>t.segment==='waiting' || t.classification==='assistant_reply').length, // rough
    assistantReply: all.filter(t=>t.classification==='assistant_reply').length,
    clientReply: all.filter(t=>t.classification==='client_reply').length,
    noReply: all.filter(t=>t.classification==='no_reply').length,
    meetings: all.filter(t=>t.segment==='meetings').length
  };
  res.json({stats});
});

router.get('/:id', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, userId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  // mark read
  t.unreadCount = 0;
  t.messages.forEach(m=>m.read=true);
  await t.save();
  res.json({thread:t});
});

router.patch('/:id', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, userId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  const { classification, isImportant, isStarred, archived, status, segment } = req.body;
  if(classification){ t.classification=classification; }
  if(typeof isImportant==='boolean') t.isImportant=isImportant;
  if(typeof isStarred==='boolean') t.isStarred=isStarred;
  if(typeof archived==='boolean') t.archived=archived;
  if(status) t.status=status;
  if(segment) t.segment=segment;
  // reclassify ai if classification changed? keep reason update
  if(classification){
    const ai = classifyThread(t);
    t.reason = t.reason || ai.reason;
  }
  await t.save();
  res.json({thread:t});
});

router.post('/:id/reclassify', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, userId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  const ai = classifyThread(t);
  t.classification=ai.classification;
  t.confidence=ai.confidence;
  t.reason=ai.reason;
  t.needsReview=ai.needsReview;
  t.summary=ai.summary;
  t.actionItems=ai.actionItems;
  t.importantDates=ai.importantDates;
  t.segment=ai.segment;
  await t.save();
  res.json({thread:t, ai});
});

router.post('/:id/draft', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, userId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  const last = t.messages[t.messages.length-1];
  const draft = `Dear ${ (t.participants||[])[0] || 'there' },\n\nThank you for your email regarding "${t.subject}". ${t.classification==='assistant_reply' ? 'I have reviewed your request and here is my response.' : 'I am following up on this matter.'}\n\n${(t.actionItems||[]).slice(0,2).map(a=>'- '+a).join('\n')}\n\nPlease let me know if you need any further assistance.\n\nBest regards,\nPersonal Assistant`;
  res.json({draft});
});

router.post('/:id/reply', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, userId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  const { body } = req.body;
  t.messages.push({ from: req.user.email, to: t.participants, body, date: new Date(), read: true });
  t.lastMessageAt = new Date();
  t.unreadCount = 0;
  // reconsider classification
  const ai = classifyThread(t);
  t.classification = ai.classification;
  t.confidence = ai.confidence;
  t.reason = ai.reason;
  t.needsReview = ai.needsReview;
  t.summary = ai.summary;
  t.segment = ai.segment;
  await t.save();
  res.json({thread:t});
});

router.post('/:id/complete', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, userId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  t.status='done';
  t.classification='no_reply';
  await t.save();
  res.json({thread:t});
});

// client-facing: threads assigned to client
router.get('/client/list', auth, async (req,res)=>{
  // client user sees threads where clientId == user.id
  const threads = await Thread.find({clientId: req.user.id, classification:'client_reply', archived:{$ne:true}}).sort({lastMessageAt:-1});
  res.json({threads});
});

router.get('/client/:id', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, clientId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  res.json({thread:t});
});

router.post('/client/:id/handle', auth, async (req,res)=>{
  const t = await Thread.findOne({_id:req.params.id, clientId:req.user.id});
  if(!t) return res.status(404).json({error:'Not found'});
  const { action } = req.body; // 'handled' or 'assistant_takeover'
  if(action==='assistant_takeover'){
    t.classification='assistant_reply';
    t.reason='Client requested assistant to take over.';
  } else {
    t.status='done';
    t.classification='no_reply';
  }
  await t.save();
  res.json({thread:t});
});

router.post('/compose', auth, async (req,res)=>{
  try {
    const { to, subject, body } = req.body;
    if(!to || !subject || !body) return res.status(400).json({error:'Missing fields'});
    const t = await Thread.create({
      userId: req.user.id,
      subject,
      participants: [to, req.user.email],
      messages: [{ from: req.user.email, to, body, date: new Date(), read: true }],
      unreadCount: 0,
      lastMessageAt: new Date(),
      classification: 'no_reply',
      segment: 'general',
      summary: body.slice(0,200),
    });
    res.json({ thread: t });
  } catch(e){ res.status(500).json({error:e.message}); }
});

module.exports = router;