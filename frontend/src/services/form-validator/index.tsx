import v from 'validator';
import _ from 'lodash';
import { chooseInputValidationSchema } from '../../lib/forms';
import { IForm, IInputStructure } from '../../interfaces';
import { FORMS_LABELS, INPUT_TYPES_NAMES } from '../../lib/constants';

interface IValidatorPatterns {
  [key: string]: RegExp;
}

export default class validator {
	static patterns: IValidatorPatterns = {
		[INPUT_TYPES_NAMES.USER_NAME]: /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i,
		[INPUT_TYPES_NAMES.EMAIL]: /^\D+(,?\s[A-z0-9]+)+$/i,
		[INPUT_TYPES_NAMES.PASSWORD]: /^[-\w\.\$@\*\!]{4,30}$/i, // eslint-disable-line
		[INPUT_TYPES_NAMES.RECAPTCHA]: /^.+$/,
		[INPUT_TYPES_NAMES.PHOTO_KEYWORDS]: /^#[a-zA-Z]{1,30}\s?(#[a-zA-Z]{1,30})?\s?(#[a-zA-Z]{1,30})?\s?(#[a-zA-Z]{1,30})?\s?(#[a-zA-Z]{1,30})?$/,
		[INPUT_TYPES_NAMES.PHOTO_DESCRIPTION]: /^[\w\s]{0,500}$/,
	}

	static validateForm(form: IForm): IForm {
		const validatedForm = _.cloneDeep(form);

		_.map(validatedForm, (input, inputName) => {
			validatedForm[inputName] = chooseInputValidationSchema(input, inputName, validatedForm);
		});

		return validatedForm;
	}

	static validateInputByPattern(input: IInputStructure): IInputStructure {
		let isValidValue = true;

		if (input.validation.pattern) {
      const inputValue = v.escape(v.ltrim(input.value));
			isValidValue = !!inputValue.match(input.validation.pattern);
		}

		return returnInputAfterValidation(input, isValidValue);
	};

	static validateEmail(input: IInputStructure): IInputStructure {
    const inputValue = v.escape(v.ltrim(input.value));
		const isValidValue = v.isEmail(inputValue);
		return returnInputAfterValidation(input, isValidValue);
	}

	static validatePhoneNumber(input: IInputStructure): IInputStructure {
    const inputValue = v.escape(v.ltrim(input.value));
		const isValidValue = v.isMobilePhone(inputValue, 'pl-PL');
		return returnInputAfterValidation(input, isValidValue);
	}

	static areFieldsEqual(input: IInputStructure, secondInput: IInputStructure): IInputStructure {
    const inputValue = v.escape(v.ltrim(input.value));

		if (inputValue !== secondInput.value) {
			return serializeInput(input, false, input.validation.message.notEqual);
		}

		if (inputValue.match(input.validation.pattern)) {
			secondInput.errorMsg = '';
			secondInput.isValid = true;

			return serializeInput(input, true, '');

		} else {
			return serializeInput(input, false, input.validation.message.wrongPattern);
		}
	}

	static validateCheckbox(input: IInputStructure): IInputStructure {
		const isValidValue = !!input.value;
		return returnInputAfterValidation(input, isValidValue);
	}
}

const returnInputAfterValidation = function(input: IInputStructure, isValid: boolean = true): IInputStructure {
	if (input.required && _.isEmpty(input.value)) {
		return serializeInput(input, false, FORMS_LABELS.ERRORS.IS_REQUIRED);
	}

	if (isValid) {
		return serializeInput(input, isValid, '');
	} else {
		return serializeInput(input, false, input.validation.message);
	}
}

const serializeInput = function(input: IInputStructure, isValid: boolean = false, errorMsg: string = ''): IInputStructure {
	return {
		...input,
		isValid,
		errorMsg
	}; 
}