import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { Subject, of } from "rxjs";
import { concatMap, map, catchError } from "rxjs/operators";
import { withRouter, RouteComponentProps } from "react-router";
import { Button } from "@material-ui/core";

import { FormInputsCreator } from "../..";
import registerFormModel from "../../../models/register-form";
import { IForm, IObjectOfStrings, IFormWithEvent } from "../../../interfaces";
import {
  chooseInputValidationSchema,
  setFocusOnFirstInvalidInput,
  handleChange,
  validateForm,
  mergeFormWithApiErrors
} from "../../../lib/forms";
import "./styles.scss";
import { LinkWrapper } from "../../_HOCs";
import { INPUT_TYPES } from "../../../lib/constants";
import { FetchApi } from "../../../services";
import Spinner from "../../shared/spinner";

interface IRegistrationProccessFormData {
  mappedForm?: IObjectOfStrings;
  validatedFormWithErrors: IForm;
  errors?: IObjectOfStrings;
  success?: boolean;
}
interface IRegisterState {
  registerForm: IForm;
  submitting: boolean;
}
interface IProps extends RouteComponentProps<{}> {}

class RegisterForm extends PureComponent<IProps, IRegisterState> {
  private formNode: React.RefObject<HTMLFormElement>;
  private formSubmitStream: Subject<IFormWithEvent>;

  constructor(props: IProps) {
    super(props);

    this.formSubmitStream = new Subject();
    this.formNode = React.createRef();

    this.state = {
      registerForm: registerFormModel,
      submitting: false
    };
  }

  componentDidMount() {
    this.initializeFormSubmitStream();
  }

  componentWillUnmount() {
    this.formSubmitStream.unsubscribe();
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    this.setState(prevState => ({
      ...prevState,
      submitting: true
    }));

    this.formSubmitStream.next({
      event,
      form: this.state.registerForm,
      formNode: this.formNode
    });
  };

  public onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newForm = handleChange(e, this.state.registerForm);

    this.setState(previousState => ({
      ...previousState,
      registerForm: newForm
    }));
  };

  private handleRecaptcha = (value: string): void => {
    const inputName = INPUT_TYPES.RECAPTCHA;
    const registerForm = Object.assign({}, this.state.registerForm);
    let input = registerForm[inputName];

    input.touched = true;
    input.value = value;
    input = chooseInputValidationSchema(input, inputName, registerForm);

    registerForm[inputName] = input;

    this.setState(previousState => ({
      ...previousState,
      registerForm
    }));
  };

  private initializeFormSubmitStream() {
    this.formSubmitStream
      .pipe(
        concatMap(event => {
          return of(event).pipe(
            map(event => validateForm(event)),
            concatMap((mappedForm: IObjectOfStrings) =>
              FetchApi.post("/api/users/signup", mappedForm)
            ),
            catchError((error: Error) => of(error))
          );
        })
      )
      .subscribe((response: unknown) => {
        const data = response as IRegistrationProccessFormData;
        console.log(data);
        let newForm = this.state.registerForm;

        if (data.errors) {
          newForm = mergeFormWithApiErrors(
            this.state.registerForm,
            data.errors
          );
        }

        this.setState(() => ({
          registerForm: data.validatedFormWithErrors
            ? data.validatedFormWithErrors
            : newForm,
          submitting: false
        }));

        if (data.success) {
          const node = ReactDOM.findDOMNode(this);
          if (node !== null) {
            node.dispatchEvent(
              new CustomEvent("open-modal", {
                bubbles: true,
                detail: {
                  message:
                    "Registration was susccefull, check your email to activate account.",
                  autoClose: true
                }
              })
            );
          }
          this.props.history.push("/login");
        } else if (
          data.errors &&
          this.formNode.current instanceof HTMLFormElement
        ) {
          setFocusOnFirstInvalidInput(this.state.registerForm, this.formNode.current.elements);
        }
      });
  }

  render() {
    const recaptchaHandler = this.handleRecaptcha;
    const formCustomOptions = {
      [INPUT_TYPES.RECAPTCHA]: {
        recaptchaHandler
      }
    };
    const FormInputs: JSX.Element[] = FormInputsCreator(
      registerFormModel,
      this.state.registerForm,
      this.onChange,
      formCustomOptions
    );

    return (
      <form
        onSubmit={this.handleSubmit}
        className="form-group"
        ref={this.formNode}
        aria-live="polite"
        aria-label="login form"
      >
        {FormInputs}

        <div className="form-buttons-wrapper">
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            disabled={this.state.submitting}
          >
            Register
          </Button>
          <Button variant="outlined">
            <LinkWrapper href="/login" ariaLabel="go to login page">
              Login
            </LinkWrapper>
          </Button>
        </div>
        {this.state.submitting && <Spinner size={40} />}
      </form>
    );
  }
}

export default withRouter(RegisterForm);
