const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: email => User.doesntExist({ email }),
      message: 'Email has already been taken.'
    }
  },
  username: {
    type: String,
    required: true,
    validate: {
      validator: username => User.doesntExist({ username }),
      message: 'Username has already been taken.'
    }
  },
  password: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  avatar: {
    type: String,
  },
  locale: {
    type: String,
  },
  social: {
    googleProvider: {
      id: String,
      token: String,
    }
  },
}, {
  timestamps: true
});

// hashes the password before it is stored in the database
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// checks if the option value does not exists in the database
userSchema.statics.doesntExist = async function (options) {
  return await this.where(options).countDocuments() === 0;
}

userSchema.methods.matchesPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.upsertGoogleUser = async function ({ accessToken, refreshToken, profile }) {
  const User = this;

  const user = await User.findOne({ 'social.googleProvider.id': profile.id });

  // create new user if none was found
  if (!user) {
    const { email, name, given_name, family_name, picture, locale } = profile._json;

    const newUser = await User.create({
      username: name,
      email,
      firstname: given_name,
      lastname: family_name,
      avatar: picture,
      'social.googleProvider': {
        id: profile.id,
        token: accessToken,
      },
      locale,
    });

    return newUser;
  }
  return user;
};

module.exports = User = mongoose.model('users', userSchema);
