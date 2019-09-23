import React from "react";
import {
  IInputStructure,
  IObjectOfStrings,
  IForm,
  IFormWithEvent
} from "../interfaces";
import _ from "lodash";
import { INPUT_TYPES_NAMES, API_ERRORS } from "./constants";
import { FormValidator } from "../services";

export function validateForm({ event, form, formNode }: IFormWithEvent) {
  event.preventDefault();

  const validatedForm = FormValidator.validateForm(form);
  const inputsWithErrors = _.filter(validatedForm, input => !input.isValid);

  if (
    formNode.current instanceof HTMLFormElement &&
    inputsWithErrors.length > 0
  ) {
    setFocusOnFirstInvalidInput(form, formNode.current.elements);

    throw { validatedFormWithErrors: validatedForm }; // eslint-disable-line
  }

  return mapFormValuesForRequest(validatedForm);
}

export function handleChange(
  e: React.ChangeEvent<HTMLInputElement>,
  form: IForm
): IForm {
  const { value, name } = e.target;
  const newForm = Object.assign({}, form);
  let input = newForm[name] || {};

  input.touched = true;
  input.value = value;
  input = chooseInputValidationSchema(input, name, newForm);

  newForm[name] = input;

  return newForm;
}

export function mergeFormWithApiErrors(
  form: IForm,
  errors: IObjectOfStrings
): IForm {
  const mergedForm = Object.assign({}, form);
  for (const key in errors) {
    if (mergedForm[key]) {
      mergedForm[key].errorMsg = API_ERRORS[errors[key]];
    }
  }
  return mergedForm;
}

export function setFocusOnFirstInvalidInput(
  form: IForm,
  formElements: HTMLFormControlsCollection
): void {
  const inputWithError = _.find(form, "errorMsg");

  if (!inputWithError) return;

  const input = _.get(formElements, inputWithError.name);

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

export function mapFormValuesForRequest(form: IForm): IObjectOfStrings {
  const mappedForm: IObjectOfStrings = {};
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
  required: boolean = false
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
