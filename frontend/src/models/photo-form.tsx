import { FormValidator } from "../services";
import { createInputstructure } from "../lib/forms";
import { INPUT_TYPES, FORMS_LABELS, INPUT_TYPES_NAMES } from "../lib/constants";
import { IForm } from "../interfaces";

const PhotoFormInputs: IForm = {};
PhotoFormInputs[INPUT_TYPES_NAMES.PHOTO_KEYWORDS] = createInputstructure(
  INPUT_TYPES.TEXT_INPUT,
  INPUT_TYPES_NAMES.PHOTO_KEYWORDS,
  FORMS_LABELS.LABELS.PHOTO_KEYWORDS,
  {
    placeholder: FORMS_LABELS.PLACEHOLDERS.PHOTO_KEYWORDS,
    validation: {
      pattern: FormValidator.patterns[INPUT_TYPES_NAMES.PHOTO_KEYWORDS],
      validator: FormValidator.validateInputByPattern,
      message: FORMS_LABELS.ERRORS.PHOTO_KEYWORDS
    }
  },
  true
);
PhotoFormInputs[INPUT_TYPES_NAMES.PHOTO_DESCRIPTION] = createInputstructure(
  INPUT_TYPES.TEXT_AREA,
  INPUT_TYPES_NAMES.PHOTO_DESCRIPTION,
  FORMS_LABELS.LABELS.PHOTO_DESCRIPTION,
  {
    validation: {
      pattern: FormValidator.patterns[INPUT_TYPES_NAMES.PHOTO_DESCRIPTION],
      validator: FormValidator.validateInputByPattern,
      message: FORMS_LABELS.ERRORS.PHOTO_DESCRIPTION
    }
  }
);

export default PhotoFormInputs;
