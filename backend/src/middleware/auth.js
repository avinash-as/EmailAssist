const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
function auth(req,res,next){
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ')? h.slice(7): null;
  if(!token) return res.status(401).json({error:'Unauthorized'});
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch(e){ return res.status(401).json({error:'Invalid token'}); }
}
function sign(user){ return jwt.sign({id:user._id, role:user.role, name:user.name, email:user.email}, JWT_SECRET, {expiresIn:'7d'}); }
module.exports = { auth, sign, JWT_SECRET };