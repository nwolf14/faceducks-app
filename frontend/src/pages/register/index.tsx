import React, { memo } from "react";
import { RegisterForm } from "../../components/page-register";
import { Grid, createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      justifyContent: "center",
      height: "90vh",
      padding: theme.spacing(2)
    }
  })
);

export default memo(() => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <RegisterForm />
      </Grid>
    </Grid>
  );
});
