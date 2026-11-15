const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
  from: String,
  to: [String],
  body: String,
  date: Date,
  read: { type: Boolean, default: false }
}, { _id: true });
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true }, // owner (assistant)
  clientId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref:'EmailAccount' },
  subject: String,
  participants: [String],
  messages: [msgSchema],
  classification: { type: String, enum:['assistant_reply','client_reply','no_reply'], default:'no_reply' },
  confidence: { type: Number, default: 0.5 },
  reason: String,
  needsReview: { type: Boolean, default: false },
  summary: String,
  actionItems: [String],
  importantDates: [String],
  isImportant: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  status: { type: String, enum:['open','done'], default:'open' },
  segment: { type: String, default:'general' }, // action_required, waiting, meetings, important, general
  unreadCount: { type: Number, default: 0 },
  lastMessageAt: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Thread', schema);