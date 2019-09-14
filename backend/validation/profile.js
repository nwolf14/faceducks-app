const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  // Set data to be a string type if there is such property
  data.name = !isEmpty(data.name) ? data.name : "";
  data.surname = !isEmpty(data.surname) ? data.surname : "";
  data.avatar = !isEmpty(data.avatar) ? data.avatar : "";
  data.creditCardNumber = !isEmpty(data.creditCardNumber)
    ? data.creditCardNumber
    : "";
  data.zipCode = !isEmpty(data.zipCode) ? data.zipCode : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (isEmpty(data.name)) {
    errors.name = "NAME_REQUIRED";
  }

  if (isEmpty(data.surname)) {
    errors.surname = "SURNAME_REQUIRED";
  }

  if (data.avatar !== "" && !Validator.isURL(data.avatar)) {
    errors.avatar = "AVATAR_INVALID";
  }

  if (
    data.creditCardNumber !== "" &&
    !Validator.isCreditCard(data.creditCardNumber)
  ) {
    errors.creditCardNumber = "CREDIT_CARD_INVALID";
  }

  if (data.zipCode !== "" && !Validator.isPostalCode(data.zipCode, "PL")) {
    errors.zipCode = "ZIP_CODE_INVALID";
  }

  if (
    data.phoneNumber !== "" &&
    (!data.phoneNumber.match(/\d{9}/g) ||
      !Validator.isLength(data.phoneNumber, { min: 0, max: 9 }))
  ) {
    errors.phoneNumber = "PHONE_NUMBER_INVALID";
  }

  if (!Validator.isLength(data.description, { max: 400 })) {
    errors.description = "DESCRIPTION_TOO_LONG";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
