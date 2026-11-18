const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { loadEnv } = require('../config/env');
const EmailAccount = require('../models/EmailAccount');
const { google } = require('googleapis');

const env = loadEnv();

function oauthClient() {
  return new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI || `${env.APP_URL}/api/integrations/gmail/callback`);
}

router.get('/gmail/status', auth, async (req,res)=>{
  const acc = await EmailAccount.findOne({ userId: req.user.id, provider:'gmail' });
  res.json({ connected: !!acc && !!acc.accessToken, account: acc ? { email: acc.email, status: acc.status, lastSync: acc.lastSync } : null });
});

router.get('/gmail/connect', auth, (req,res)=>{
  if(!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET){
    return res.status(400).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' });
  }
  const client = oauthClient();
  const url = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.send','https://www.googleapis.com/auth/gmail.modify'],
    state: req.user.id,
  });
  res.json({ url });
});

router.get('/gmail/callback', async (req,res)=>{
  const { code, state } = req.query;
  if(!code) return res.status(400).send('Missing code');
  try {
    const client = oauthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const gmail = google.gmail({ version:'v1', auth: client });
    const profile = await gmail.users.getProfile({ userId:'me' });
    const email = profile.data.emailAddress;
    await EmailAccount.findOneAndUpdate(
      { userId: state, provider:'gmail', email },
      { userId: state, provider:'gmail', email, status:'connected', lastSync: new Date(), accessToken: tokens.access_token, refreshToken: tokens.refresh_token, tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null, scope: (tokens.scope||'') },
      { upsert: true, new: true }
    );
    res.redirect(`${env.APP_URL.replace(/\/$/,'')}/accounts?gmail=connected`);
  } catch(e){
    console.error(e);
    res.status(500).send('OAuth callback failed: '+e.message);
  }
});

router.post('/gmail/disconnect', auth, async (req,res)=>{
  await EmailAccount.deleteOne({ userId: req.user.id, provider:'gmail' });
  res.json({ ok:true });
});

router.post('/gmail/sync', auth, async (req,res)=>{
  const acc = await EmailAccount.findOne({ userId: req.user.id, provider:'gmail' });
  if(!acc || !acc.accessToken) return res.status(400).json({ error:'Gmail not connected' });
  try {
    const client = oauthClient();
    client.setCredentials({ access_token: acc.accessToken, refresh_token: acc.refreshToken, expiry_date: acc.tokenExpiry ? acc.tokenExpiry.getTime() : undefined });
    // refresh if needed
    if (acc.tokenExpiry && acc.tokenExpiry < new Date()) {
      const { credentials } = await client.refreshAccessToken();
      acc.accessToken = credentials.access_token;
      acc.tokenExpiry = credentials.expiry_date ? new Date(credentials.expiry_date) : acc.tokenExpiry;
      await acc.save();
      client.setCredentials({ access_token: acc.accessToken, refresh_token: acc.refreshToken, expiry_date: acc.tokenExpiry ? acc.tokenExpiry.getTime() : undefined });
    }
    const gmail = google.gmail({ version:'v1', auth: client });
    const list = await gmail.users.messages.list({ userId:'me', maxResults: 20 });
    const messages = list.data.messages || [];
    // naive: just count
    acc.lastSync = new Date(); acc.status='connected'; await acc.save();
    res.json({ ok:true, fetched: messages.length });
  } catch(e){
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;