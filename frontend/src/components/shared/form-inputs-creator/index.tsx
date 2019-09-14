import React, { Component, ChangeEvent } from "react";
import _ from "lodash";

import { Recaptcha } from "../../";
import {
  IInputStructure,
  IForm,
  IOptionsObject,
  IAnyObject
} from "../../../interfaces";
import "./styles.scss";
import { TextField } from "@material-ui/core";


export default function createInputs(
  formStructure: IForm,
  formData: IForm,
  handleChange: React.ChangeEventHandler,
  options: IOptionsObject<{ [key: string]: any }>
): JSX.Element[] {
  return _.map(formStructure, (input, inputName) => (
    <CreateInputByType
      inputElement={input}
      inputName={inputName}
      form={formData}
      handler={handleChange}
      key={inputName}
      options={options[inputName] ? options[inputName] : {}}
    />
  ));
}


interface ICreateInputByTypeProps {
  inputElement: IInputStructure;
  inputName: string;
  form: IForm;
  options: { [key: string]: any };
  handler: React.ChangeEventHandler;
}

class CreateInputByType extends Component<ICreateInputByTypeProps, {}> {
  render() {
    const { inputElement, inputName, form, handler, options } = this.props;
    let input: JSX.Element;

    switch (inputElement.type) {
      case "select":
        input = (
          <select
            className={inputElement.inputClassName || "form-control"}
            name={inputName}
            multiple={inputElement.multiple}
            onChange={
              handler as (event: ChangeEvent<HTMLSelectElement>) => void
            }
            required={inputElement.required}
            id={inputName}
            {...options}
          >
            {inputElement.options.map((option: IAnyObject) => (
              <option value={option.name} key={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        );
        break;
      case "textArea":
        input = (
          <TextField
            className={inputElement.inputClassName || "form-control"}
            type={inputElement.type}
            name={inputName}
            placeholder={inputElement.placeholder}
            value={form[inputName].value}
            id={inputName}
            label={inputElement.label}
            onChange={handler}
            margin="normal"
            rows={5}
            rowsMax={5}
            multiline
            fullWidth
            {...options}
          />
        );
        break;
      case "number":
        input = (
          <input
            className={inputElement.inputClassName || "form-control"}
            type={inputElement.type}
            name={inputName}
            placeholder={inputElement.placeholder}
            value={form[inputName].value}
            onChange={handler as (event: ChangeEvent<HTMLInputElement>) => void}
            required={inputElement.required}
            id={inputName}
            min={inputElement.min}
            max={inputElement.max}
            {...options}
          />
        );
        break;
      case "recaptcha":
        input = (
          <Recaptcha recaptchaHandler={options.recaptchaHandler ? options.recaptchaHandler : () => {}} />
        );
        break;
      default:
        input = (
          <TextField
            className={inputElement.inputClassName || "form-control"}
            type={inputElement.type}
            name={inputName}
            placeholder={inputElement.placeholder}
            value={form[inputName].value}
            id={inputName}
            onChange={handler}
            required={inputElement.required}
            label={inputElement.label}
            margin="normal"
            fullWidth
            {...options}
          />
        );
    }

    return (
      <div className={inputElement.wrapperClassName || "form-group"}>
        {input}
        <small className={inputElement.errorClassName || "form-error"}>
          {form[inputName].errorMsg}
        </small>
      </div>
    );
  }
}
