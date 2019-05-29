const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateSignUpInput = data => {
  let errors = {};

  // make sure if empty, it is an empty string
  data.username = !isEmpty(data.username) ? data.username : '';
  data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
  data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

  // username validators
  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'Username must be between 2 and 30 characters.';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username field is required.';
  }

  // firstname validators
  if (!Validator.isLength(data.firstname, { min: 2, max: 30 })) {
    errors.firstname = 'Firstname must be between 2 and 30 characters.';
  }

  // lastname validators
  if (!Validator.isLength(data.lastname, { min: 2, max: 30 })) {
    errors.lastname = 'Lastname must be between 2 and 30 characters.';
  }

  // email validators
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid.';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required.';
  }

  // password validators
  if (!Validator.isLength(data.password, { min: 6, max: 50 })) {
    errors.password = 'Password must be between 6 and 50 characters.';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required.';
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match.';
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
