import React, { FunctionComponent } from "react";
import ClickWrapper from "./wrapper";

export interface IProps {
  ariaLabel?: string;
  callback: Function;
  callbackParams?: Array<any>;
  isDisabled?: boolean;
  className?: string;
  tabIndex?: number;
}

export default (
  Component: React.ComponentType<{ [key: string]: any }> 
): FunctionComponent<IProps> => ({
  className,
  ariaLabel,
  callback,
  callbackParams,
  isDisabled, 
  tabIndex,
  ...props
}) => (
  <ClickWrapper
    callback={callback}
    callbackParams={callbackParams}
    className={className}
    ariaLabel={ariaLabel}
    isDisabled={isDisabled}
    tabIndex={tabIndex}
  >
    <Component {...props} />
  </ClickWrapper>
);
