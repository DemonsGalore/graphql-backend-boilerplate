const AdminDirective = require('./admin');
const AuthDirective = require('./auth');
const GuestDirective = require('./guest');

module.exports = {
  admin: AdminDirective,
  auth: AuthDirective,
  guest: GuestDirective
};
