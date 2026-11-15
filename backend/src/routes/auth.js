const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sign } = require('../middleware/auth');

router.post('/signup', async (req,res)=>{
  try {
    const { name, email, password, role } = req.body;
    if(!name||!email||!password) return res.status(400).json({error:'Missing fields'});
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({error:'Email already registered'});
    const user = await User.create({name,email,password,role: role==='client'?'client':'assistant'});
    // if client, link to first assistant? leave null
    const token = sign(user);
    res.json({ token, user:{id:user._id,name:user.name,email:user.email,role:user.role} });
  } catch(e){ res.status(500).json({error:e.message}); }
});

router.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:'Invalid credentials'});
    const ok = await user.compare(password);
    if(!ok) return res.status(400).json({error:'Invalid credentials'});
    const token = sign(user);
    res.json({ token, user:{id:user._id,name:user.name,email:user.email,role:user.role} });
  } catch(e){ res.status(500).json({error:e.message}); }
});

router.get('/me', require('../middleware/auth').auth, async (req,res)=>{
  const user = await User.findById(req.user.id).select('-password');
  res.json({user});
});

module.exports = router;