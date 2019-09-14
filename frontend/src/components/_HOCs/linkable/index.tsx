import React, { FunctionComponent } from "react";
import LinkWrapper from "./wrapper";

export interface IProps {
  href: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  ariaDescribedBy?: string;
  className?: string;
  tabIndex?: number;
  target?: string;
  rel?: string;
}

export default (
  Component: React.ComponentType<{ [key: string]: any }>
): FunctionComponent<IProps> =>({
    href,
    ariaLabel,
    ariaHidden,
    ariaDescribedBy,
    className,
    tabIndex,
    target,
    rel,
    ...props
  }) => (
    <LinkWrapper
      href={href}
      ariaLabel={ariaLabel}
      ariaHidden={ariaHidden}
      ariaDescribedBy={ariaDescribedBy}
      className={className}
      tabIndex={tabIndex}
      target={target}
      rel={rel}
    >
      <Component {...props} />
    </LinkWrapper>
  );
