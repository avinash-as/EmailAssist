const accounts = [];
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

class EmailAccount {
  constructor(data) {
    this._id = String(counter++);
    this.userId = data.userId;
    this.provider = data.provider || 'gmail';
    this.email = data.email;
    this.status = data.status || 'connected';
    this.lastSync = data.lastSync || new Date();
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.tokenExpiry = data.tokenExpiry;
    this.scope = data.scope;
    this.createdAt = new Date();
  }
  async save() {
    const idx = accounts.findIndex(a => a._id === this._id);
    if (idx === -1) accounts.push(this);
    else accounts[idx] = this;
    return this;
  }
}

EmailAccount.create = async (data) => {
  const a = new EmailAccount(data);
  accounts.push(a);
  return a;
};
EmailAccount.findOne = async (query) => accounts.find(a => match(a, query)) || null;
EmailAccount.find = async (query) => accounts.filter(a => match(a, query || {}));
EmailAccount.deleteOne = async (query) => {
  const idx = accounts.findIndex(a => match(a, query));
  if (idx !== -1) accounts.splice(idx, 1);
  return { deletedCount: idx !== -1 ? 1 : 0 };
};
EmailAccount.findOneAndUpdate = async (query, data, opts) => {
  let doc = accounts.find(a => match(a, query));
  if (!doc && opts && opts.upsert) {
    doc = new EmailAccount({ ...query, ...data });
    accounts.push(doc);
  } else if (doc) {
    Object.assign(doc, data);
  }
  return doc;
};

module.exports = EmailAccount;