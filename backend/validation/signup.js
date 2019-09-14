const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSignUpInput(data) {
  let errors = {};

  // Set data to be a string type if there is such property
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.repeatPassword = !isEmpty(data.repeatPassword)
    ? data.repeatPassword
    : "";
  data.isGdprAccepted = !isEmpty(data.isGdprAccepted)
    ? data.isGdprAccepted
    : false;

  if (!data.isGdprAccepted) {
    errors.gdpr = "GDPR_NOT_ACCEPTED";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "EMAIL_REQUIRED";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "EMAIL_INVALID";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "PASSWORD_REQUIRED";
  }

  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "PASSWORD_TOO_SHORT";
  }

  if (!Validator.isLength(data.password, { max: 100 })) {
    errors.password = "PASSWORD_TOO_LONG";
  }

  if (Validator.isEmpty(data.repeatPassword)) {
    errors.repeatPassword = "PASSWORD_CONFIRM_REQUIRED";
  }

  if (!Validator.equals(data.password, data.repeatPassword)) {
    errors.repeatPassword = "PASSWORD_CONFIRM_INVALID";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
