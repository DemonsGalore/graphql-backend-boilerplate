module.exports = {
  mongoURI: process.env.MONGO_URI,
  inProduction: true,
  sessionID: process.env.SID,
  sessionSecret: process.env.SESSION_SECRET,
  sessionLifetime: 1000 * 60 * 60 * 24, // ms * s * min * h
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};
