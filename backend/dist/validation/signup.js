"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator = require("validator");
const _ = require("lodash");
module.exports = function validateSignUpInput(data) {
    let errors = {};
    // Set data to be a string type if there is such property
    data.email = !_.isEmpty(data.email) ? data.email : "";
    data.password = !_.isEmpty(data.password) ? data.password : "";
    data.repeatPassword = !_.isEmpty(data.repeatPassword)
        ? data.repeatPassword
        : "";
    if (Validator.isEmpty(data.email)) {
        errors.email = "LOGIN_REQUIRED";
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
        isValid: _.isEmpty(errors)
    };
};
//# sourceMappingURL=signup.js.map