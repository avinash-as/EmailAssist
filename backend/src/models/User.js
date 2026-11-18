const bcrypt = require('bcryptjs');

const users = [];
let counter = 1;

function match(doc, query) {
  return Object.keys(query || {}).every(k => {
    const v = query[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if ('$ne' in v) return doc[k] !== v.$ne;
      if ('$gt' in v) return doc[k] > v.$gt;
      return JSON.stringify(doc[k]) === JSON.stringify(v);
    }
    return String(doc[k]) === String(v);
  });
}

class User {
  constructor(data) {
    this._id = String(counter++);
    this.name = data.name;
    this.email = (data.email || '').toLowerCase();
    this.password = data.password;
    this.role = data.role === 'client' ? 'client' : 'assistant';
    this.assistantId = data.assistantId || null;
    this.createdAt = new Date();
  }
  async save() {
    const idx = users.findIndex(u => u._id === this._id);
    if (idx === -1) users.push(this);
    else users[idx] = this;
    return this;
  }
  async compare(p) { return bcrypt.compare(p, this.password); }
}

User.create = async (data) => {
  const d = { ...data };
  if (d.password) d.password = await bcrypt.hash(d.password, 10);
  const u = new User(d);
  users.push(u);
  return u;
};

User.findOne = async (query) => users.find(u => match(u, query)) || null;
User.findById = async (id) => users.find(u => u._id === String(id)) || null;
User.find = async (query) => users.filter(u => match(u, query || {}));

module.exports = User;
module.exports._store = users;