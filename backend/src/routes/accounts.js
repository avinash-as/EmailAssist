const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const EmailAccount = require('../models/EmailAccount');
const Thread = require('../models/Thread');

router.get('/', auth, async (req,res)=>{
  const accounts = await EmailAccount.find({userId:req.user.id});
  res.json({accounts});
});

router.post('/connect', auth, async (req,res)=>{
  const { provider, email } = req.body;
  const acc = await EmailAccount.create({userId:req.user.id, provider:provider||'gmail', email, status:'syncing'});
  // simulate sync
  setTimeout(async()=>{ acc.status='connected'; acc.lastSync=new Date(); await acc.save(); }, 1500);
  res.json({account:acc});
});

router.delete('/:id', auth, async (req,res)=>{
  await EmailAccount.deleteOne({_id:req.params.id, userId:req.user.id});
  res.json({ok:true});
});

router.post('/:id/sync', auth, async (req,res)=>{
  const acc = await EmailAccount.findOne({_id:req.params.id, userId:req.user.id});
  if(!acc) return res.status(404).json({error:'Not found'});
  acc.status='syncing'; await acc.save();
  setTimeout(async()=>{ acc.status='connected'; acc.lastSync=new Date(); await acc.save(); },1200);
  res.json({account:acc});
});

module.exports = router;