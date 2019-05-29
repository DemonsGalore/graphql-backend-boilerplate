const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

const { ensureSignedOut } = require('../auth');

class GuestDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = function(...args) {
      const [, , context] = args;

      ensureSignedOut(context.req);

      return resolve.apply(this, args);
    }
  }
}

module.exports = GuestDirective;
