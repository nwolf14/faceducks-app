import React, { FunctionComponent, memo, Fragment, useMemo } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
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
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import PeopleIcon from "@material-ui/icons/PeopleOutline";
import { userData } from "../../../interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      position: "relative",
      marginBottom: "1.5rem"
    },
    media: {
      display: "block",
      maxWidth: "100%",
      maxHeight: "330px",
      margin: "auto"
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
    cardHeader: {
      display: "inline-flex",
      alignItems: "center"
    },
    iconsWrapper: {
      display: "inline-flex",
      marginRight: ".5rem"
    },
    icon: {
      cursor: "pointer"
    },
    avatar: {
      backgroundColor: red[500]
    }
  })
);

export interface IPhotoItemProps {
  userData: userData;
  author: string;
  created_at: string;
  photo: string;
  description: string;
  _id: string;
}

const PhotoItem: FunctionComponent<IPhotoItemProps> = ({
  author,
  created_at,
  photo,
  description,
  userData
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const AddFriendsIcon = useMemo(() => {
    if (userData && userData.userName !== author) {
      if (
        !userData.friends[author] &&
        !userData.friends_requests_outcoming[author] &&
        !userData.friends_requests_incoming[author]
      ) {
        return <PersonAddIcon classes={{ root: classes.icon }} />;
      } else if (userData.friends[author]) {
        return <PeopleIcon classes={{ root: classes.icon }} />;
      } else {
        return <PersonOutlinedIcon classes={{ root: classes.icon }} />;
      }
    }

    return null;
  }, [userData]);

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Fragment>
            <div className={classes.iconsWrapper}>{AddFriendsIcon}</div>
            <Avatar
              aria-label={`${author}'s avatar`}
              className={classes.avatar}
            >
              {author.substr(0, 1).toUpperCase()}
            </Avatar>
          </Fragment>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        classes={{
          avatar: classes.cardHeader
        }}
        title={author}
        subheader={created_at}
      />
      <img
        className={classes.media}
        src={photo}
        alt={`${author}'s`}
        title={`${author}'s`}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          <span>{description}</span>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <span>Show comments (6)</span>
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
        <CardContent>Dupa :)</CardContent>
      </Collapse>
    </Card>
  );
};

export default memo(PhotoItem);
