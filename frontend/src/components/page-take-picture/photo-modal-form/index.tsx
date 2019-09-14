import React, { PureComponent, Fragment } from "react";
import { Fab, Tooltip, Modal } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Form from "./form";
import "./style.scss";

interface ModalPhotoFormProps {
  offline: boolean;
  capturedImage: string;
}

export default class ModalPhotoForm extends PureComponent<
  ModalPhotoFormProps,
  { isFormOpen: boolean }
> {
  constructor(props: ModalPhotoFormProps) {
    super(props);

    this.state = {
      isFormOpen: false
    };
  }

  handleOpenForm = () => {
    this.setState(prevState => ({
      ...prevState,
      isFormOpen: true
    }));
  };

  handleCloseForm = () => {
    this.setState(prevState => ({
      ...prevState,
      isFormOpen: false
    }));
  };

  render() {
    return (
      <Fragment>
        <Tooltip title="Save photo">
          <Fab
            aria-label="save photo"
            onClick={this.handleOpenForm}
            color="primary"
            disabled={this.props.offline}
          >
            <SaveIcon />
          </Fab>
        </Tooltip>

        <Modal aria-label="photo form" open={this.state.isFormOpen}>
          <div className="photo-modal-form__form-wrapper">
            <Form
              capturedImage={this.props.capturedImage}
              closeForm={this.handleCloseForm}
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}
