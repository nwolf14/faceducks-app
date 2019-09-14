import React, { PureComponent } from "react";
import ReactDOM from 'react-dom';
import { Subject, Observer, Observable } from "rxjs";
import { concatMap } from "rxjs/operators";
import firebase from "firebase";
import { withRouter, RouteComponentProps } from "react-router";
import Button from "@material-ui/core/Button";

import { LinkWrapper } from "../../_HOCs";
import { FormInputsCreator, Spinner } from "../..";
import loginFormModel from "../../../models/login-form";
import { IForm } from "../../../interfaces";
import {
  mapFormValuesForRequest,
  setFocusOnFirstFormElement
} from "../../../lib/forms";
import "./styles.scss";

interface IProps extends RouteComponentProps<{}> {}
interface ILoginState {
  loginForm: IForm;
  loginErrorMessage: string;
  submitting: boolean;
  submitted: boolean;
}

class LoginForm extends PureComponent<IProps, ILoginState> {
  private formNode: React.RefObject<HTMLFormElement>;
  private formSubmitStream$: Subject<React.FormEvent<HTMLFormElement>>;

  constructor(props: IProps) {
    super(props);

    this.formSubmitStream$ = new Subject();
    this.formNode = React.createRef();
    this.state = {
      loginForm: loginFormModel,
      loginErrorMessage: "",
      submitting: false,
      submitted: false
    };
  }

  componentDidMount() {
    this.initializeFormSubmitStream();
  }

  componentWillUnmount() {
    this.formSubmitStream$.unsubscribe();
  }

  initializeFormSubmitStream() {
    this.formSubmitStream$
      .pipe(
        concatMap((e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const mappedForm = mapFormValuesForRequest(this.state.loginForm);
          this.setState(prevState => ({
            ...prevState,
            submitting: true
          }));

          return Observable.create(
            (observer: Observer<firebase.auth.UserCredential>) => {
              firebase
                .auth()
                .signInWithEmailAndPassword(
                  mappedForm.email,
                  mappedForm.password
                )
                .then(data => observer.next(data))
                .catch(error => observer.next(error))
                .finally(() => observer.complete());
            }
          );
        })
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.code) {
          this.loginError(data.message);
        } else {
          this.loginSuccess(data);
        }
      });
  }

  loginSuccess(userData: firebase.auth.UserCredential) {
    const node = ReactDOM.findDOMNode(this);
    if (node !== null) {
      node.dispatchEvent(
        new CustomEvent("open-modal", {
          bubbles: true,
          detail: {
            message: "You are logged in.",
            autoClose: true
          }
        })
      );
    }
    this.props.history.push("/");
  }

  loginError(message: string): void {
    setFocusOnFirstFormElement(this.formNode.current);
    this.setState(prevState => ({
      ...prevState,
      loginErrorMessage: message,
      submitting: false
    }));
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    this.formSubmitStream$.next(e);
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputName: string = e.target.name;
    const loginForm: IForm = Object.assign({}, this.state.loginForm);
    loginForm[inputName].value = e.target.value;

    this.setState(previousState => ({
      ...previousState,
      loginForm
    }));
  };

  render() {
    const FormInputs: JSX.Element[] = FormInputsCreator(
      loginFormModel,
      this.state.loginForm,
      this.handleChange,
      {}
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
        <small className="form-error">{this.state.loginErrorMessage}</small>
        <div className="form-buttons-wrapper">
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            disabled={this.state.submitting}
          >
            Login
          </Button>
          <Button variant="outlined">
            <LinkWrapper href="/register" ariaLabel="go to register page">
              Register
            </LinkWrapper>
          </Button>
        </div>
        {this.state.submitting && <Spinner size={40} />}
      </form>
    );
  }
}

export default withRouter(LoginForm);
