import React, { PureComponent, createRef } from "react";
import { Fab, Tooltip } from "@material-ui/core";
import AddPhotoIcon from "@material-ui/icons/AddAPhoto";
import DeleteIcon from "@material-ui/icons/Delete";
import { WithStyles, withStyles, createStyles } from "@material-ui/styles";

import { PhotoBase64Stream } from "../common";
import { Webcam } from "../../../services/";
import { IBase64ImageWithSize } from "../../../interfaces";
import { PhotoEditor, PhotoModalForm } from "../";
import { Subscription } from "rxjs";
import "./index.scss";
import { connect } from "react-redux";

const styles = createStyles({
  fabTakePhoto: {
    position: "fixed",
    bottom: "10%",
    left: "0",
    right: "0",
    margin: "auto"
  },
  fabDiscardPhoto: {
    marginRight: "2rem"
  }
});

interface ICameraProps extends WithStyles<typeof styles> {
  offline: boolean;
}

interface ICameraState {
  isCaptured: boolean;
  isUploading: boolean;
  isFormOpen: boolean;
  capturedImage: string;
  cameraDimensions: {
    width: number;
    heigth: number;
  };
}

class Camera extends PureComponent<ICameraProps, ICameraState> {
  private webcam: Webcam | null;
  private webcamNode: React.RefObject<HTMLVideoElement>;
  private webcamSubscription: Subscription | null;
  private photoBase64StreamSubscription: Subscription | null;

  constructor(props: ICameraProps) {
    super(props);
    this.webcam = null;
    this.webcamNode = createRef();
    this.webcamSubscription = null;
    this.photoBase64StreamSubscription = null;

    this.state = {
      capturedImage: "",
      isFormOpen: false,
      isCaptured: false,
      isUploading: false,
      cameraDimensions: {
        width: 0,
        heigth: 0
      }
    };
  }

  componentDidMount() {
    const videoCamNode: HTMLVideoElement | null = document.querySelector(
      "#webcam"
    );

    if (videoCamNode instanceof HTMLVideoElement) {
      this.webcam = new Webcam(videoCamNode);
      this.webcamSubscription = this.webcam.setup().subscribe(
        (data: any) => {
          this.setState(prevProps => ({
            ...prevProps,
            cameraDimensions: data
          }));
        },
        error => console.log(error)
      );
    }

    this.photoBase64StreamSubscription = PhotoBase64Stream.subscribe(
      (updatedBase64Photo: any) => {
        this.setState(prevProps => ({
          ...prevProps,
          capturedImage: updatedBase64Photo
        }));
      }
    );
  }

  componentWillUnmount() {
    if (this.webcamSubscription) {
      this.webcamSubscription.unsubscribe();
    }
    if (this.photoBase64StreamSubscription) {
      this.photoBase64StreamSubscription.unsubscribe();
    }
  }

  captureImage = (): void => {
    if (this.webcam instanceof Webcam) {
      const capturedData: IBase64ImageWithSize = this.webcam.takeBase64Photo({
        type: "jpg",
        quality: 1
      });
      this.setState(prevState => ({
        ...prevState,
        isCaptured: true,
        capturedImage: capturedData.base64
      }));
    }
  };

  discardImage = (): void => {
    this.setState(prevState => ({
      ...prevState,
      isCaptured: false,
      capturedImage: ""
    }));
  };

  render() {
    const buttons: JSX.Element =
      this.state.isCaptured && this.state.capturedImage ? (
        <div className="camera__buttons-wrapper">
          <Tooltip title="Discard photo">
            <Fab
              aria-label="discard photo"
              onClick={this.discardImage}
              color="secondary"
              className={this.props.classes.fabDiscardPhoto}
            >
              <DeleteIcon />
            </Fab>
          </Tooltip>
          <PhotoModalForm
            capturedImage={this.state.capturedImage}
            offline={this.props.offline}
          />
        </div>
      ) : (
        <Tooltip title="Take photo">
          <Fab
            color="primary"
            aria-label="take photo"
            onClick={this.captureImage}
            className={this.props.classes.fabTakePhoto}
          >
            <AddPhotoIcon />
          </Fab>
        </Tooltip>
      );

    return (
      <div className="camera">
        <video
          id="webcam"
          className={`camera__camera-node ${
            this.state.isCaptured ? "hidden" : ""
          }`}
          ref={this.webcamNode}
          width={this.state.cameraDimensions.width}
          height={this.state.cameraDimensions.heigth}
          autoPlay
          playsInline
          muted
        />

        {this.state.isCaptured && (
          <PhotoEditor
            imageBase64={this.state.capturedImage}
            webcam={this.webcamNode.current}
          />
        )}

        {buttons}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    offline: state.common.offline
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Camera));

// function isNumberPopulated(field: number): boolean {
//   return field !== null && field !== undefined;
// }
// function isStringPopulated(field: string): boolean {
//   return field !== null && field !== undefined && field !== "";
// }

// function isPopulated(field: number): boolean;
// function isPopulated(field: string): boolean;
// function isPopulated(field: string | number): boolean {
//   return typeof field === "number"
//     ? field !== null && field !== undefined
//     : field !== null && field !== undefined && field !== "";
// }

// // *************

// function isFieldPopulated<T>(field: T): boolean {
//   return typeof field === "string"
//     ? field !== null && field !== undefined && field !== ""
//     : field !== null && field !== undefined;
// }

// type Stages = {
//   pending: "Pending";
//   started: "Started";
//   completed: "Completed";
// };
// type StagesUnion = keyof Stages === "Pending" || "Started" || "completed"

// type GradeMap = { [P in Grade]: string } === type GradeMap = {
//   gold: string;
//   silver: string;
//   bronze: string
// };

// type Stringify<T> = { [P in keyof T]: string }; // all T props must be strings

// type ReadonlyPerson = { readonly [P in keyof IPerson]: IPerson[P] === type ReadonlyPerson = {
//    readonly id: number
//    readonly name: string
// };