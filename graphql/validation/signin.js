const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateSignUpInput = data => {
  let errors = {};

  // make sure if empty, it is an empty string
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // username validators
  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username field is required.';
  }

  // password validators
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
