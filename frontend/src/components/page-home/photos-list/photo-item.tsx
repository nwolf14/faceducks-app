import React, { FunctionComponent, memo } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: "531px",
      position: "relative"
    },
    media: {
      display: 'block',
      maxWidth: '100%',
      maxHeight: '330px',
      margin: 'auto'
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    }
  })
);

export interface IPhotoItemProps {
  author: string;
  created_at: string;
  photo: string;
  description: string;
  index: number;
  style: any;
}

const PhotoItem: FunctionComponent<IPhotoItemProps> = ({
  author,
  created_at,
  photo,
  description,
  index,
  style
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  return (
    <div style={style}>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              aria-label={`${author}'s avatar`}
              className={classes.avatar}
            >
              {author.substr(0, 1).toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={author}
          subheader={created_at}
        />
        <img
          className={classes.media}
          src={photo}
          alt={`${author}'s photo`}
          title={`${author}'s photo`}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            <span>
              {index} {description}
            </span>
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>Show comments</CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

export default memo(PhotoItem);
