import React, { FunctionComponent } from "react";
import './styles.scss';
import { isEnter, fireCallback } from "../../../lib/functions";
import { IProps } from './index';

const Wrapper: FunctionComponent<IProps & { children: React.ReactNode | null | Element } > = ({
  callback = () => {},
  callbackParams = [],
  className = '',
  ariaLabel = '',
  isDisabled = false,
  tabIndex = 0,
  children = null,
  ...props
}) => {

  function maybeEnter(event: React.KeyboardEvent): void {
    if (isEnter(event)) {
      onClick();
    }
  }

  function onClick() {
    if (!isDisabled) {
      if (Array.isArray(callbackParams)) {
        fireCallback(callback, ...callbackParams);
      } else {
        fireCallback(callback, callbackParams);
      }
    }
  }

  return (
    <span
      role="button"
      aria-label={ariaLabel}
      onKeyDown={maybeEnter}
      tabIndex={isDisabled ? -1 : tabIndex}
      className={`${isDisabled ? "" : "c-clickable"} ${className}`}
      onClick={onClick}
      {...props}
    >
      <span
        className={`c-clickable__content ${className}`}
        tabIndex={-1}
      >
        {children}
      </span>
    </span>
  );
};

export default Wrapper;
