const threads = [];
let counter = 1;

function match(doc, query) {
  return Object.keys(query || {}).every(k => {
    const v = query[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if ('$ne' in v) return doc[k] !== v.$ne;
      if ('$gt' in v) return doc[k] > v.$gt;
      if ('$in' in v) return v.$in.includes(doc[k]);
      return JSON.stringify(doc[k]) === JSON.stringify(v);
    }
    return String(doc[k]) === String(v);
  });
}

class Thread {
  constructor(data) {
    this._id = String(counter++);
    this.userId = data.userId;
    this.clientId = data.clientId;
    this.accountId = data.accountId;
    this.subject = data.subject;
    this.participants = data.participants || [];
    this.messages = data.messages || [];
    this.unreadCount = data.unreadCount || 0;
    this.lastMessageAt = data.lastMessageAt || new Date();
    this.isImportant = !!data.isImportant;
    this.isStarred = !!data.isStarred;
    this.archived = !!data.archived;
    this.status = data.status;
    this.classification = data.classification;
    this.confidence = data.confidence;
    this.reason = data.reason;
    this.needsReview = data.needsReview;
    this.summary = data.summary;
    this.actionItems = data.actionItems || [];
    this.importantDates = data.importantDates || [];
    this.segment = data.segment;
    this.createdAt = new Date();
  }
  async save() {
    const idx = threads.findIndex(t => t._id === this._id);
    if (idx === -1) threads.push(this);
    else threads[idx] = this;
    return this;
  }
}

function makeQuery(matched) {
  const q = {
    _matched: matched,
    sort(sortObj) {
      const key = Object.keys(sortObj || {})[0];
      const dir = sortObj ? sortObj[key] : 1;
      this._matched.sort((a, b) => {
        const va = a[key] instanceof Date ? a[key].getTime() : a[key];
        const vb = b[key] instanceof Date ? b[key].getTime() : b[key];
        if (va < vb) return dir === -1 ? 1 : -1;
        if (va > vb) return dir === -1 ? -1 : 1;
        return 0;
      });
      return this;
    },
    then(resolve, reject) { return Promise.resolve(this._matched).then(resolve, reject); },
    catch(reject) { return Promise.resolve(this._matched).catch(reject); },
  };
  return q;
}

Thread.create = async (data) => {
  const t = new Thread(data);
  threads.push(t);
  return t;
};
Thread.find = (query) => makeQuery(threads.filter(t => match(t, query || {})));
Thread.findOne = async (query) => threads.find(t => match(t, query)) || null;
Thread.deleteMany = async (query) => {
  const toRemove = threads.filter(t => match(t, query));
  toRemove.forEach(t => {
    const idx = threads.indexOf(t);
    if (idx !== -1) threads.splice(idx, 1);
  });
  return { deletedCount: toRemove.length };
};
Thread.deleteOne = async (query) => {
  const idx = threads.findIndex(t => match(t, query));
  if (idx !== -1) threads.splice(idx, 1);
  return { deletedCount: idx !== -1 ? 1 : 0 };
};

module.exports = Thread;