import { createInputstructure } from "../lib/forms";
import { INPUT_TYPES, FORMS_LABELS, INPUT_TYPES_NAMES } from "../lib/constants";
import { IForm } from "../interfaces";

const LoginFormInputs: IForm = {};
LoginFormInputs[INPUT_TYPES_NAMES.EMAIL] = createInputstructure(
  INPUT_TYPES.EMAIL,
  INPUT_TYPES_NAMES.EMAIL,
  FORMS_LABELS.LABELS.EMAIL,
  {},
  true
);
LoginFormInputs[INPUT_TYPES_NAMES.PASSWORD] = createInputstructure(
  INPUT_TYPES.PASSWORD,
  INPUT_TYPES_NAMES.PASSWORD,
  FORMS_LABELS.LABELS.PASSWORD,
  {},
  true
);

export default LoginFormInputs;
