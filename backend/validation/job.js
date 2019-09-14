const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateJobInput(data) {
  let errors = {};

  // Set data to be a string type if there is such property
  // data.email = !isEmpty(data.email) ? data.email : "";
  // data.password = !isEmpty(data.password) ? data.password : "";

  // if (!Validator.isEmail(data.email)) {
  //   errors.email = "EMAIL_INVALID";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
