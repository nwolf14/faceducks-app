import React, {
  memo,
  FunctionComponent,
  useEffect,
  SyntheticEvent,
  useCallback
} from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { Subject, of, Subscription } from "rxjs";
import { concatMap, map, catchError } from "rxjs/operators";
import _ from "lodash";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Button, Tooltip, IconButton } from "@material-ui/core";
import CancelRounded from "@material-ui/icons/CancelRounded";

import { FormInputsCreator } from "../..";
import newPhotoFormModel from "../../../models/photo-form";
import Spinner from "../../shared/spinner";
import { IFormWithEvent } from "../../../interfaces";
import { FetchApi } from "../../../services";
import {
  mergeFormWithApiErrors,
  validateForm,
  handleChange,
  setFocusOnFirstInvalidInput
} from "../../../lib/forms";
import "./style.scss";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      width: "100vw",
      margin: "auto",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 4),
      outline: "none",
      [theme.breakpoints.up("sm")]: {
        width: "80vw"
      }
    }
  });
});

const formSubmitStream: Subject<IFormWithEvent> = new Subject();
let streamSubscription: Subscription;

const PhotoModalForm: FunctionComponent<
  {
    capturedImage: string;
    closeForm: React.EventHandler<SyntheticEvent>;
    userName: string;
    userId: string;
  } & RouteComponentProps<{}>
> = memo(({ capturedImage, closeForm, history, userName, userId }) => {
  const userToken = localStorage.getItem("JWT");
  const formNode = React.useRef<HTMLFormElement>(null);
  const [photoForm, setForm] = React.useState(newPhotoFormModel);
  const [submitting, setSubmitting] = React.useState(false);
  const classes = useStyles();

  const initializeFormStream = useCallback(() => {
    streamSubscription = formSubmitStream
      .pipe(
        concatMap(event => {
          return of(event).pipe(
            map(event => validateForm(event)),
            concatMap(mappedForm =>
              FetchApi.post(
                "/api/photos",
                { ...mappedForm, author: userName, photo: capturedImage, authorId: userId },
                userToken
              )
            ),
            catchError(error => of(error))
          );
        })
      )
      .subscribe(result => {
        setSubmitting(false);

        if (result.validatedFormWithErrors) {
          setForm(result.validatedFormWithErrors);
        } else if (result.errors) {
          if (formNode.current instanceof HTMLFormElement) {
            setFocusOnFirstInvalidInput(photoForm, formNode.current.elements);
          }
          setForm(mergeFormWithApiErrors(photoForm, result.errors));
        } else {
          if (formNode.current !== null) {
            formNode.current.dispatchEvent(
              new CustomEvent("open-modal", {
                bubbles: true,
                detail: {
                  message: "Photo was uploaded successfully",
                  autoClose: true
                }
              })
            );
          }
          history.push("/");
        }
      });
  }, [history]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm(handleChange(event, photoForm));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    formSubmitStream.next({ event, form: photoForm, formNode });
    setSubmitting(true);
  }

  const FormInputs: JSX.Element[] = FormInputsCreator(
    newPhotoFormModel,
    photoForm,
    onChange,
    {}
  );

  useEffect(() => {
    initializeFormStream();

    return () => {
      streamSubscription.unsubscribe();
    };
  }, [initializeFormStream]);

  return (
    <div className={`photo-form ${classes.paper}`}>
      <Tooltip title="Close form">
        <IconButton aria-label="close form" onClick={closeForm} color="inherit">
          <CancelRounded />
        </IconButton>
      </Tooltip>

      <form
        onSubmit={handleSubmit}
        ref={formNode}
        aria-live="polite"
        aria-label="new photo form"
      >
        {FormInputs}

        <div className="photo-form__buttons-wrapper">
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            aria-label="upload image"
            disabled={submitting}
          >
            Upload
          </Button>
        </div>

        {submitting && <Spinner size={40} />}
      </form>
    </div>
  );
});

function mapStateToProps(state: any) {
  return {
    userName: _.get(state, ["user", "userData", "userName"], ""),
    userId: _.get(state, ["user", "userData", "id"], "")
  };
}

export default connect(mapStateToProps)(withRouter(PhotoModalForm));
