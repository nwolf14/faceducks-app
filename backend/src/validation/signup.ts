import { IUserInput } from '../interfaces';
const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateSignUpInput(data: IUserInput) {
  let errors: IUserInput = {};

  if (_.isEmpty(data.userName)) {
    data.userName = "";
    errors.userName = "USER_NAME_REQUIRED";
  }

  if (_.isEmpty(data.email)) {
    data.email = "";
    errors.email = "EMAIL_REQUIRED";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "EMAIL_INVALID";
  }

  if (_.isEmpty(data.password)) {
    data.password = "";
    errors.password = "PASSWORD_REQUIRED";
  }

  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "PASSWORD_TOO_SHORT";
  }

  if (!Validator.isLength(data.password, { max: 50 })) {
    errors.password = "PASSWORD_TOO_LONG";
  }

  if (_.isEmpty(data.repeatPassword)) {
    data.repeatPassword = "";
    errors.repeatPassword = "PASSWORD_CONFIRM_REQUIRED";
  }

  if (!Validator.equals(data.password, data.repeatPassword)) {
    errors.repeatPassword = "PASSWORD_CONFIRM_INVALID";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

export {};
