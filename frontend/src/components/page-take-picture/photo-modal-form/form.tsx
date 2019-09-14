import React, {
  memo,
  FunctionComponent,
  useEffect,
  SyntheticEvent,
  useCallback
} from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { Subject, Observer, Observable, of, Subscription } from "rxjs";
import { concatMap, map, catchError } from "rxjs/operators";
import moment from "moment";
import _ from "lodash";
import firebase from "firebase";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Button, Tooltip, IconButton } from "@material-ui/core";
import CancelRounded from "@material-ui/icons/CancelRounded";

import { FormInputsCreator } from "../..";
import newPhotoFormModel from "../../../models/photo-form";
import Spinner from "../../shared/spinner";
import { IForm, IMappedForm, IUserData } from "../../../interfaces";
import { FormValidator } from "../../../services";
import {
  setFocusOnFirstInvalidInput,
  mapFormValuesForRequest,
  chooseInputValidationSchema,
  setFocusOnFirstFormElement
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

interface IPhotoFromStreamData {
  event: React.FormEvent<HTMLFormElement>;
  photoForm: IForm;
}
const formSubmitStream: Subject<IPhotoFromStreamData> = new Subject();
let streamSubscription: Subscription;

const PhotoModalForm: FunctionComponent<
  {
    capturedImage: string;
    userData: IUserData;
    closeForm: React.EventHandler<SyntheticEvent>;
  } & RouteComponentProps<{}>
> = memo(({ capturedImage, userData, closeForm, history }) => {
  const formNode = React.useRef<HTMLFormElement>(null);
  const [photoForm, setForm] = React.useState(newPhotoFormModel);
  const [formError, setFormError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const classes = useStyles();

  const saveDataToDatabse = useCallback(
    (mappedForm: IMappedForm) => {
      return Observable.create(
        (
          observer: Observer<{ firebaseError: Error } | { success: boolean }>
        ) => {
          const now = moment()
            .utc()
            .unix()
console.log(userData.userName)
          firebase
            .database()
            .ref("/photos/" + now)
            .set(
              {
                date: now,
                author: userData.userName,
                image: "",
                ...mappedForm
              },
              (firebaseError: Error | null) => {
                observer.next(
                  firebaseError ? { firebaseError } : { success: true }
                );
                observer.complete();
              }
            );
        }
      );
    },
    [userData]
  );

  const initializeFormStream = useCallback(() => {
    streamSubscription = formSubmitStream
      .pipe(
        concatMap(event => {
          return of(event).pipe(
            map(validateForm),
            concatMap(saveDataToDatabse),
            catchError(error => of(error))
          );
        })
      )
      .subscribe(result => {
        setSubmitting(false);

        if (result.validatedFormWithErrors) {
          setForm(result.validatedFormWithErrors);
        }
        if (result.firebaseError) {
          setFormError(result.firebaseError.message);
        }
        if (result.success) {
          if (formNode.current !== null) {
            formNode.current.dispatchEvent(
              new CustomEvent("open-modal", {
                bubbles: true,
                detail: {
                  message: "Image was uploaded successfully",
                  autoClose: true
                }
              })
            );
          }
          history.push("/");
        } else if (
          result.firebaseError &&
          formNode.current instanceof HTMLFormElement
        ) {
          setFocusOnFirstFormElement(formNode.current);
        }
      });
  }, [history, saveDataToDatabse]);

  function validateForm({ event, photoForm }: IPhotoFromStreamData) {
    event.preventDefault();
    setSubmitting(true);

    const validatedForm = FormValidator.validateForm(photoForm);
    const inputsWithErrors = _.filter(validatedForm, input => !input.isValid);

    if (formNode.current instanceof HTMLFormElement) {
      if (inputsWithErrors.length > 0) {
        setFocusOnFirstInvalidInput(
          inputsWithErrors,
          formNode.current.elements
        );

        throw { validatedFormWithErrors: validatedForm }; // eslint-disable-line
      }
    }

    return mapFormValuesForRequest(validatedForm);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    const newPhotoForm = Object.assign({}, photoForm);
    let input = newPhotoForm[name] || {};

    input.touched = true;
    input.value = value;
    input = chooseInputValidationSchema(input, name, newPhotoForm);

    newPhotoForm[name] = input;
    setForm(newPhotoForm);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    formSubmitStream.next({ event, photoForm });
  }

  const FormInputs: JSX.Element[] = FormInputsCreator(
    newPhotoFormModel,
    photoForm,
    handleChange,
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
        <small className="form-error">{formError}</small>

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

const mapStateToProps = (state: any) => ({ userData: state.user.userData });

export default connect(mapStateToProps)(withRouter(PhotoModalForm));
