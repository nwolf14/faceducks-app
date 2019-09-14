import React from "react";
import { Popover, Typography } from "@material-ui/core";
import { WithStyles, withStyles, createStyles } from "@material-ui/styles";

const styles = createStyles({
  typo: {
    padding: "1rem",
    fontSize: "1.2rem",
    color: "#fff"
  },
  typoInfo: {
    backgroundColor: "#3f51b5"
  },
  typoError: {
    backgroundColor: "red"
  }
});

interface IProps extends WithStyles<typeof styles> {}
interface IState {
  isOpen: boolean;
  message: string;
  type: "info" | "error";
}

class CustomPopover extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isOpen: false,
      message: "",
      type: "info"
    };
  }

  componentDidMount() {
    window.addEventListener("open-modal", this.handleOpenModal);
  }

  componentWillUnmount() {
    window.removeEventListener("open-modal", this.handleOpenModal);
  }

  private handleOpenModal = (event: Event): void => {
    const customEvent = event as CustomEvent;
    customEvent.stopPropagation();

    this.setState({
      isOpen: true,
      message: customEvent.detail.message ? customEvent.detail.message : "",
      type: customEvent.detail.type ? customEvent.detail.type : "info"
    });
  };

  private handleCloseModal = (): void => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Popover
        open={this.state.isOpen}
        anchorEl={window.document.body}
        onClose={this.handleCloseModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Typography
          className={`${this.props.classes.typo} ${
            this.state.type === "info"
              ? this.props.classes.typoInfo
              : this.props.classes.typoError
          }`}
        >
          {this.state.message}
        </Typography>
      </Popover>
    );
  }
}

export default withStyles(styles)(CustomPopover);
