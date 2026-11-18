require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { connect } = require('./db');
const { loadEnv } = require('./config/env');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const threadRoutes = require('./routes/threads');
const chatRoutes = require('./routes/chat');
const seedRoutes = require('./routes/seed');
const integrationRoutes = require('./routes/integrations');
const aiRoutes = require('./routes/ai');

const env = loadEnv();
const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({limit:'2mb'}));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/ai', aiRoutes);

const path = require('path');
const fs = require('fs');
app.get('/api/health', (req,res)=>res.json({ok:true, env: { openai: !!env.OPENAI_API_KEY, google: !!env.GOOGLE_CLIENT_ID } }));
const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (req,res)=> res.sendFile(path.join(distPath,'index.html')));
}

app.use(notFound);
app.use(errorHandler);

const PORT = env.PORT;
if (require.main === module) {
  connect().then(()=> app.listen(PORT, ()=> console.log('Server on '+PORT))).catch(e=>{console.error(e); process.exit(1);});
} else {
  connect().catch(e=>console.error('Mongo connect error', e));
}
module.exports = app;