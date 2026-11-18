const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { seedDemo } = require('../services/seedDemo');

router.post('/demo', auth, async (req,res)=>{
  try {
    const result = await seedDemo(req.user.id);
    res.json(result);
  } catch(e){ res.status(500).json({error:e.message}); }
});

module.exports = router;