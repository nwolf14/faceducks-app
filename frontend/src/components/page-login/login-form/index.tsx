import React, { PureComponent } from "react";
import ReactDOM from 'react-dom';
import { Subject } from "rxjs";
import { concatMap } from "rxjs/operators";
import { withRouter, RouteComponentProps } from "react-router";
import Button from "@material-ui/core/Button";

import { LinkWrapper } from "../../_HOCs";
import { FormInputsCreator, Spinner, FormErrors } from "../..";
import LoginFormModel from "../../../models/login-form";
import { IForm, IObjectOfStrings } from "../../../interfaces";
import {
  mapFormValuesForRequest,
  setFocusOnFirstFormElement
} from "../../../lib/forms";
import "./styles.scss";
import { FetchApi } from "../../../services";
import { getUser } from "../../../redux/actions/users";
import { connect } from "react-redux";

interface IProps extends RouteComponentProps<{}> {
  getUser: Function;
}
interface ILoginState {
  loginForm: IForm;
  loginErrors: IObjectOfStrings | string | null;
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
      loginForm: LoginFormModel,
      loginErrors: null,
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

          return FetchApi.post<any>('/api/users/signin', mappedForm);
        }),
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.errors) {
          this.loginError(data.errors);
        } else {
          this.loginSuccess(data.token);
        }
      });
  }

  loginSuccess(token: string) {
    localStorage.setItem('JWT', token);
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

    this.props.getUser(token);

    this.props.history.push("/");
  }

  loginError(errors: string | IObjectOfStrings): void {
    setFocusOnFirstFormElement(this.formNode.current);
    this.setState(prevState => ({
      ...prevState,
      loginErrors: errors,
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
      LoginFormModel,
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
        <FormErrors errors={this.state.loginErrors} />
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

export default connect(null, { getUser })(withRouter(LoginForm));
