const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['assistant','client'], default: 'assistant' },
  assistantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for clients linked to assistant
  createdAt: { type: Date, default: Date.now }
});
schema.pre('save', async function(){ if(!this.isModified('password')) return; this.password = await bcrypt.hash(this.password,10); });
schema.methods.compare = function(p){ return bcrypt.compare(p,this.password); };
module.exports = mongoose.model('User', schema);