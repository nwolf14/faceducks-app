import { IInputTypes, IRoutes } from "../interfaces";

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
  PHOTO_DESCRIPTION: "photoDescription",
  PHOTO_KEYWORDS: "photoKeywords",
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
