import React, { memo, FunctionComponent } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import "./styles.scss";

interface IProps extends RouteComponentProps<{}> {
  href: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  ariaDescribedBy?: string;
  className?: string;
  tabIndex?: number;
  target?: string;
  rel?: string;
  children: React.ReactNode | null;
}

const LinkWrapper: FunctionComponent<IProps> = memo(
  ({
    href = "",
    ariaLabel = "",
    ariaHidden = false,
    ariaDescribedBy = "",
    className = "",
    tabIndex = 0,
    children = null,
    target = "_self",
    rel = "next",
    history
  }: IProps) => {

    function onClick(e: React.SyntheticEvent) {
      e.preventDefault();
      history.push(href);
    }

    return (
      <a
        className="c-link"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        aria-describedby={ariaDescribedBy}
        tabIndex={tabIndex}
        target={target}
        href={href}
        rel={rel}
        onClick={onClick}
      >
        <span className={`c-link-content ${className}`} tabIndex={-1}>
          {children}
        </span>
      </a>
    );
  }
);

export default withRouter(LinkWrapper);
