import { IPhotoInput } from "../lib/interfaces";
const _ = require('lodash');

module.exports = function validatePostPhotoPayload(data: IPhotoInput) {
  let errors: IPhotoInput = {};

  if (_.isEmpty(data.author)) {
    errors.author = "AUTHOR_REQUIRED";
  }

  if (_.isEmpty(data.authorId)) {
    errors.authorId = "AUTHOR_REQUIRED";
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

export {};
