const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const EmailAccount = require('../models/EmailAccount');
const Thread = require('../models/Thread');
const { classifyThread } = require('../services/ai');

const sampleThreads = [
  {
    subject: 'Quarterly budget approval needed',
    participants: ['ceo@client.com','assistant@pa.com'],
    messages: [
      {from:'ceo@client.com', body:'Hi, please review the attached Q3 budget. I need your approval on the marketing spend before Friday. Let me know your thoughts.', date: new Date(Date.now()-86400000*2), read:false},
    ],
    unreadCount:1
  },
  {
    subject: 'Reschedule: Strategy meeting',
    participants: ['partner@vendor.com','assistant@pa.com'],
    messages: [
      {from:'partner@vendor.com', body:'Can we reschedule our strategy meeting from Monday 10:00 AM to Wednesday 2:00 PM? Please confirm availability.', date: new Date(Date.now()-86400000), read:false},
      {from:'assistant@pa.com', body:'Checking calendar, will confirm shortly.', date: new Date(Date.now()-43200000), read:true}
    ],
    unreadCount:1
  },
  {
    subject: 'Newsletter: Industry trends October',
    participants: ['news@industry.com'],
    messages: [
      {from:'news@industry.com', body:'Unsubscribe anytime. Weekly digest of industry news and trends. No reply needed.', date: new Date(Date.now()-86400000*3), read:true}
    ],
    unreadCount:0
  },
  {
    subject: 'Contract signature required',
    participants: ['legal@firm.com','client@personal.com'],
    messages: [
      {from:'legal@firm.com', body:'The updated contract requires your signature. Please review and sign by Nov 20, 2026. Sensitive business discussion.', date: new Date(Date.now()-86400000*1), read:false}
    ],
    unreadCount:1
  },
  {
    subject: 'Invoice #4821 paid',
    participants: ['billing@service.com'],
    messages: [
      {from:'billing@service.com', body:'Your invoice #4821 has been paid. Receipt attached. No action required. Automated notification.', date: new Date(Date.now()-86400000*4), read:true}
    ],
    unreadCount:0
  },
  {
    subject: 'Meeting request: Project kickoff',
    participants: ['pm@agency.com','assistant@pa.com'],
    messages: [
      {from:'pm@agency.com', body:'Let us schedule the project kickoff meeting. Are you available next Tuesday 11:00 AM? Please confirm.', date: new Date(Date.now()-86400000*1), read:false}
    ],
    unreadCount:1
  },
  {
    subject: 'Follow up on pending proposal',
    participants: ['clientprospect@corp.com','assistant@pa.com'],
    messages: [
      {from:'clientprospect@corp.com', body:'Following up on the proposal sent last week. Could you provide an update? Need your response.', date: new Date(Date.now()-86400000*2), read:false},
      {from:'assistant@pa.com', body:'We are reviewing and will respond by end of week.', date: new Date(Date.now()-86400000), read:true}
    ],
    unreadCount:0
  },
  {
    subject: 'Personal decision: Relocation',
    participants: ['family@home.com','client@personal.com'],
    messages: [
      {from:'family@home.com', body:'We need your personal decision on the relocation offer. Your input is important. Please confirm your preference.', date: new Date(Date.now()-86400000*5), read:false}
    ],
    unreadCount:1
  },
  {
    subject: 'System update completed',
    participants: ['system@platform.com'],
    messages: [
      {from:'system@platform.com', body:'System update completed successfully. No action required. For your information.', date: new Date(Date.now()-86400000*6), read:true}
    ],
    unreadCount:0
  },
  {
    subject: 'Appointment confirmation with Dr. Lee',
    participants: ['clinic@health.com','assistant@pa.com'],
    messages: [
      {from:'clinic@health.com', body:'Your appointment is confirmed for Dec 5, 2026 at 9:30 AM. Please arrive 10 minutes early.', date: new Date(Date.now()-86400000*1), read:true}
    ],
    unreadCount:0
  },
  {
    subject: 'Urgent: Client approval for ad campaign',
    participants: ['marketing@agency.com','client@personal.com'],
    messages: [
      {from:'marketing@agency.com', body:'Urgent: need client approval for the new ad campaign before launch. Action required from you.', date: new Date(Date.now()-3600000*5), read:false}
    ],
    unreadCount:1
  },
  {
    subject: 'General update: Office hours',
    participants: ['hr@company.com'],
    messages: [
      {from:'hr@company.com', body:'Office hours updated for the holiday season. FYI only. No reply needed.', date: new Date(Date.now()-86400000*7), read:true}
    ],
    unreadCount:0
  },
];

router.post('/demo', auth, async (req,res)=>{
  try {
    // create account
    const acc = await EmailAccount.create({userId:req.user.id, provider:'gmail', email:req.user.email, status:'connected', lastSync:new Date()});
    // find or create a client user linked
    let client = await User.findOne({role:'client'});
    if(!client){
      client = await User.create({name:'Demo Client', email:'client@demo.com', password:'password123', role:'client', assistantId:req.user.id});
    } else {
      client.assistantId = req.user.id; await client.save();
    }
    // clear existing threads for this assistant
    await Thread.deleteMany({userId:req.user.id});
    for(const s of sampleThreads){
      const t = new Thread({
        userId: req.user.id,
        clientId: client._id,
        accountId: acc._id,
        subject: s.subject,
        participants: s.participants,
        messages: s.messages.map(m=>({...m, read:m.read})),
        unreadCount: s.unreadCount,
        lastMessageAt: s.messages[s.messages.length-1].date,
        isImportant: /urgent|approval|contract/i.test(s.subject)
      });
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
    }
    res.json({ok:true, count: sampleThreads.length, client:{email:client.email,password:'password123'}});
  } catch(e){ res.status(500).json({error:e.message}); }
});

module.exports = router;