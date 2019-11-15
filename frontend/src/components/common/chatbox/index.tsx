import React, {
  FunctionComponent,
  memo,
  useEffect,
  useCallback
} from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import {
  IFriend,
  IFriendsRequestsIncoming,
  IFriendsRequestsOutcoming,
  IObjectOfObject
} from "../../../interfaces";
import { IUserData } from "../../../interfaces";

const useStyles = makeStyles(() =>
  createStyles({

  })
);

let connection: WebSocket | null = null;

interface IChatProps {
  userData: IUserData | null;
}

const Chatbox: FunctionComponent<IChatProps> = memo(({ userData }) => {
  const classes = useStyles();

  const closeWSConnection = useCallback(() => {
    if (connection) {
      connection.close();
      connection = null;
    }
  }, []);

  useEffect(() => {
    if (!userData && connection) closeWSConnection();
    if (!WebSocket || !userData) return;
    
    connection = new WebSocket('ws://127.0.0.1:1337');
    connection.onopen = function () {
      console.log('connection opened')
      if (connection) {
        const message = { type: 'onopen', from: userData.userName, to: 'dupa', JWT: localStorage.getItem("JWT") };
        connection.send(JSON.stringify(message));
      }
    };
    connection.onerror = function (error) {
      console.log(`error: ${error}`)
    };
    connection.onmessage = function (message: any) {
      const messageParsed = JSON.parse(message.data);
      console.log('message:', messageParsed)
    };

    window.addEventListener('beforeunload', closeWSConnection)

    return () => {
      window.removeEventListener('beforeunload', closeWSConnection)
    }
  }, [userData]);

  return (
    <div></div>
  );
});

function mapStateToProps(state: any) {
  return {
    userData: state.user.userData
  };
}

export default connect(mapStateToProps)(Chatbox);
