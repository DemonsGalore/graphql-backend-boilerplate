const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const { sessionID } = require('../config/keys');

const attemptSignIn = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AuthenticationError('Incorrect username. Please try again.');
  }

  if (!await user.matchesPassword(password)) {
    throw new AuthenticationError('Incorrect password.');
  }

  return user;
}

const signedIn = req => req.session.userId;

const ensureSignedIn = req => {
  if (!signedIn(req)) {
    throw new AuthenticationError('You are not signed in.');
  }
};

const ensureSignedOut = req => {
  if (signedIn(req)) {
    throw new AuthenticationError('You are already signed in.');
  }
};

const signOut = (req, res) => new Promise(
  (resolve, reject) => {
    req.session.destroy(error => {
      if (error) reject(error);
      res.clearCookie(sessionID);
      resolve(true);
    });
  }
);

module.exports = {
  attemptSignIn, ensureSignedIn, ensureSignedOut, signOut
};
