import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { Subject, Observer, Observable, of } from "rxjs";
import { concatMap, map, catchError } from "rxjs/operators";
import firebase from "firebase";
import { withRouter, RouteComponentProps } from "react-router";
import _ from "lodash";
import { Button } from "@material-ui/core";

import { FormInputsCreator } from "../..";
import registerFormModel from "../../../models/register-form";
import { IForm, IMappedForm, IFirebaseError } from "../../../interfaces";
import {
  mapFormValuesForRequest,
  chooseInputValidationSchema,
  setFocusOnFirstInvalidInput,
  setFocusOnFirstFormElement
} from "../../../lib/forms";
import "./styles.scss";
import { LinkWrapper } from "../../_HOCs";
import { INPUT_TYPES } from "../../../lib/constants";
import { FormValidator } from "../../../services";
import Spinner from "../../shared/spinner";

interface IRegistrationProccessFormData {
  mappedForm?: IMappedForm;
  validatedFormWithErrors: IForm;
  firebaseData?: firebase.auth.UserCredential;
  firebaseError?: Error;
  success?: boolean;
}
interface IRegisterState {
  registerForm: IForm;
  registerFormError: string;
  submitting: boolean;
}
interface IProps extends RouteComponentProps<{}> {}

class RegisterForm extends PureComponent<IProps, IRegisterState> {
  private formNode: React.RefObject<HTMLFormElement>;
  private formSubmitStream: Subject<React.FormEvent<HTMLFormElement>>;

  constructor(props: IProps) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRecaptcha = this.handleRecaptcha.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formSubmitStream = new Subject();
    this.formNode = React.createRef();

    this.state = {
      registerForm: registerFormModel,
      registerFormError: "",
      submitting: false
    };
  }

  componentDidMount() {
    this.initializeFormSubmitStream();
  }

  componentWillUnmount() {
    this.formSubmitStream.unsubscribe();
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    this.formSubmitStream.next(e);
  };

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    const registerForm = Object.assign({}, this.state.registerForm);
    let input = registerForm[name] || {};

    input.touched = true;
    input.value = value;
    input = chooseInputValidationSchema(input, name, registerForm);

    registerForm[name] = input;

    this.setState(previousState => ({
      ...previousState,
      registerForm
    }));
  };

  private handleRecaptcha(value: string): void {
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
  }

  private validateForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState(prevState => ({
      ...prevState,
      submitting: true
    }));

    const validatedForm = FormValidator.validateForm(this.state.registerForm);
    const inputsWithErrors = _.filter(validatedForm, input => !input.isValid);

    if (this.formNode.current instanceof HTMLFormElement) {
      if (inputsWithErrors.length > 0) {
        setFocusOnFirstInvalidInput(
          inputsWithErrors,
          this.formNode.current.elements
        );

        throw { validatedFormWithErrors: validatedForm }; // eslint-disable-line
      }
    }
    return mapFormValuesForRequest(validatedForm);
  };

  private checkIfUserNameExists = (mappedForm: IMappedForm) => {
    return Observable.create(
      (
        observer: Observer<
          | {
              mappedForm: IMappedForm;
            }
          | {
              firebaseError: IFirebaseError;
            }
        >
      ) => {
        if (mappedForm) {
          firebase
            .database()
            .ref("users")
            .orderByChild("userName")
            .equalTo(mappedForm.userName)
            .once("value", (snapshot: firebase.database.DataSnapshot) => {
              if (!snapshot.exists()) {
                observer.next({ mappedForm });
              } else {
                observer.next({
                  firebaseError: {
                    code: "USER_EXISTS",
                    message: "User name is already in use"
                  }
                });
              }
            });
        } else {
          observer.complete();
        }
      }
    ).pipe(concatMap(this.createUser));
  };

  private createUser = ({
    firebaseError,
    mappedForm
  }: IRegistrationProccessFormData) => {
    return Observable.create(
      (
        observer: Observer<
          | {
              firebaseData: firebase.auth.UserCredential;
              mappedForm: IMappedForm;
            }
          | {
              firebaseError: Error;
            }
        >
      ) => {
        if (firebaseError) throw { firebaseError }; // eslint-disable-line

        if (mappedForm) {
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              mappedForm.email,
              mappedForm.password
            )
            .then((firebaseData: firebase.auth.UserCredential) =>
              observer.next({ firebaseData, mappedForm })
            )
            .catch((firebaseError: Error) => {
              observer.next({ firebaseError });
            })
            .finally(() => observer.complete());
        } else {
          observer.complete();
        }
      }
    ).pipe(concatMap(this.signInUser));
  };

  private signInUser = ({
    firebaseError,
    firebaseData,
    mappedForm
  }: IRegistrationProccessFormData) => {
    return Observable.create(
      (
        observer: Observer<
          | {
              firebaseData: firebase.auth.UserCredential;
              mappedForm: IMappedForm;
            }
          | { firebaseError: Error }
        >
      ) => {
        if (firebaseError) throw { firebaseError }; // eslint-disable-line

        if (firebaseData && mappedForm) {
          firebase
            .auth()
            .signInWithEmailAndPassword(mappedForm.email, mappedForm.password)
            .then((firebaseData: firebase.auth.UserCredential) =>
              observer.next({ firebaseData, mappedForm })
            )
            .catch((firebaseError: Error) => {
              observer.next({ firebaseError });
            })
            .finally(() => observer.complete());
        } else {
          observer.complete();
        }
      }
    ).pipe(concatMap(this.createAdditionalUserData));
  };

  private createAdditionalUserData = ({
    firebaseError,
    firebaseData,
    mappedForm
  }: IRegistrationProccessFormData) => {
    return Observable.create(
      (
        observer: Observer<
          | { firebaseData: firebase.auth.UserCredential; success: boolean }
          | { firebaseError: Error }
        >
      ) => {
        if (firebaseError) throw { firebaseError }; // eslint-disable-line

        if (mappedForm && firebaseData && firebaseData.user !== null) {
          firebase
            .database()
            .ref("users/" + firebaseData.user.uid)
            .set(
              {
                userName: mappedForm.userName
              },
              (firebaseError: Error | null) => {
                observer.next(
                  firebaseError
                    ? { firebaseError }
                    : { firebaseData, success: true }
                );
                observer.complete();
              }
            );
        } else {
          observer.complete();
        }
      }
    );
  };

  private initializeFormSubmitStream() {
    this.formSubmitStream
      .pipe(
        concatMap(event => {
          return of(event).pipe(
            map(this.validateForm),
            concatMap(this.checkIfUserNameExists),
            catchError((error: Error) => of(error))
          );
        })
      )
      .subscribe((value: unknown) => {
        const data = value as IRegistrationProccessFormData;

        this.setState(prevState => ({
          registerFormError: data.firebaseError
            ? data.firebaseError.message
            : "",
          registerForm: data.validatedFormWithErrors
            ? data.validatedFormWithErrors
            : prevState.registerForm,
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
                    "Registration was susccefull, now you are logged in.",
                  autoClose: true
                }
              })
            );
          }
          this.props.history.push("/take-picture");
        } else if (data.firebaseError && this.formNode.current instanceof HTMLFormElement){
          setFocusOnFirstFormElement(this.formNode.current)
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
      this.handleChange,
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
        <small className="form-error">{this.state.registerFormError}</small>
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
