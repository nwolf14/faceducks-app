import React, { memo } from "react";
import { connect } from "react-redux";
import { Fab, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { IUserDataProps } from "../../interfaces";
import { PhotosList } from "../../components/page-home";
import { LinkWrapper } from "../../components/_HOCs";
import "./styles.scss";

const HomePage: React.SFC<IUserDataProps> = memo(({ userData }) => {
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
});

const mapStateToProps = (state: any) => ({ userData: state.user.userData });

export default connect(mapStateToProps)(HomePage);
