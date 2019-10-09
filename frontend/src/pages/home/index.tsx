import React, { memo } from "react";
import { Fab, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { PhotosList } from "../../components/page-home";
import { LinkWrapper } from "../../components/_HOCs";
import "./styles.scss";
import { connect } from "react-redux";
import { userData } from "../../interfaces";

const HomePage: React.SFC<{ userData: userData }> = ({ userData }) => {
  return (
    <main className="home-page">
      <PhotosList />
      {userData && (
        <LinkWrapper
          ariaLabel="add new photo"
          href="/take-picture"
          className="home-page__take-picture-link"
        >
          <Tooltip title="Add new photo">
            <Fab color="primary" aria-label="Add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </LinkWrapper>
      )}
    </main>
  );
};

function mapStateToProps(state: any) {
  return { userData: state.user.userData };
}

export default connect(mapStateToProps)(memo(HomePage));
