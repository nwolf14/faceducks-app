import React, { memo } from "react";
import _ from 'lodash';

import { IObjectOfStrings } from '../../../interfaces';
import "./styles.scss";


const FormErrors: React.SFC<{ errors: IObjectOfStrings | string | null }> = ({ errors = null }) => {
  if (!errors) return null;

  if (typeof errors === "string") {
    return <span>{errors}</span>;
  }

  return (
    <div className="form-errors">
      {_.map(errors, (error, key) => {
        return (
          <p key={key}>
            {key}: {error}
          </p>
        );
      })}
    </div>
  );
};

export default memo(FormErrors);
