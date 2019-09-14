import React, { PureComponent } from "react";
import { getConfig } from "../../../lib/functions";
import './styles.scss';

const googleRecaptchaApiKey = getConfig("GOOGLE_RECAPTCHA");
const googleRecaptchaScriptUrl = getConfig("GOOGLE_RECAPTCHA_SCRIPT_URL");

declare global {
  interface Window {
    customRecaptchaValidationCallback: React.ChangeEvent<HTMLInputElement> | Function;
    customRecaptchaExpiredCallback: React.ChangeEvent<HTMLInputElement> | Function;
  }
}

interface IProps {
  recaptchaHandler: React.ChangeEvent<HTMLInputElement> | Function;
}

export default class Recaptcha extends PureComponent<IProps, {}> {
  private recaptchaNodeWrapper: React.RefObject<HTMLDivElement>;

  constructor(props: IProps) {
    super(props);
    this.recaptchaNodeWrapper = React.createRef();
  }

  private appendGoogleCapchaScript() {
    const script = document.createElement("script");
    script.id = "googleRecaptcha";
    script.src = googleRecaptchaScriptUrl;
    script.async = true;

    if (this.recaptchaNodeWrapper.current instanceof HTMLDivElement) {
      this.recaptchaNodeWrapper.current.appendChild(script);
    }

    window.customRecaptchaValidationCallback = this.props.recaptchaHandler;
    window.customRecaptchaExpiredCallback = this.props.recaptchaHandler;
  }

  private cleanGoogleRecaptchaFromWindowObject() {
    delete window.customRecaptchaValidationCallback;
    delete window.customRecaptchaExpiredCallback;
  }

  componentDidMount() {
    this.appendGoogleCapchaScript();
  }

  componentWillUnmount() {
    this.cleanGoogleRecaptchaFromWindowObject();
  }

  render() {
    return (
      <div
        className="recaptcha"
        ref={this.recaptchaNodeWrapper}
      >
        <div
          className="g-recaptcha"
          data-callback="customRecaptchaValidationCallback"
          data-sitekey={googleRecaptchaApiKey}
          data-expired-callback="customRecaptchaExpiredCallback"
        />
        <input type="hidden" value="" />
      </div>
    );
  }
}
