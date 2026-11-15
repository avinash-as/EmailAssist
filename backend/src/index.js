require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connect } = require('./db');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const threadRoutes = require('./routes/threads');
const chatRoutes = require('./routes/chat');
const seedRoutes = require('./routes/seed');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({limit:'2mb'}));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/seed', seedRoutes);

const path = require('path');
const fs = require('fs');
app.get('/api/health', (req,res)=>res.json({ok:true}));
const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (req,res)=> res.sendFile(path.join(distPath,'index.html')));
}

const PORT = process.env.PORT || 5000;
connect().then(()=> app.listen(PORT, ()=> console.log('Server on '+PORT))).catch(e=>{console.error(e); process.exit(1);});