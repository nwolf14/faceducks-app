import React, { PureComponent } from "react";
import BrushIcon from "@material-ui/icons/Brush";
import { Tooltip, Fab } from "@material-ui/core";

interface IBrushProps {
  canvasNode: React.RefObject<HTMLCanvasElement>;
  setActiveEditorTool: Function;
  activeEditorTool: string;
  saveNewBase64Photo: Function;
}

export default class Brush extends PureComponent<IBrushProps, {}> {
  private mousePressed: boolean;
  private listenersAttached: boolean;
  private ctx: CanvasRenderingContext2D | null;

  constructor(props: IBrushProps) {
    super(props);

    this.mousePressed = false;
    this.listenersAttached = false;
    this.ctx = null;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.attachHandlers();
    const canvas = this.props.canvasNode.current;
    if (canvas) {
      this.ctx = canvas.getContext("2d");
    }
  }

  componentDidUpdate() {
    this.attachHandlers();
    if (this.props.activeEditorTool !== "brush") {
      this.removeHandlers();
    }
  }

  componentWillUnmount() {
    this.removeHandlers();
  }

  attachHandlers() {
    const { canvasNode } = this.props;

    if (canvasNode.current && this.props.activeEditorTool === "brush" && !this.listenersAttached) {
      canvasNode.current.addEventListener("mousedown", this.handleMouseDown);
      canvasNode.current.addEventListener("mousemove", this.handleMouseMove);
      canvasNode.current.addEventListener("mouseup", this.handleMouseUp);
      this.listenersAttached = true;
    }
  }

  removeHandlers() {
    const { canvasNode } = this.props;

    if (canvasNode.current) {
      canvasNode.current.removeEventListener("mousedown", this.handleMouseDown);
      canvasNode.current.removeEventListener("mousemove", this.handleMouseMove);
      canvasNode.current.removeEventListener("mouseup", this.handleMouseUp);
      this.listenersAttached = false;
    }
  }

  handleClick() {
    this.props.setActiveEditorTool("brush", null);
  }

  handleMouseDown(event: MouseEvent) {
    this.mousePressed = true;

    if (this.ctx) {
      this.ctx.lineWidth = 10;
      this.ctx.lineJoin = this.ctx.lineCap = 'round';
      this.ctx.moveTo(event.offsetX, event.offsetY);
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (this.mousePressed && this.ctx) {
      this.ctx.lineTo(event.offsetX, event.offsetY);
      this.ctx.stroke();
    }
  }

  handleMouseUp() {
    this.mousePressed = false;
    const { canvasNode } = this.props;
    if (canvasNode.current) {
      this.props.saveNewBase64Photo(canvasNode.current.toDataURL("image/jpeg"));
    }
  }

  render() {
    return (
      <Tooltip title="Activate brush">
        <Fab aria-label="activate brush" onClick={this.handleClick}>
          <BrushIcon />
        </Fab>
      </Tooltip>
    );
  }
}
