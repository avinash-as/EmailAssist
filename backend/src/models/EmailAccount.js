const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  provider: { type: String, enum:['gmail','outlook','custom'], default:'gmail' },
  email: { type: String, required:true },
  status: { type: String, enum:['connected','syncing','error','disconnected'], default:'connected' },
  lastSync: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('EmailAccount', schema);