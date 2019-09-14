import { IInputStructure, IForm, IMappedForm } from "../interfaces";
import _ from "lodash";
import { INPUT_TYPES_NAMES } from './constants';


export function setFocusOnFirstInvalidInput(inputsWithErrors: IInputStructure[], formElements: HTMLFormControlsCollection): void {
  const inputName = _.get(_.first(inputsWithErrors), 'name', '');
  const input = _.get(formElements, inputName);

  console.log('inputsWithErrors: ', inputsWithErrors);
  if (input) {
    input.focus();
  }
}

export function setFocusOnFirstFormElement(
  formElements: HTMLFormElement | null
): void {
  if (formElements instanceof HTMLFormElement) {
    const element = formElements[0] as HTMLInputElement;
    element.focus();
  }
}

export function mapFormValuesForRequest(form: IForm): IMappedForm {
  const mappedForm: IMappedForm = {};
  for (let prop in form) {
    mappedForm[prop] = form[prop].value;
  }
  return mappedForm;
}

export function chooseInputValidationSchema(
  input: IInputStructure,
  inputName: string = "",
  form: IForm
): IInputStructure {
  let validatedInput = input;

  if (input.validation) {
    if (inputName === INPUT_TYPES_NAMES.PASSWORD) {
      validatedInput = input.validation.validator(
        input,
        form[INPUT_TYPES_NAMES.REPEAT_PASSWORD]
      );
    } else if (inputName === INPUT_TYPES_NAMES.REPEAT_PASSWORD) {
      validatedInput = input.validation.validator(
        input,
        form[INPUT_TYPES_NAMES.PASSWORD]
      );
    } else {
      validatedInput = input.validation.validator(input);
    }
  }

  return validatedInput;
}

export function createInputstructure(
  type: string,
  name: string = "",
  label: string,
  extraProps: object = {},
  required: boolean = false,
): IInputStructure {
  return {
    type,
    name,
    label,
    value: "",
    required,
    touched: false,
    isValid: false,
    errorMsg: "",
    ...extraProps
  };
}

// export function renderResponseErrors(errors) {
// 	return (
// 		<div>
// 			<h3 className="error">Errors:</h3>
// 			{_.map(errors, (error, key) => {
// 				return (
// 					<p key={key}>
// 						{key}: {error}
// 					</p>
// 				);
// 			})}
// 		</div>
// 	);
// }
