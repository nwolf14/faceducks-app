import React, { PureComponent, Fragment } from "react";
import CollectionsIcon from "@material-ui/icons/Collections";
import "./index.scss";
import { Tooltip, Fab } from "@material-ui/core";

interface IStickersProps {
  canvasNode: React.RefObject<HTMLCanvasElement>;
  setActiveEditorTool: Function;
  activeEditorTool: string;
  toggleDrawer: Function;
}

export default class Stickers extends PureComponent<IStickersProps, {}> {
  private stickerTools: JSX.Element | null;

  constructor(props: IStickersProps) {
    super(props);

    this.stickerTools = null;
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.stickerTools = this.renderStickerTools();
  }

  handleClick() {
    this.props.setActiveEditorTool("stickers", this.stickerTools);
  }

  handleDragStart = (event: React.DragEvent<HTMLImageElement>) => {
    this.props.toggleDrawer();
    const target = event.target as HTMLImageElement;
    event.dataTransfer.setData("id", target.id);
  };

  renderStickerTools() {
    return (
      <div className="stickers__options-wrapper">
        <img
          id="heartSticker"
          src="/images/heart.png"
          className="stickers__option-item"
          alt="heart sticker"
          draggable={true}
          onDragStart={this.handleDragStart}
        />
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        <Tooltip title="Add stickers">
          <Fab aria-label="add stickers" onClick={this.handleClick}>
            <CollectionsIcon />
          </Fab>
        </Tooltip>
      </Fragment>
    );
  }
}
