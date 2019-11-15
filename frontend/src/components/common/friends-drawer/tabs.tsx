import React, { FunctionComponent, memo, useCallback } from "react";
import _ from 'lodash';
import { makeStyles } from "@material-ui/core/styles";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import MailIcon from "@material-ui/icons/Mail";
import SendIcon from "@material-ui/icons/Send";
import ChatIcon from "@material-ui/icons/Chat";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./tab-panel";
import { IFriendsDrawerProps } from ".";
import {
  IFriend,
  IFriendsRequestsOutcoming,
  IFriendsRequestsIncoming
} from "../../../interfaces";
import { Tooltip, IconButton } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

const FriendsDrawerTabs: FunctionComponent<IFriendsDrawerProps & { closeDrawer: Function }> = ({
  friends_list,
  friends_requests_incoming,
  friends_requests_outcoming,
  closeDrawer
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = useCallback((event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }, [value]);

  const handleChatClick = () => {
    closeDrawer();
  };

  console.log(friends_requests_incoming)

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab icon={<PersonPinIcon />} label="Friends" />
        <Tab icon={<MailIcon />} label="req. received" />
        <Tab icon={<SendIcon />} label="req. sent" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <ul>
          {_.map(friends_list, (friend: IFriend) => (
            <li>
              {friend.userName}
              <Tooltip title="Chat">
                <IconButton aria-label={`Start chat with ${friend.userName}`} color="inherit">
                  <ChatIcon onClick={handleChatClick} />
                </IconButton>
              </Tooltip>
            </li>
          ))}
        </ul>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ul>
          {_.map(friends_requests_incoming, (friend: IFriendsRequestsIncoming) => (
            <li>
              {friend.fromUser}
              <Tooltip title="Accept">
                <IconButton aria-label={`Accept request from ${friend.fromUser}`} color="inherit">
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refuse">
                <IconButton aria-label={`Refuse request from ${friend.fromUser}`} color="inherit">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </li>
          ))}
        </ul>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ul>
          {_.map(friends_requests_outcoming, (friend: IFriendsRequestsOutcoming) => (
            <li>
              {friend.toUser}
            </li>
          ))}
        </ul>
      </TabPanel>
    </Paper>
  );
};

export default memo(FriendsDrawerTabs);
