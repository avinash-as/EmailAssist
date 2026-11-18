const required = [];
function loadEnv() {
  // Optional env vars documented here
  return {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personal_assist',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
    APP_URL: process.env.APP_URL || 'http://localhost:5000',
  };
}
module.exports = { loadEnv, required };