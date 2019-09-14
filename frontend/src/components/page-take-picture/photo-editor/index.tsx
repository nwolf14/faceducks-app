import React, { createRef, Component, Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import MenuIcon from "@material-ui/icons/Menu";
import { Tooltip, Fab } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import { WithStyles, withStyles } from "@material-ui/styles";
import Brush from "./brush";
import Stickers from "./stickers";
import "./index.scss";
import { PhotoBase64Stream } from '../common';
import { effectiveDeviceWidth } from "../../../lib/functions";

const drawerWidth = 240;

const styles = createStyles({
  root: {
    display: "flex"
  },
  mobileDrawerHandler: {
    position: "fixed",
    left: "0",
    right: "0",
    margin: "auto",
    bottom: "18%",
    zIndex: 20
  },
  drawer: {
    "@media (min-width:600px)": {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth,
    top: "64px"
  },
  content: {
    flexGrow: 1,
    padding: 24
  }
});

type editorTools = "brush" | "stickers" | "";

interface IPhotoEditorProps extends WithStyles<typeof styles> {
  imageBase64: string;
  webcam: HTMLVideoElement | null;
}
interface IPhotoEditorState {
  isDrawerOpen: boolean;
  activeEditorTool: editorTools;
  activeToolOptions: JSX.Element | null;
}

class PhotoEditor extends Component<IPhotoEditorProps, IPhotoEditorState> {
  private canvasNode: React.RefObject<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null;
  private imageVersions: Array<string>;

  constructor(props: IPhotoEditorProps) {
    super(props);

    this.ctx = null;
    this.canvasNode = createRef<HTMLCanvasElement>();
    this.imageVersions = [props.imageBase64];

    this.state = {
      isDrawerOpen: false,
      activeEditorTool: "",
      activeToolOptions: null
    };
  }

  componentDidMount() {
    this.drawImage();
    document.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (event: KeyboardEvent) => {
    if (event.keyCode === 90 && event.ctrlKey && this.imageVersions.length > 1) {
      this.imageVersions.shift()
      PhotoBase64Stream.next(this.imageVersions[0]);
      this.drawImage();
    }
  }

  handleDragOver = (event: React.DragEvent<HTMLCanvasElement>) => {
    event.preventDefault();
  };

  handleDrop = (event: React.DragEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (this.ctx) {
      const imgNode = document.querySelector(
        "#" + event.dataTransfer.getData("id")
      ) as HTMLImageElement;
      if (imgNode) {
        const target = event.target as HTMLCanvasElement;
        const offsetX = (event.pageX | event.screenX) - target.offsetLeft;

        this.ctx.drawImage(imgNode, offsetX, event.clientY - 64);
      }

      if (this.canvasNode.current) {
        this.imageVersions.unshift(this.canvasNode.current.toDataURL("image/jpeg"));
        PhotoBase64Stream.next(this.imageVersions[0])
      }
    }
  };

  toggleDrawer = () => {
    this.setState(prevProps => ({
      ...prevProps,
      isDrawerOpen: !prevProps.isDrawerOpen
    }));
  };

  setActiveEditorTool = (value: editorTools, tools: JSX.Element) => {
    this.setState(prevProps => ({
      ...prevProps,
      activeEditorTool: value,
      activeToolOptions: tools
    }));
  };

  saveNewBase64Photo = (imageBase64: string) => {
    this.imageVersions.unshift(imageBase64);
    PhotoBase64Stream.next(imageBase64);
  }

  drawImage() {
    const canvas = this.canvasNode.current;
    const { webcam } = this.props;

    if (
      canvas instanceof HTMLCanvasElement &&
      webcam instanceof HTMLVideoElement
    ) {
      const imageBase64 = this.imageVersions[0];
      const screenWidth = effectiveDeviceWidth();
      let canvasHeight = webcam.videoHeight;
      let canvasWidth = webcam.videoWidth;
      this.ctx = canvas.getContext("2d");
      const image = new Image();

      if (screenWidth < webcam.videoWidth) {
        canvasWidth = screenWidth;
        canvasHeight = (screenWidth / webcam.videoWidth) * webcam.videoHeight;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      image.onload = () => {
        if (this.ctx !== null) {
          this.ctx.drawImage(image, 0, 0);
        }
      };
      image.src = imageBase64;
    }
  }

  render() {
    const { classes } = this.props;
    const drawerContent = (
      <Fragment>
        <div className="photo-editor__tools-wrapper">
          <Brush
            canvasNode={this.canvasNode}
            activeEditorTool={this.state.activeEditorTool}
            setActiveEditorTool={this.setActiveEditorTool}
            saveNewBase64Photo={this.saveNewBase64Photo}
          />
          <Stickers
            canvasNode={this.canvasNode}
            activeEditorTool={this.state.activeEditorTool}
            setActiveEditorTool={this.setActiveEditorTool}
            toggleDrawer={this.toggleDrawer}
          />
        </div>
        <Divider />
        <div className="photo-editor__active-tools-wrapper">
          {this.state.activeToolOptions}
        </div>
      </Fragment>
    );

    return (
      <div className="photo-editor">
        <canvas
          ref={this.canvasNode}
          className="photo-editor__canvas"
          onDrop={this.handleDrop}
          onDragOver={this.handleDragOver}
        />

        <Tooltip title="Open photo editor">
          <Fab
            color="primary"
            aria-label="open photo editor"
            onClick={this.toggleDrawer}
            className={classes.mobileDrawerHandler}
          >
            <MenuIcon />
          </Fab>
        </Tooltip>

        <div className={`photo-editor__drawer ${classes.root}`}>
          <CssBaseline />

          <nav className={classes.drawer} aria-label="photo editor tools">
            <Hidden lgUp implementation="css">
              <Drawer
                variant="temporary"
                anchor="left"
                open={this.state.isDrawerOpen}
                onClose={this.toggleDrawer}
                classes={{
                  paper: classes.drawerPaper
                }}
                ModalProps={{
                  keepMounted: true
                }}
              >
                {drawerContent}
              </Drawer>
            </Hidden>
            {/* <Hidden mdDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper
                }}
                variant="permanent"
                open
              >
                {drawerContent}
              </Drawer>
            </Hidden> */}
          </nav>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PhotoEditor);
