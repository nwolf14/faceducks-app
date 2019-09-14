import { FormValidator } from "../services/";
import { createInputstructure } from "../lib/forms";
import { INPUT_TYPES, FORMS_LABELS, INPUT_TYPES_NAMES } from "../lib/constants";
import { IForm } from "../interfaces";

const RegisterFormInputs: IForm = {};
RegisterFormInputs[INPUT_TYPES_NAMES.USER_NAME] = createInputstructure(
  INPUT_TYPES.TEXT_INPUT,
  INPUT_TYPES_NAMES.USER_NAME,
  FORMS_LABELS.LABELS.USER_NAME,
  {
    validation: {
      pattern: FormValidator.patterns.userName,
      validator: FormValidator.validateInputByPattern,
      message: FORMS_LABELS.ERRORS.USER_NAME
    }
  },
  true
);
RegisterFormInputs[INPUT_TYPES_NAMES.EMAIL] = createInputstructure(
  INPUT_TYPES.EMAIL,
  INPUT_TYPES_NAMES.EMAIL,
  FORMS_LABELS.LABELS.EMAIL,
  {
    validation: {
      pattern: FormValidator.patterns.email,
      validator: FormValidator.validateEmail,
      message: FORMS_LABELS.ERRORS.EMAIL
    }
  },
  true
);
RegisterFormInputs[INPUT_TYPES_NAMES.PASSWORD] = createInputstructure(
  INPUT_TYPES.PASSWORD,
  INPUT_TYPES_NAMES.PASSWORD,
  FORMS_LABELS.LABELS.PASSWORD,
  {
    validation: {
      pattern: FormValidator.patterns.password,
      validator: FormValidator.areFieldsEqual,
      message: {
        notEqual: FORMS_LABELS.ERRORS.PASSWORD_NOT_EQUAL,
        wrongPattern: FORMS_LABELS.ERRORS.PASSWORD
      }
    }
  },
  true
);
RegisterFormInputs[INPUT_TYPES_NAMES.REPEAT_PASSWORD] = createInputstructure(
  INPUT_TYPES.PASSWORD,
  INPUT_TYPES_NAMES.REPEAT_PASSWORD,
  FORMS_LABELS.LABELS.REPEAT_PASSWORD,
  {
    validation: {
      pattern: FormValidator.patterns.password,
      validator: FormValidator.areFieldsEqual,
      message: {
        notEqual: FORMS_LABELS.ERRORS.PASSWORD_NOT_EQUAL,
        wrongPattern: FORMS_LABELS.ERRORS.PASSWORD
      }
    }
  },
  true
);
RegisterFormInputs[INPUT_TYPES_NAMES.RECAPTCHA] = createInputstructure(
  INPUT_TYPES.RECAPTCHA,
  INPUT_TYPES_NAMES.RECAPTCHA,
  FORMS_LABELS.LABELS.RECAPTCHA,
  {
    validation: {
      pattern: FormValidator.patterns.recaptcha,
      validator: FormValidator.validateInputByPattern,
      message: FORMS_LABELS.ERRORS.RECAPTCHA
    }
  },
  false
);

export default RegisterFormInputs;
