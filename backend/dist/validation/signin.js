"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator = require("validator");
const _ = require('lodash');
module.exports = function validateSignInInput(data) {
    let errors = {};
    data.email = !_.isEmpty(data.email) ? data.email : "";
    data.password = !_.isEmpty(data.password) ? data.password : "";
    if (Validator.isEmpty(data.email)) {
        errors.email = "EMAIL_REQUIRED";
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "PASSWORD_REQUIRED";
    }
    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};
//# sourceMappingURL=signin.js.map