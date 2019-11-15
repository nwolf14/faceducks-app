import React, {
  FunctionComponent,
  memo,
  useState,
  useEffect,
  useCallback
} from "react";
import { connect } from "react-redux";
import { fromEvent } from "rxjs";
import _ from "lodash";
import { Hidden, Drawer } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import { CUSTOM_EVENTS } from "../../../lib/constants";
import Tabs from "./tabs";
import {
  IFriend,
  IFriendsRequestsIncoming,
  IFriendsRequestsOutcoming,
  IObjectOfObject
} from "../../../interfaces";

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: 256,
      "@media (min-width:600px)": {
        flexShrink: 0,
        width: "auto"
      }
    },
    drawerPaper: {
      top: "64px",
      width: 256,
      "@media (min-width:600px)": {
        flexShrink: 0,
        width: "auto"
      }
    }
  })
);

export interface IFriendsDrawerProps {
  friends_list: IObjectOfObject<IFriend>;
  friends_requests_incoming: IObjectOfObject<IFriendsRequestsIncoming>;
  friends_requests_outcoming: IObjectOfObject<IFriendsRequestsOutcoming>;
}

const FriendsDrawer: FunctionComponent<IFriendsDrawerProps> = memo(props => {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fromEvent(window, CUSTOM_EVENTS.TOGGLE_FRIENDS_DRAWER).subscribe(() => {
      setDrawerOpen(!isDrawerOpen);
    });
  }, []);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(!isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <nav className={classes.drawer} aria-label="photo editor tools">
      <Hidden lgUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true
          }}
        >
          <Tabs {...props} closeDrawer={toggleDrawer}/>
        </Drawer>
      </Hidden>
    </nav>
  );
});

function mapStateToProps(state: any) {
  return {
    friends_list: _.get(state.user, ["userData", "friends"], {}),
    friends_requests_incoming: _.get(
      state.user,
      ["userData", "friends_requests_incoming"],
      {}
    ),
    friends_requests_outcoming: _.get(
      state.user,
      ["userData", "friends_requests_outcoming"],
      {}
    )
  };
}

export default connect(mapStateToProps)(FriendsDrawer);
