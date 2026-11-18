const User = require('./models/User');
const { seedDemo } = require('./services/seedDemo');

async function connect() {
  console.log('Using in-memory data store (prototype)');
  try {
    let assistant = await User.findOne({ email: 'asst@test.com' });
    if (!assistant) {
      assistant = await User.create({ name: 'Demo Assistant', email: 'asst@test.com', password: 'password123', role: 'assistant' });
    }
    let client = await User.findOne({ email: 'client@demo.com' });
    if (!client) {
      client = await User.create({ name: 'Demo Client', email: 'client@demo.com', password: 'password123', role: 'client', assistantId: assistant._id });
    }
    const Thread = require('./models/Thread');
    const existing = await Thread.find({ userId: assistant._id });
    if (!existing || existing.length === 0) {
      await seedDemo(assistant._id);
    }
  } catch (e) {
    console.error('Seed error', e);
  }
}
module.exports = { connect };