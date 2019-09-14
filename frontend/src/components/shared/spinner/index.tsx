import React, { memo } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./styles.scss";

const Spinner: React.SFC<{ size: number }> = ({ size = 40 }) => (
  <div className="spinner-overlay">
    <CircularProgress size={size} />
  </div>
);

export default memo(Spinner);
