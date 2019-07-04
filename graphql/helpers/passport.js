const passport = require('passport');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');

const { googleClientID, googleClientSecret } = require('../../config/keys');

const GoogleTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
  accessToken,
  refreshToken,
  profile,
});

passport.use(new GoogleTokenStrategy({
  clientID: googleClientID,
  clientSecret: googleClientSecret,
}, GoogleTokenStrategyCallback));

// promisified authenticate functions
const authenticateGoogle = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('google-token', { session: false }, (err, data, info) => {
    if (err) reject(err);
    resolve({ data, info });
  })(req, res);
});

module.exports = { authenticateGoogle };
