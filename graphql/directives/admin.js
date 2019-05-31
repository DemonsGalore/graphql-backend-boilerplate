const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

const { ensureIsAdmin } = require('../helpers/auth');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function(...args) {
      const [, , context] = args;

      await ensureIsAdmin(context.req);

      return resolve.apply(this, args);
    }
  }
}

module.exports = AuthDirective;
