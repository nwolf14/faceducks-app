"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
module.exports = function validatePostPhotoPayload(data) {
    let errors = {};
    if (_.isEmpty(data.author)) {
        errors.author = "AUTHOR_REQUIRED";
    }
    if (_.isEmpty(data.photo)) {
        errors.photo = "PHOTO_REQUIRED";
    }
    if (_.isEmpty(data.hashtagsList)) {
        errors.hashtagsList = "HASHTAGS_REQUIRED";
    }
    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};
//# sourceMappingURL=post-photo.js.map