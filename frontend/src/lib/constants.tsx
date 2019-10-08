import { IInputTypes, IRoutes, IObjectOfStrings } from "../interfaces";

export const ROUTES: IRoutes = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  TAKE_PICTURE: "/take-picture"
};

export const INPUT_TYPES: IInputTypes = {
  TEXT_INPUT: "text",
  TEXT_AREA: "textArea",
  EMAIL: "email",
  PASSWORD: "password",
  RECAPTCHA: "recaptcha",
};

export const INPUT_TYPES_NAMES: IInputTypes = {
  USER_NAME: "userName",
  EMAIL: "email",
  PASSWORD: "password",
  REPEAT_PASSWORD: "repeatPassword",
  RECAPTCHA: "recaptcha",
  GDPR_AGREEMENT: "is_gdpr_accepted",
  PHOTO_DESCRIPTION: "description",
  PHOTO_KEYWORDS: "hashtagsList"
};

export const FORMS_LABELS = {
  LABELS: {
    PHOTO_DESCRIPTION: "Describe your photo:",
    PHOTO_KEYWORDS: "Add up to 5 hash tag keywords:",
    USER_NAME: "User name:",
    EMAIL: "E-mail:",
    PASSWORD: "Password:",
    REPEAT_PASSWORD: "Repeat password:",
    RECAPTCHA: ""
  },
  ERRORS: {
    PHOTO_DESCRIPTION: "Description can have maximum of 500 signs",
    PHOTO_KEYWORDS: "Invalid hash tag keywords pattern",
    IS_REQUIRED: "Value is required",
    USER_NAME: "User name is incorrect",
    EMAIL: "Incorrect e-mail",
    PASSWORD: "Incorrect password",
    PASSWORD_NOT_EQUAL: "Passwords are not equal",
    RECAPTCHA: "You need to verify recaptcha"
  },
  PLACEHOLDERS: {
    PHOTO_KEYWORDS: "#party #friends #city #travel #night",
  }
};

export const SKIP_PHOTOS_DOCUMENTS: number = 2;

export const API_ERRORS: IObjectOfStrings = {
  PASSWORD_INCORRECT: "Password is incorrect",
  PASSWORD_REQUIRED: "Password is empty",
  PASSWORD_TOO_SHORT: "",
  PASSWORD_TOO_LONG: "",
  PASSWORD_CONFIRM_REQUIRED: "",
  PASSWORD_CONFIRM_INVALID: "",
  EMAIL_NOT_CONFIRMED: "Your account is not activated",
  EMAIL_NOT_FOUND: "Your email was not found",
  EMAIL_EXISTS: "Email is already taken",
  EMAIL_REQUIRED: "Email is empty",
  EMAIL_INVALID: "Email is incorrect",
  USER_NAME_REQUIRED: "User name is empty",
  AUTHOR_REQUIRED: "Author is required",
  PHOTO_REQUIRED: "Photo is required",
  HASHTAGS_REQUIRED: "Hashtags list required",
};
