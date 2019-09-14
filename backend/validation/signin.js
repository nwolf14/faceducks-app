const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSignInInput(data) {
  let errors = {};

  // Set data to be a string type if there is such property
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "EMAIL_INVALID";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "EMAIL_REQUIRED";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "PASSWORD_REQUIRED";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
