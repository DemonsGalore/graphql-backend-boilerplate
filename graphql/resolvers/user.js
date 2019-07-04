const mongoose = require('mongoose');
const { UserInputError } = require('apollo-server-express');

const { User } = require('../../models');
const {
  attemptSignIn,
  ensureSignedOut,
  signOut,
} = require('../helpers/auth');
const { authenticateGoogle } = require('../helpers/passport');
const validateSignUpInput = require('../validation/signup');
const validateSignInInput = require('../validation/signin');

module.exports = {
  Query: {
    me: (root, args, { req }, info) => {
      return User.findById(req.session.userId);
    },
    user: (root, { id }, context, info) => {
      if (mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`User ID is not valid.`)
      }
      return User.findById(id);
    },
    users: (root, args, context, info) => {
      return User.find({});
    }
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      const { errors, isValid } = await validateSignUpInput(args);

      // check validation
      if (!isValid) {
        return errors;
      }

      // create new user
      const { email, username, firstname, lastname, password } = args;
      const newUser = new User({
        email,
        username,
        firstname,
        lastname,
        password,
      });
      const user = await newUser.save();

      req.session.userId = user.id;

      return user;
    },
    signIn: async (root, args, { req }, info) => {
      const { username, password } = args;
      const { errors, isValid } = await validateSignInInput(args);

      // check validation
      if (!isValid) {
        return errors;
      }

      const user = await attemptSignIn(username, password);

      req.session.userId = user.id;

      return user;
    },
    signOut: (root, args, { req, res }, info) => {
      return signOut(req, res);
    },
    authGoogle: async (_, { accessToken }, { req, res }) => {
      ensureSignedOut(req);

      req.body = {
        ...req.body,
        access_token: accessToken,
      };

      try {
        // data contains the accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateGoogle(req, res);

        if (data) {
          const user = await User.upsertGoogleUser(data);

          if (user) {
            req.session.userId = user.id;

            return user;
          }
        }

        if (info) {
          switch (info.code) {
            case 'ETIMEDOUT':
              return (new Error('Failed to reach Google: Try Again'));
            default:
              return (new Error('Something went wrong'));
          }
        }
        return (Error('Server error'));
      } catch (error) {
        return error;
      }
    },
  }
};
