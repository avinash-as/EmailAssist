const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const ai = require('../services/ai');
const Thread = require('../models/Thread');

router.post('/categorize', auth, async (req,res)=>{
  const { subject='', body='' } = req.body;
  const category = await ai.categorizeEmail(subject, body);
  res.json({ category });
});

router.post('/summarize', auth, async (req,res)=>{
  const { subject='', body='', detailed=false } = req.body;
  const summary = await ai.summarizeEmail(subject, body, detailed);
  res.json({ summary });
});

router.post('/reply', auth, async (req,res)=>{
  const { subject='', body='', tone='Professional' } = req.body;
  const reply = await ai.generateReply(subject, body, tone);
  res.json({ reply });
});

router.post('/rewrite', auth, async (req,res)=>{
  const { text='', tone='Professional' } = req.body;
  const result = await ai.rewriteEmail(text, tone);
  res.json({ text: result });
});

router.post('/subject', auth, async (req,res)=>{
  const { text='' } = req.body;
  const subject = await ai.generateSubject(text);
  res.json({ subject });
});

router.post('/priority', auth, async (req,res)=>{
  const { subject='', body='' } = req.body;
  const priority = await ai.detectPriority(subject, body);
  res.json({ priority });
});

router.post('/chat', auth, async (req,res)=>{
  const { question, context='' } = req.body;
  const answer = await ai.chatAssistant(question, context);
  res.json({ answer });
});

// thread-level helpers
router.post('/thread/:id/summarize', auth, async (req,res)=>{
  const t = await Thread.findOne({ _id: req.params.id, userId: req.user.id });
  if(!t) return res.status(404).json({ error:'Not found' });
  const text = (t.messages||[]).map(m=>m.body).join('\n');
  const summary = await ai.summarizeEmail(t.subject, text, req.body?.detailed);
  t.summary = summary; await t.save();
  res.json({ summary, thread: t });
});

module.exports = router;